import { tick } from 'svelte';
import {
	mergeProps,
	attachRef,
	type ReadableProps,
} from '$lib/vendor/index';
import { SELECTION_KEYS, isMouseEvent } from '$lib/components/_shared/menu/utils';
import type {
	AnyFn,
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	RefAttachment,
	WithRefProps,
} from '$lib/vendor/types';
import { kbd } from '$lib/vendor/kbd';
import { getMenuContentContext } from '$lib/components/_shared/menu/context.svelte';
import type { MenuContentState } from '$lib/components/_shared/menu/content.svelte';
import type { MenuRootState } from '$lib/components/_shared/menu/root.svelte';

export interface MenuItemSharedStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			disabled: boolean;
		}> {}

export class MenuItemSharedState {
	readonly opts: MenuItemSharedStateOpts;
	readonly content: MenuContentState;
	readonly attachment: RefAttachment;
	#isFocused = $state(false);

	constructor(opts: MenuItemSharedStateOpts, content: MenuContentState) {
		this.opts = opts;
		this.content = content;
		this.attachment = attachRef(this.opts.ref);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.onblur = this.onblur.bind(this);
	}

	onpointermove(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		if (!isMouseEvent(e)) return;

		if (this.opts.disabled.current) {
			this.content.onItemLeave(e);
		} else {
			const defaultPrevented = this.content.onItemEnter();
			if (defaultPrevented) return;
			const item = e.currentTarget;
			if (!(item instanceof HTMLElement)) return;
			item.focus({ preventScroll: true });
		}
	}

	onpointerleave(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		if (!isMouseEvent(e)) return;
		this.content.onItemLeave(e);
	}

	onfocus(e: BitsFocusEvent) {
		tick().then(() => {
			if (e.defaultPrevented || this.opts.disabled.current) return;
			this.#isFocused = true;
		});
	}

	onblur(e: BitsFocusEvent) {
		tick().then(() => {
			if (e.defaultPrevented) return;
			this.#isFocused = false;
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				tabindex: -1,
				role: 'menuitem',
				'aria-disabled': this.opts.disabled.current ? 'true' : 'false',
				'data-disabled': this.opts.disabled.current ? '' : undefined,
				'data-highlighted': this.#isFocused ? '' : undefined,
				[this.content.parentMenu.root.getBitsAttr('item')]: '',
				//
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
				onfocus: this.onfocus,
				onblur: this.onblur,
				...this.attachment,
			}) as const,
	);
}

export type MenuItemCombinedProps = MenuItemSharedStateOpts & MenuItemStateOpts;

export interface MenuItemStateOpts extends ReadableProps<{
	onSelect: AnyFn;
	closeOnSelect: boolean;
}> {}

export class MenuItemState {
	static create(opts: MenuItemCombinedProps) {
		const item = new MenuItemSharedState(opts, getMenuContentContext());
		return new MenuItemState(opts, item);
	}

	readonly opts: MenuItemStateOpts;
	readonly item: MenuItemSharedState;
	readonly root: MenuRootState;
	#isPointerDown = false;

	constructor(opts: MenuItemStateOpts, item: MenuItemSharedState) {
		this.opts = opts;
		this.item = item;
		this.root = item.content.parentMenu.root;

		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
	}

	#handleSelect() {
		if (this.item.opts.disabled.current) return;
		const selectEvent = new CustomEvent('menuitemselect', { bubbles: true, cancelable: true });
		this.opts.onSelect.current(selectEvent);
		if (selectEvent.defaultPrevented) {
			this.item.content.parentMenu.root.isUsingKeyboard.current = false;
			return;
		}
		if (this.opts.closeOnSelect.current) {
			this.item.content.parentMenu.root.opts.onClose();
		}
	}

	onkeydown(e: BitsKeyboardEvent) {
		const isTypingAhead = this.item.content.search !== '';
		if (this.item.opts.disabled.current || (isTypingAhead && e.key === kbd.SPACE)) return;
		if (SELECTION_KEYS.includes(e.key)) {
			if (!(e.currentTarget instanceof HTMLElement)) return;
			e.currentTarget.click();
			/**
			 * We prevent default browser behavior for selection keys as they should trigger
			 * a selection only:
			 * - prevents space from scrolling the page.
			 * - if keydown causes focus to move, prevents keydown from firing on the new target.
			 */
			e.preventDefault();
		}
	}

	onclick(_: BitsMouseEvent) {
		if (this.item.opts.disabled.current) return;
		this.#handleSelect();
	}

	onpointerup(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		if (!this.#isPointerDown) {
			if (!(e.currentTarget instanceof HTMLElement)) return;
			e.currentTarget?.click();
		}
	}

	onpointerdown(_: BitsPointerEvent) {
		this.#isPointerDown = true;
	}

	readonly props = $derived.by(() =>
		mergeProps(this.item.props, {
			onclick: this.onclick,
			onpointerdown: this.onpointerdown,
			onpointerup: this.onpointerup,
			onkeydown: this.onkeydown,
		}),
	);
}
