import { attachRef, type RefAttachment } from '$lib/vendor/index';
import type { WithRefProps } from '$lib/vendor/types';
import {
	getMenuCheckboxGroupContextOr,
	getMenuGroupContext,
	getMenuRadioGroupContextOr,
	getMenuRootContext,
	setMenuGroupContext,
} from '$lib/components/_shared/menu/context.svelte';
import type { MenuRootState } from '$lib/components/_shared/menu/root.svelte';
import type { MenuRadioGroupState } from '$lib/components/_shared/menu/radio.svelte';
import type { MenuCheckboxGroupState } from '$lib/components/_shared/menu/checkbox.svelte';

interface MenuGroupStateOpts extends WithRefProps {}

export class MenuGroupState {
	static create(opts: MenuGroupStateOpts) {
		return setMenuGroupContext(new MenuGroupState(opts, getMenuRootContext()));
	}

	readonly opts: MenuGroupStateOpts;
	readonly root: MenuRootState;
	readonly attachment: RefAttachment;
	groupHeadingId = $state<string | undefined>(undefined);

	constructor(opts: MenuGroupStateOpts, root: MenuRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'group',
				'aria-labelledby': this.groupHeadingId,
				[this.root.getBitsAttr('group')]: '',
				...this.attachment,
			}) as const,
	);
}

interface MenuGroupHeadingStateOpts extends WithRefProps {}

export class MenuGroupHeadingState {
	static create(opts: MenuGroupHeadingStateOpts) {
		// Try to get checkbox group first, then radio group, then regular group
		const checkboxGroup = getMenuCheckboxGroupContextOr(null);
		if (checkboxGroup) return new MenuGroupHeadingState(opts, checkboxGroup);

		const radioGroup = getMenuRadioGroupContextOr(null);
		if (radioGroup) return new MenuGroupHeadingState(opts, radioGroup);

		return new MenuGroupHeadingState(opts, getMenuGroupContext());
	}
	readonly opts: MenuGroupHeadingStateOpts;
	readonly group: MenuGroupState | MenuRadioGroupState | MenuCheckboxGroupState;
	readonly attachment: RefAttachment;

	constructor(opts: MenuGroupHeadingStateOpts, group: MenuGroupState | MenuRadioGroupState | MenuCheckboxGroupState) {
		this.opts = opts;
		this.group = group;
		this.attachment = attachRef(this.opts.ref, (v) => (this.group.groupHeadingId = v?.id));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'group',
				[this.group.root.getBitsAttr('group-heading')]: '',
				...this.attachment,
			}) as const,
	);
}

interface MenuSeparatorStateOpts extends WithRefProps {}

export class MenuSeparatorState {
	static create(opts: MenuSeparatorStateOpts) {
		return new MenuSeparatorState(opts, getMenuRootContext());
	}

	readonly opts: MenuSeparatorStateOpts;
	readonly root: MenuRootState;
	readonly attachment: RefAttachment;

	constructor(opts: MenuSeparatorStateOpts, root: MenuRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'group',
				[this.root.getBitsAttr('separator')]: '',
				...this.attachment,
			}) as const,
	);
}
