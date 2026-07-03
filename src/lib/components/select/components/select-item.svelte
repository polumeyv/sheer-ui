<script lang="ts">
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import CheckIcon from '@lucide/svelte/icons/check';

	import { boxWith, mountedAttachment } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import { createId } from '$lib/internal/create-id.js';

	import { SelectItemState } from '../select.svelte.js';
	import type { SelectItemProps } from '../types.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value,
		label = value,
		disabled = false,
		class: className,
		children,
		child,
		onHighlight = () => {},
		onUnhighlight = () => {},
		...restProps
	}: SelectItemProps & {
		class?: ClassValue;
	} = $props();

	const itemState = SelectItemState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(value) => (ref = value),
		),
		value: boxWith(() => value),
		disabled: boxWith(() => disabled),
		label: boxWith(() => label),
		onHighlight: boxWith(() => onHighlight),
		onUnhighlight: boxWith(() => onUnhighlight),
	});

	const mountedProps = mountedAttachment((mounted) => {
		itemState.mounted = mounted;
	});

	const itemClass = $derived(
		join(
			"relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
			className,
		),
	);

	const mergedProps = $derived(
		mergeProps(
			restProps,
			{
				'data-slot': 'select-item',
				class: itemClass,
			},
			itemState.props,
			mountedProps,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<div {...mergedProps}>
		<span class="absolute inset-e-2 grid size-3.5 place-items-center">
			{#if itemState.snippetProps.selected}
				<CheckIcon class="cn-select-item-indicator-icon" />
			{/if}
		</span>

		<span class="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
			{#if children}
				{@render children(itemState.snippetProps)}
			{:else}
				{label || value}
			{/if}
		</span>
	</div>
{/if}
