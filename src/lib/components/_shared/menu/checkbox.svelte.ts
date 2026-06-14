import { untrack } from 'svelte';
import {
	attachRef,
	type ReadableProps,
	type WritableProps,
	type RefAttachment,
} from '$lib/vendor/index';
import type { WithRefProps } from '$lib/vendor/types';
import { getCheckedState } from '$lib/components/_shared/menu/utils';
import { arraysAreEqual } from '$lib/vendor/arrays';
import { getMenuContentContext, setMenuCheckboxGroupContext } from '$lib/components/_shared/menu/context.svelte';
import { MenuItemSharedState, MenuItemState, type MenuItemCombinedProps } from '$lib/components/_shared/menu/item.svelte';
import type { MenuContentState } from '$lib/components/_shared/menu/content.svelte';
import type { MenuRootState } from '$lib/components/_shared/menu/root.svelte';

interface MenuCheckboxItemStateOpts
	extends
		WritableProps<{
			checked: boolean;
			indeterminate: boolean;
		}>,
		ReadableProps<{
			value: string;
		}> {}

export class MenuCheckboxItemState {
	static create(opts: MenuItemCombinedProps & MenuCheckboxItemStateOpts, checkboxGroup: MenuCheckboxGroupState | null) {
		const item = new MenuItemState(opts, new MenuItemSharedState(opts, getMenuContentContext()));
		return new MenuCheckboxItemState(opts, item, checkboxGroup);
	}

	readonly opts: MenuCheckboxItemStateOpts;
	readonly item: MenuItemState;
	readonly group: MenuCheckboxGroupState | null;

	constructor(opts: MenuCheckboxItemStateOpts, item: MenuItemState, group: MenuCheckboxGroupState | null = null) {
		this.opts = opts;
		this.item = item;
		this.group = group;

		// Watch for value changes in the group if we're part of one
		if (this.group) {
			$effect(() => {
				const groupValues = this.group!.opts.value.current;
				untrack(() => {
					this.opts.checked.current = groupValues.includes(this.opts.value.current);
				});
			});

			// Watch for checked state changes and sync with group
			$effect(() => {
				const checked = this.opts.checked.current;
				untrack(() => {
					if (checked) {
						this.group!.addValue(this.opts.value.current);
					} else {
						this.group!.removeValue(this.opts.value.current);
					}
				});
			});
		}
	}

	toggleChecked() {
		if (this.opts.indeterminate.current) {
			this.opts.indeterminate.current = false;
			this.opts.checked.current = true;
		} else {
			this.opts.checked.current = !this.opts.checked.current;
		}
	}

	readonly snippetProps = $derived.by(() => ({
		checked: this.opts.checked.current,
		indeterminate: this.opts.indeterminate.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				...this.item.props,
				role: 'menuitemcheckbox',
				'aria-checked': this.opts.indeterminate.current ? 'mixed' : this.opts.checked.current ? 'true' : 'false',
				'data-state': getCheckedState(this.opts.checked.current),
				[this.item.root.getBitsAttr('checkbox-item')]: '',
			}) as const,
	);
}

interface MenuCheckboxGroupStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			onValueChange: (value: string[]) => void;
		}>,
		WritableProps<{
			value: string[];
		}> {}

export class MenuCheckboxGroupState {
	static create(opts: MenuCheckboxGroupStateOpts) {
		return setMenuCheckboxGroupContext(new MenuCheckboxGroupState(opts, getMenuContentContext()));
	}

	readonly opts: MenuCheckboxGroupStateOpts;
	readonly content: MenuContentState;
	readonly root: MenuRootState;
	readonly attachment: RefAttachment;
	groupHeadingId = $state<string | null>(null);

	constructor(opts: MenuCheckboxGroupStateOpts, content: MenuContentState) {
		this.opts = opts;
		this.content = content;
		this.root = content.parentMenu.root;
		this.attachment = attachRef(this.opts.ref);
	}

	addValue(checkboxValue: string | undefined) {
		if (!checkboxValue) return;
		if (!this.opts.value.current.includes(checkboxValue)) {
			const newValue = [...$state.snapshot(this.opts.value.current), checkboxValue];
			this.opts.value.current = newValue;
			if (arraysAreEqual(this.opts.value.current, newValue)) return;
			this.opts.onValueChange.current(newValue);
		}
	}

	removeValue(checkboxValue: string | undefined) {
		if (!checkboxValue) return;
		const index = this.opts.value.current.indexOf(checkboxValue);
		if (index === -1) return;
		const newValue = this.opts.value.current.filter((v) => v !== checkboxValue);
		this.opts.value.current = newValue;
		if (arraysAreEqual(this.opts.value.current, newValue)) return;
		this.opts.onValueChange.current(newValue);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr('checkbox-group')]: '',
				role: 'group',
				'aria-labelledby': this.groupHeadingId,
				...this.attachment,
			}) as const,
	);
}
