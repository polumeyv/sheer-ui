import { tick, untrack } from 'svelte';
import {
	attachRef,
	DOMContext,
	type ReadableProps,
} from '$lib/vendor/index';
import { FIRST_LAST_KEYS, LAST_KEYS } from '$lib/components/_shared/menu/utils';
import { focusFirst } from '$lib/vendor/focus';
import type {
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsPointerEvent,
	RefAttachment,
	WithRefProps,
} from '$lib/vendor/types';
import { kbd } from '$lib/vendor/kbd';
import { getTabbableFrom } from '$lib/vendor/tabbable';
import { isTabbable } from 'tabbable';
import { DOMTypeahead } from '$lib/vendor/dom-typeahead.svelte';
import { RovingFocusGroup } from '$lib/vendor/roving-focus-group';
import { MenuOpenEvent } from '$lib/components/_shared/menu/attrs';
import { getMenuMenuContext, setMenuContentContext } from '$lib/components/_shared/menu/context.svelte';
import { MenuSubmenuIntent } from '$lib/components/_shared/menu/submenu-intent.svelte';
import type { Point } from '$lib/components/_shared/menu/geometry';
import type { MenuMenuState } from '$lib/components/_shared/menu/menu.svelte';

interface MenuContentStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			loop: boolean;
			onCloseAutoFocus: (event: Event) => void;
		}> {
	isSub?: boolean;
}

export class MenuContentState {
	static create(opts: MenuContentStateOpts) {
		return setMenuContentContext(new MenuContentState(opts, getMenuMenuContext()));
	}

	readonly opts: MenuContentStateOpts;
	readonly parentMenu: MenuMenuState;
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly domContext: DOMContext;
	readonly attachment: RefAttachment;
	search = $state('');
	#timer = 0;
	#handleTypeaheadSearch: DOMTypeahead['handleTypeaheadSearch'];
	mounted = $state(false);
	#isSub: boolean;

	constructor(opts: MenuContentStateOpts, parentMenu: MenuMenuState) {
		const self = this;
		this.opts = opts;
		this.parentMenu = parentMenu;
		this.domContext = new DOMContext(opts.ref);
		this.attachment = attachRef(this.opts.ref, (v) => {
			if (this.parentMenu.contentNode !== v) {
				this.parentMenu.contentNode = v;
			}
		});

		parentMenu.contentId = opts.id;

		this.#isSub = opts.isSub ?? false;
		this.onkeydown = this.onkeydown.bind(this);
		this.onblur = this.onblur.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.handleInteractOutside = this.handleInteractOutside.bind(this);

		new MenuSubmenuIntent({
			contentNode: () => this.parentMenu.contentNode,
			triggerNode: () => this.parentMenu.triggerNode,
			parentContentNode: () => this.parentMenu.parentMenu?.contentNode ?? null,
			subContentSelector: () => `[${this.parentMenu.root.getBitsAttr('sub-content')}]`,
			// debugMode: () => this.parentMenu.root.opts.debugMode.current,
			enabled: () =>
				this.parentMenu.opts.open.current &&
				Boolean(this.parentMenu.triggerNode?.hasAttribute(this.parentMenu.root.getBitsAttr('sub-trigger'))),
			onIntentExit: (pointerPoint) => {
				this.parentMenu.opts.open.current = false;
				this.#dispatchPointerMoveToHoveredSubTrigger(pointerPoint);
			},
			setIsPointerInTransit: (value) => {
				this.parentMenu.root.isPointerInTransit = value;
			},
		});

		this.#handleTypeaheadSearch = new DOMTypeahead({
			getActiveElement: () => this.domContext.getActiveElement(),
			getWindow: () => this.domContext.getWindow(),
		}).handleTypeaheadSearch;
		this.rovingFocusGroup = new RovingFocusGroup({
			rootNode: { get current() { return self.parentMenu.contentNode; } },
			candidateAttr: this.parentMenu.root.getBitsAttr('item'),
			loop: this.opts.loop,
			orientation: { get current() { return 'vertical' as const; } },
		});

		$effect(() => {
			const contentNode = this.parentMenu.contentNode;
			return untrack(() => {
				if (!contentNode) return;
				const handler = () => {
					tick().then(() => {
						if (!this.parentMenu.root.isUsingKeyboard.current) return;
						this.rovingFocusGroup.focusFirstCandidate();
					});
				};
				return MenuOpenEvent.listen(contentNode, handler);
			});
		});

		$effect(() => {
			if (!this.parentMenu.opts.open.current) {
				this.domContext.getWindow().clearTimeout(this.#timer);
			}
		});
	}

	#getCandidateNodes() {
		const node = this.parentMenu.contentNode;
		if (!node) return [];
		const candidates = Array.from(node.querySelectorAll<HTMLElement>(`[${this.parentMenu.root.getBitsAttr('item')}]:not([data-disabled])`));
		return candidates;
	}

	#isPointerMovingToSubmenu() {
		return this.parentMenu.root.isPointerInTransit;
	}

	#dispatchPointerMoveToHoveredSubTrigger(pointerPoint: Point | null) {
		if (!pointerPoint) return;
		const parentContentNode = this.parentMenu.parentMenu?.contentNode;
		if (!parentContentNode) return;
		const hoveredNode = this.domContext.getDocument().elementFromPoint(pointerPoint.x, pointerPoint.y);
		if (!(hoveredNode instanceof Element)) return;
		const hoveredSubTrigger = hoveredNode.closest<HTMLElement>(`[${this.parentMenu.root.getBitsAttr('sub-trigger')}]`);
		if (!hoveredSubTrigger || !parentContentNode.contains(hoveredSubTrigger)) return;
		if (hoveredSubTrigger === this.parentMenu.triggerNode) return;
		hoveredSubTrigger.dispatchEvent(
			new PointerEvent('pointermove', {
				bubbles: true,
				cancelable: true,
				pointerType: 'mouse',
				clientX: pointerPoint.x,
				clientY: pointerPoint.y,
			}),
		);
	}

	onCloseAutoFocus = (e: Event) => {
		this.opts.onCloseAutoFocus.current?.(e);
		if (e.defaultPrevented || this.#isSub) return;
		if (this.parentMenu.root.ignoreCloseAutoFocus) {
			e.preventDefault();
			return;
		}

		if (this.parentMenu.triggerNode && isTabbable(this.parentMenu.triggerNode)) {
			e.preventDefault();
			this.parentMenu.triggerNode.focus();
		}
	};

	handleTabKeyDown(e: BitsKeyboardEvent) {
		/**
		 * We locate the root `menu`'s trigger by going up the tree until
		 * we find a menu that has no parent. This will allow us to focus the next
		 * tabbable element before/after the root trigger.
		 */
		let rootMenu = this.parentMenu;
		while (rootMenu.parentMenu !== null) {
			rootMenu = rootMenu.parentMenu;
		}
		if (!rootMenu.triggerNode) return;
		e.preventDefault();
		const nodeToFocus = getTabbableFrom(rootMenu.triggerNode, e.shiftKey ? 'prev' : 'next');
		if (nodeToFocus) {
			/**
			 * We set a flag to ignore the `onCloseAutoFocus` event handler
			 * as well as the fallbacks inside the focus scope to prevent
			 * race conditions causing focus to fall back to the body even
			 * though we're trying to focus the next tabbable element.
			 */
			this.parentMenu.root.ignoreCloseAutoFocus = true;
			rootMenu.onClose();
			tick().then(() => {
				nodeToFocus.focus();
				tick().then(() => {
					this.parentMenu.root.ignoreCloseAutoFocus = false;
				});
			});
		} else {
			this.domContext.getDocument().body.focus();
		}
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.defaultPrevented) return;
		if (e.key === kbd.TAB) {
			this.handleTabKeyDown(e);
			return;
		}

		const target = e.target;
		const currentTarget = e.currentTarget;
		if (!(target instanceof HTMLElement) || !(currentTarget instanceof HTMLElement)) return;

		const isKeydownInside = target.closest(`[${this.parentMenu.root.getBitsAttr('content')}]`)?.id === this.parentMenu.contentId.current;

		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
		const isCharacterKey = e.key.length === 1;

		const kbdFocusedEl = this.rovingFocusGroup.handleKeydown(target, e);
		if (kbdFocusedEl) return;

		// prevent space from being considered with typeahead
		if (e.code === 'Space') return;

		const candidateNodes = this.#getCandidateNodes();

		if (isKeydownInside) {
			if (!isModifierKey && isCharacterKey) {
				this.#handleTypeaheadSearch(e.key, candidateNodes);
			}
		}

		// focus first/last based on key pressed
		if ((e.target as HTMLElement)?.id !== this.parentMenu.contentId.current) return;

		if (!FIRST_LAST_KEYS.includes(e.key)) return;
		e.preventDefault();

		if (LAST_KEYS.includes(e.key)) {
			candidateNodes.reverse();
		}
		focusFirst(candidateNodes, { select: false }, () => this.domContext.getActiveElement());
	}

	onblur(e: BitsFocusEvent) {
		if (!(e.currentTarget instanceof Element)) return;
		if (!(e.target instanceof Element)) return;
		// clear search buffer when leaving the menu
		if (!e.currentTarget.contains?.(e.target)) {
			this.domContext.getWindow().clearTimeout(this.#timer);
			this.search = '';
		}
	}

	onfocus(_: BitsFocusEvent) {
		if (!this.parentMenu.root.isUsingKeyboard.current) return;
		tick().then(() => this.rovingFocusGroup.focusFirstCandidate());
	}

	onItemEnter() {
		return this.#isPointerMovingToSubmenu();
	}

	onItemLeave(e: BitsPointerEvent) {
		if (e.currentTarget.hasAttribute(this.parentMenu.root.getBitsAttr('sub-trigger'))) return;
		if (this.#isPointerMovingToSubmenu() || this.parentMenu.root.isUsingKeyboard.current) return;
		const contentNode = this.parentMenu.contentNode;
		contentNode?.focus({ preventScroll: true });
		this.rovingFocusGroup.setCurrentTabStopId('');
	}

	onTriggerLeave() {
		if (this.#isPointerMovingToSubmenu()) return true;
		return false;
	}

	handleInteractOutside(e: PointerEvent) {
		if (!(e.target instanceof Element || e.target instanceof SVGElement)) return;
		const triggerId = this.parentMenu.triggerNode?.id;
		if (e.target.id === triggerId) {
			e.preventDefault();
			return;
		}
		if (e.target.closest(`#${triggerId}`)) {
			e.preventDefault();
			return;
		}
		/**
		 * when the menu closes due to an outside pointer interaction (for example,
		 * clicking another dropdown trigger), avoid focusing this menu's trigger
		 * to prevent stealing focus from the new interaction target.
		 */
		this.parentMenu.root.ignoreCloseAutoFocus = true;
		tick().then(() => {
			this.parentMenu.root.ignoreCloseAutoFocus = false;
		});
	}

	get shouldRender() {
		return this.parentMenu.contentPresence.shouldRender;
	}

	readonly snippetProps = $derived.by(() => ({ open: this.parentMenu.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'menu',
				'aria-orientation': 'vertical' as const,
				[this.parentMenu.root.getBitsAttr('content')]: '',
				'data-state': this.parentMenu.opts.open.current ? 'open' : 'closed',
				...{
					'data-starting-style': this.parentMenu.contentPresence.transitionStatus === 'starting' ? '' : undefined,
					'data-ending-style': this.parentMenu.contentPresence.transitionStatus === 'ending' ? '' : undefined,
				},
				onkeydown: this.onkeydown,
				onblur: this.onblur,
				onfocus: this.onfocus,
				dir: this.parentMenu.root.opts.dir.current,
				style: {
					pointerEvents: 'auto',
					contain: 'layout style',
				},
				...this.attachment,
			}) as const,
	);

	readonly popperProps = {
		onCloseAutoFocus: (e: Event) => this.onCloseAutoFocus(e),
	};
}
