import { tick } from 'svelte';
import { attachRef, type ReadableProp, type RefAttachment } from '$lib/vendor/index';
import { mergeProps } from '$lib/merge-props';
import { SUB_OPEN_KEYS, isMouseEvent } from '$lib/components/_shared/menu/utils';
import type { BitsKeyboardEvent, BitsMouseEvent, BitsPointerEvent } from '$lib/vendor/types';
import { kbd } from '$lib/vendor/kbd';
import { dispatchMenuOpen } from '$lib/components/_shared/menu/attrs';
import { getMenuContentContext, getMenuMenuContext } from '$lib/components/_shared/menu/context.svelte';
import { MenuItemSharedState, type MenuItemSharedStateOpts, type MenuItemStateOpts } from '$lib/components/_shared/menu/item.svelte';
import type { MenuContentState } from '$lib/components/_shared/menu/content.svelte';
import type { MenuMenuState } from '$lib/components/_shared/menu/menu.svelte';

interface MenuSubTriggerStateOpts extends MenuItemSharedStateOpts, Pick<MenuItemStateOpts, 'onSelect'> {
	openDelay: ReadableProp<number>;
}

export class MenuSubTriggerState {
	static create(opts: MenuSubTriggerStateOpts) {
		const content = getMenuContentContext();
		const item = new MenuItemSharedState(opts, content);
		const submenu = getMenuMenuContext();
		return new MenuSubTriggerState(opts, item, content, submenu);
	}

	readonly opts: MenuSubTriggerStateOpts;
	readonly item: MenuItemSharedState;
	readonly content: MenuContentState;
	readonly submenu: MenuMenuState;
	readonly attachment: RefAttachment;

	#openTimer: number | null = null;

	constructor(opts: MenuSubTriggerStateOpts, item: MenuItemSharedState, content: MenuContentState, submenu: MenuMenuState) {
		this.opts = opts;
		this.item = item;
		this.content = content;
		this.submenu = submenu;
		this.attachment = attachRef(this.opts.ref, (v) => (this.submenu.triggerNode = v));
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);

		$effect(() => () => {
			this.#clearOpenTimer();
		});
	}

	#clearOpenTimer() {
		if (this.#openTimer === null) return;
		this.content.domContext.getWindow().clearTimeout(this.#openTimer);
		this.#openTimer = null;
	}

	onpointermove(e: BitsPointerEvent) {
		if (!isMouseEvent(e)) return;

		if (this.submenu.root.isPointerInTransit) {
			if (this.#openTimer !== null) this.#clearOpenTimer();
			return;
		}

		if (!this.item.opts.disabled.current && !this.submenu.opts.open.current && !this.#openTimer) {
			const openDelay = this.opts.openDelay.current;

			if (openDelay <= 0) {
				this.submenu.onOpen();
				return;
			}

			this.#openTimer = this.content.domContext.setTimeout(() => {
				if (this.submenu.root.isPointerInTransit) {
					this.#clearOpenTimer();
					return;
				}

				this.submenu.onOpen();
				this.#clearOpenTimer();
			}, openDelay);
		}
	}

	onpointerleave(e: BitsPointerEvent) {
		if (!isMouseEvent(e)) return;
		this.#clearOpenTimer();
	}

	onkeydown(e: BitsKeyboardEvent) {
		const isTypingAhead = this.content.search !== '';
		if (this.item.opts.disabled.current || (isTypingAhead && e.key === kbd.SPACE)) return;

		if (SUB_OPEN_KEYS[this.submenu.root.opts.dir.current].includes(e.key)) {
			e.currentTarget.click();
			e.preventDefault();
		}
	}

	onclick(e: BitsMouseEvent) {
		if (this.item.opts.disabled.current) return;

		/**
		 * We manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
		 * and we rely heavily on `onFocusOutside` for submenus to close when switching
		 * between separate submenus.
		 */
		if (!(e.currentTarget instanceof HTMLElement)) return;

		e.currentTarget.focus();

		const selectEvent = new CustomEvent('menusubtriggerselect', {
			bubbles: true,
			cancelable: true,
		});

		this.opts.onSelect.current(selectEvent);

		if (!this.submenu.opts.open.current) {
			this.submenu.onOpen();

			tick().then(() => {
				const contentNode = this.submenu.contentNode;
				if (!contentNode) return;

				dispatchMenuOpen(contentNode);
			});
		}
	}

	readonly props = $derived.by(() =>
		mergeProps(
			{
				'aria-haspopup': 'menu',
				'aria-expanded': this.submenu.opts.open.current ? 'true' : 'false',
				'data-state': this.submenu.opts.open.current ? 'open' : 'closed',
				'aria-controls': this.submenu.opts.open.current ? this.submenu.contentId.current : undefined,
				[this.submenu.root.getBitsAttr('sub-trigger')]: '',
				onclick: this.onclick,
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
				onkeydown: this.onkeydown,
				...this.attachment,
			},
			this.item.props,
		),
	);
}
