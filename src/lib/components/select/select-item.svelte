<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import { SelectItemState } from '$lib/bits/select/select.svelte.js';
	import type { SelectItemProps } from '$lib/bits/select/types.js';
	import { createId } from '$lib/internal/create-id.js';
	import { noop } from '$lib/internal/noop.js';
	import Mounted from '$lib/bits/utilities/mounted.svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { cn } from '../../utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value,
		label = value,
		disabled = false,
		children: childrenProp,
		child,
		onHighlight = noop,
		onUnhighlight = noop,
		class: className,
		...restProps
	}: SelectItemProps = $props();

	const itemState = SelectItemState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		value: boxWith(() => value),
		disabled: boxWith(() => disabled),
		label: boxWith(() => label),
		onHighlight: boxWith(() => onHighlight),
		onUnhighlight: boxWith(() => onUnhighlight),
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
