import {
	attachRef,
	type ReadableProps,
	type WritableProps,
	type RefAttachment,
} from '$lib/vendor/index';
import type { WithRefProps } from '$lib/vendor/types';
import { getCheckedState } from '$lib/components/_shared/menu/utils';
import {
	getMenuContentContext,
	getMenuRadioGroupContext,
	setMenuGroupContext,
	setMenuRadioGroupContext,
} from '$lib/components/_shared/menu/context.svelte';
import { MenuItemSharedState, MenuItemState, type MenuItemCombinedProps } from '$lib/components/_shared/menu/item.svelte';
import type { MenuContentState } from '$lib/components/_shared/menu/content.svelte';
import type { MenuRootState } from '$lib/components/_shared/menu/root.svelte';

interface MenuRadioGroupStateOpts
	extends
		WithRefProps,
		WritableProps<{
			value: string;
		}> {}

export class MenuRadioGroupState {
	static create(opts: MenuRadioGroupStateOpts) {
		return setMenuGroupContext(setMenuRadioGroupContext(new MenuRadioGroupState(opts, getMenuContentContext())));
	}
	readonly opts: MenuRadioGroupStateOpts;
	readonly content: MenuContentState;
	readonly attachment: RefAttachment;
	groupHeadingId = $state<string | null>(null);
	root: MenuRootState;

	constructor(opts: MenuRadioGroupStateOpts, content: MenuContentState) {
		this.opts = opts;
		this.content = content;
		this.root = content.parentMenu.root;
		this.attachment = attachRef(this.opts.ref);
	}

	setValue(v: string) {
		this.opts.value.current = v;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr('radio-group')]: '',
				role: 'group',
				'aria-labelledby': this.groupHeadingId,
				...this.attachment,
			}) as const,
	);
}

interface MenuRadioItemStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			value: string;
			closeOnSelect: boolean;
		}> {}

export class MenuRadioItemState {
	static create(opts: MenuRadioItemStateOpts & MenuItemCombinedProps) {
		const radioGroup = getMenuRadioGroupContext();
		const sharedItem = new MenuItemSharedState(opts, radioGroup.content);
		const item = new MenuItemState(opts, sharedItem);
		return new MenuRadioItemState(opts, item, radioGroup);
	}
	readonly opts: MenuRadioItemStateOpts;
	readonly item: MenuItemState;
	readonly group: MenuRadioGroupState;
	readonly attachment: RefAttachment;
	readonly isChecked = $derived.by(() => this.group.opts.value.current === this.opts.value.current);

	constructor(opts: MenuRadioItemStateOpts, item: MenuItemState, group: MenuRadioGroupState) {
		this.opts = opts;
		this.item = item;
		this.group = group;
		this.attachment = attachRef(this.opts.ref);
	}

	selectValue() {
		this.group.setValue(this.opts.value.current);
	}

	readonly props = $derived.by(
		() =>
			({
				[this.group.root.getBitsAttr('radio-item')]: '',
				...this.item.props,
				role: 'menuitemradio',
				'aria-checked': false ? 'mixed' : this.isChecked ? 'true' : 'false',
				'data-state': getCheckedState(this.isChecked),
				...this.attachment,
			}) as const,
	);
}
