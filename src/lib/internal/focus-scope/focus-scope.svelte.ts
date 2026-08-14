import { type Getter, type RefAttachment } from '../tools/index.js';
import { getFocusableCandidates, getTabbableCandidates, isFocusable } from '../tabbable.js';
import { on } from 'svelte/events';
import { createAttachmentKey, type Attachment } from 'svelte/attachments';
import { untrack } from 'svelte';

export interface FocusScopeOpts {
	onOpenAutoFocus: Getter<(event: Event) => void>;
	onCloseAutoFocus: Getter<(event: Event) => void>;
	trap: Getter<boolean>;
	loop: Getter<boolean>;
}

export interface FocusScopeAttachmentOpts extends FocusScopeOpts {
	enabled: Getter<boolean>;
}

/**
 * Per-document scope stack + focus memory. The active scope is the top of the stack;
 * an occluded scope needs no paused flag — its handlers gate on isActiveScope at
 * event time, so activeness is derived from stack position, never synced.
 */
class FocusScopeManager {
	static #instances = new WeakMap<Document, FocusScopeManager>();
	#scopeStack: FocusScope[] = [];
	#focusHistory = new WeakMap<FocusScope, HTMLElement>();
	#preFocusHistory = new WeakMap<FocusScope, HTMLElement>();
	#document: Document;

	constructor(doc: Document) {
		this.#document = doc;
	}

	static getInstance(doc: Document) {
		let instance = this.#instances.get(doc);
		if (!instance) {
			instance = new FocusScopeManager(doc);
			this.#instances.set(doc, instance);
		}
		return instance;
	}

	register(scope: FocusScope) {
		// capture the currently focused element before this scope becomes active
		const activeElement = this.#document.activeElement as HTMLElement;
		if (activeElement && activeElement !== this.#document.body) {
			this.#preFocusHistory.set(scope, activeElement);
		}

		this.#scopeStack = this.#scopeStack.filter((s) => s !== scope);
		this.#scopeStack.unshift(scope);
	}

	unregister(scope: FocusScope) {
		this.#scopeStack = this.#scopeStack.filter((s) => s !== scope);
	}

	isActiveScope(scope: FocusScope): boolean {
		return this.#scopeStack[0] === scope;
	}

	setFocusMemory(scope: FocusScope, element: HTMLElement) {
		this.#focusHistory.set(scope, element);
	}

	getFocusMemory(scope: FocusScope): HTMLElement | undefined {
		return this.#focusHistory.get(scope);
	}

	getPreFocusMemory(scope: FocusScope): HTMLElement | undefined {
		return this.#preFocusHistory.get(scope);
	}

	clearPreFocusMemory(scope: FocusScope) {
		this.#preFocusHistory.delete(scope);
	}
}

class FocusScope {
	#container: HTMLElement | null = null;
	#manager: FocusScopeManager | null = null;
	#trapCleanupFns: Array<() => void> = [];
	#opts: FocusScopeOpts;

	constructor(opts: FocusScopeOpts) {
		this.#opts = opts;
	}

	#cleanup() {
		for (const fn of this.#trapCleanupFns) {
			fn();
		}
		this.#trapCleanupFns = [];
	}

	mount(container: HTMLElement) {
		if (this.#container) {
			this.unmount();
		}

		this.#container = container;
		this.#manager = FocusScopeManager.getInstance(container.ownerDocument);
		this.#manager.register(this);
		this.#handleOpenAutoFocus();
	}

	unmount() {
		if (!this.#container) return;

		this.#cleanup();

		// handle close auto-focus
		this.#handleCloseAutoFocus();

		this.#manager?.unregister(this);
		this.#manager?.clearPreFocusMemory(this);
		this.#container = null;
		this.#manager = null;
	}

	#handleOpenAutoFocus() {
		if (!this.#container) return;

		const event = new CustomEvent('focusScope.onOpenAutoFocus', {
			bubbles: false,
			cancelable: true,
		});
		this.#opts.onOpenAutoFocus()(event);

		if (!event.defaultPrevented) {
			requestAnimationFrame(() => {
				if (!this.#container) return;
				const firstTabbable = this.#getFirstTabbable();
				if (firstTabbable) {
					firstTabbable.focus();
					this.#manager?.setFocusMemory(this, firstTabbable);
				} else {
					this.#container.focus();
				}
			});
		}
	}

	#handleCloseAutoFocus() {
		const event = new CustomEvent('focusScope.onCloseAutoFocus', {
			bubbles: false,
			cancelable: true,
		});

		this.#opts.onCloseAutoFocus()?.(event);

		if (!event.defaultPrevented) {
			// return focus to the element that was focused before this scope opened
			const preFocusedElement = this.#manager?.getPreFocusMemory(this);
			const doc = this.#container?.ownerDocument;
			if (preFocusedElement && doc?.contains(preFocusedElement)) {
				// ensure the element is still focusable and in the document
				try {
					preFocusedElement.focus();
				} catch {
					// fallback if focus fails
					doc.body.focus();
				}
			}
		}
	}

	enableTrap() {
		if (!this.#container || this.#trapCleanupFns.length > 0) return;

		const container = this.#container;
		const doc = container.ownerDocument;

		const handleFocus = (e: FocusEvent) => {
			if (!this.#manager?.isActiveScope(this)) return;

			const target = e.target as HTMLElement;
			if (!target) return;

			const isInside = container.contains(target);

			if (isInside) {
				// store last focused element
				this.#manager?.setFocusMemory(this, target);
			} else {
				// focus escaped - bring it back
				const lastFocused = this.#manager?.getFocusMemory(this);
				if (lastFocused && container.contains(lastFocused) && isFocusable(lastFocused)) {
					e.preventDefault();
					lastFocused.focus();
				} else {
					// fallback to first tabbable or first focusable or container
					const firstTabbable = this.#getFirstTabbable();
					const firstFocusable = this.#getAllFocusables()[0];
					(firstTabbable || firstFocusable || container).focus();
				}
			}
		};

		const handleKeydown = (e: KeyboardEvent) => {
			if (!this.#opts.loop() || e.key !== 'Tab') return;
			if (!this.#manager?.isActiveScope(this)) return;

			const tabbables = this.#getTabbables();
			if (tabbables.length === 0) return;

			const first = tabbables[0];
			const last = tabbables[tabbables.length - 1];

			if (!e.shiftKey && doc.activeElement === last) {
				e.preventDefault();
				first!.focus();
			} else if (e.shiftKey && doc.activeElement === first) {
				e.preventDefault();
				last!.focus();
			}
		};

		this.#trapCleanupFns.push(on(doc, 'focusin', handleFocus, { capture: true }), on(container, 'keydown', handleKeydown));

		const Observer = doc.defaultView?.MutationObserver ?? MutationObserver;
		const observer = new Observer(() => {
			const lastFocused = this.#manager?.getFocusMemory(this);
			if (lastFocused && !container.contains(lastFocused)) {
				// last focused element was removed
				const firstTabbable = this.#getFirstTabbable();
				const firstFocusable = this.#getAllFocusables()[0];
				const elementToFocus = firstTabbable || firstFocusable;

				if (elementToFocus) {
					elementToFocus.focus();
					this.#manager?.setFocusMemory(this, elementToFocus);
				} else {
					// no focusable elements left, focus container
					container.focus();
				}
			}
		});

		observer.observe(container, {
			childList: true,
			subtree: true,
		});

		this.#trapCleanupFns.push(() => observer.disconnect());
	}

	disableTrap() {
		this.#cleanup();
	}

	#getTabbables(): HTMLElement[] {
		if (!this.#container) return [];

		return getTabbableCandidates(this.#container);
	}

	#getFirstTabbable(): HTMLElement | null {
		const tabbables = this.#getTabbables();
		return tabbables[0] || null;
	}

	#getAllFocusables(): HTMLElement[] {
		if (!this.#container) return [];

		return getFocusableCandidates(this.#container);
	}

}

export function createFocusScopeAttachment(opts: FocusScopeAttachmentOpts): RefAttachment<HTMLElement> {
	return {
		[createAttachmentKey()]: ((node) => {
			if (!opts.enabled()) return;

			const scope = new FocusScope(opts);
			untrack(() => scope.mount(node));

			$effect(() => {
				if (!opts.trap()) {
					untrack(() => scope.disableTrap());
					return;
				}

				untrack(() => scope.enableTrap());

				return () => {
					untrack(() => scope.disableTrap());
				};
			});

			return () => {
				untrack(() => scope.unmount());
			};
		}) satisfies Attachment<HTMLElement>,
	};
}

export function createFocusScopeProps(opts: FocusScopeAttachmentOpts) {
	const focusScopeAttachment = createFocusScopeAttachment(opts);

	return {
		get props() {
			return {
				tabindex: -1,
				...focusScopeAttachment,
			};
		},
	};
}
