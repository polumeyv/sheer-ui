<script lang="ts">
	import { join } from 'overrule';
	import { boxWith, repairBindable } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { MenuCheckboxItemProps } from '../types.js';
	import { getMenuCheckboxGroup, hasMenuCheckboxGroup, MenuCheckboxItemState } from '../menu.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import MinusIcon from '@lucide/svelte/icons/minus';

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		checked = $bindable(false),
		id = createId(uid),
		onCheckedChange = () => {},
		disabled = false,
		onSelect = () => {},
		closeOnSelect = true,
		indeterminate = $bindable(false),
		onIndeterminateChange = () => {},
		value = '',
		...restProps
	}: MenuCheckboxItemProps = $props();

	const group = hasMenuCheckboxGroup() ? getMenuCheckboxGroup() : null;

	function syncCheckedFromGroupValue() {
		if (group && value) checked = group.opts.value.current.includes(value);
	}

	repairBindable(() => value, syncCheckedFromGroupValue);

	const checkboxItemState = MenuCheckboxItemState.create(
		{
			checked: boxWith(
				() => checked,
				(v) => {
					if (v !== checked) {
						checked = v;
						onCheckedChange(v);
					}
				},
			),
			id: boxWith(() => id),
			disabled: boxWith(() => disabled),
			onSelect: boxWith(() => handleSelect),
			ref: boxWith(
				() => ref,
				(v) => (ref = v),
			),
			closeOnSelect: boxWith(() => closeOnSelect),
			indeterminate: boxWith(
				() => indeterminate,
				(v) => {
					if (v !== indeterminate) {
						indeterminate = v;
						onIndeterminateChange(v);
					}
				},
			),
			value: boxWith(() => value),
		},
		group,
	);

	function handleSelect(e: Event) {
		onSelect(e);
		if (e.defaultPrevented) return;
		checkboxItemState.toggleChecked();
	}

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'dropdown-menu-checkbox-item',
				class:
					"focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-md py-1.5 ps-8 pe-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
			},
			restProps,
			checkboxItemState.props,
		),
	);
</script>

{#if child}
	{@render child({ checked, indeterminate, props: mergedProps })}
{:else}
	<div {...mergedProps}>
		<span class="pointer-events-none absolute inset-s-2 grid size-3.5 place-items-center">
			{#if indeterminate}
				<MinusIcon class="size-4" />
			{:else}
				<CheckIcon class={join('size-4', !checked && 'text-transparent')} />
			{/if}
		</span>
		{@render children?.({ checked, indeterminate })}
	</div>
{/if}
