<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import type { MenuRadioItemProps } from '../types.js';
	import { MenuRadioItemState } from '../menu.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import CircleIcon from '@lucide/svelte/icons/circle';

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		value,
		onSelect = () => {},
		id = createId(uid),
		disabled = false,
		closeOnSelect = true,
		...restProps
	}: MenuRadioItemProps = $props();

	const radioItemState = MenuRadioItemState.create({
		value: boxWith(() => value),
		id: boxWith(() => id),
		disabled: boxWith(() => disabled),
		onSelect: boxWith(() => handleSelect),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		closeOnSelect: boxWith(() => closeOnSelect),
	});

	function handleSelect(e: Event) {
		onSelect(e);
		if (e.defaultPrevented) return;
		radioItemState.selectValue();
	}

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'dropdown-menu-radio-item',
				class:
					"focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-md py-1.5 ps-8 pe-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
			},
			restProps,
			radioItemState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps, checked: radioItemState.isChecked })}
{:else}
	<div {...mergedProps}>
		<span class="pointer-events-none absolute inset-s-2 grid size-3.5 place-items-center">
			{#if radioItemState.isChecked}
				<CircleIcon class="size-2 fill-current" />
			{/if}
		</span>
		{@render children?.({ checked: radioItemState.isChecked })}
	</div>
{/if}
