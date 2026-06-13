<script lang="ts">
	import { mergeProps } from '$lib/vendor/index.js';
	import { SelectItemState } from '$lib/components/select/primitive/select.svelte.js';
	import type { SelectItemProps } from '$lib/components/select/primitive/index.js';
	import { createId } from '$lib/internal/create-id.js';
	import Mounted from '$lib/components/_shared/utilities/mounted.svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value,
		label = value,
		disabled = false,
		children: childrenProp,
		child,
		onHighlight = (() => {}),
		onUnhighlight = (() => {}),
		class: className,
		...restProps
	}: SelectItemProps = $props();

	const itemState = SelectItemState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		value: { get current() { return value; } },
		disabled: { get current() { return disabled; } },
		label: { get current() { return label; } },
		onHighlight: { get current() { return onHighlight; } },
		onUnhighlight: { get current() { return onUnhighlight; } },
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'select-item',
				class: cn(
					"data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 ps-2 pe-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
					className,
				),
			},
			restProps,
			itemState.props
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<div {...mergedProps}>
		<span class="absolute inset-e-2 flex size-3.5 items-center justify-center">
			{#if itemState.snippetProps.selected}
				<CheckIcon class="size-4" />
			{/if}
		</span>
		{#if childrenProp}
			{@render childrenProp(itemState.snippetProps)}
		{:else}
			{label || value}
		{/if}
	</div>
{/if}

<Mounted bind:mounted={itemState.mounted} />
