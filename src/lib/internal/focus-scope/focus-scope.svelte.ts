import { type Getter, type RefAttachment } from '../tools/index.js';
import { FocusScopeManager } from './focus-scope-manager.js';
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

class FocusScope {
	#paused = false;
	#container: HTMLElement | null = null;
	#manager: FocusScopeManager | null = null;
	#trapCleanupFns: Array<() => void> = [];
	#opts: FocusScopeOpts;

	constructor(opts: FocusScopeOpts) {
		this.#opts = opts;
	}

	get paused() {
		return this.#paused;
	}

	pause() {
		this.#paused = true;
	}

	resume() {
		this.#paused = false;
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
			if (this.#paused || !this.#manager?.isActiveScope(this)) return;

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
			if (!this.#opts.loop() || this.#paused || e.key !== 'Tab') return;
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
