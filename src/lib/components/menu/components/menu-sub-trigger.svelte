<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { MenuSubTriggerProps } from '../types.js';
	import { MenuSubTriggerState } from '../menu.svelte.js';
	import { floatingAnchor } from '../../../internal/floating-layer/index.js';
	import { createId } from '../../../internal/create-id.js';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	const uid = $props.id();

	let {
		id = createId(uid),
		disabled = false,
		ref = $bindable(null),
		children,
		child,
		onSelect = () => {},
		openDelay = 0,
		inset,
		...restProps
	}: MenuSubTriggerProps & {
		inset?: boolean;
	} = $props();

	const subTriggerState = MenuSubTriggerState.create({
		disabled: boxWith(() => disabled),
		onSelect: boxWith(() => onSelect),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		openDelay: boxWith(() => openDelay),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'dropdown-menu-sub-trigger',
				'data-inset': inset,
				class:
					"data-highlighted:bg-accent data-highlighted:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:ps-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
			},
			restProps,
			subTriggerState.props,
		),
	);

	const anchor = floatingAnchor();
</script>

{#if child}
	{@render child({ props: mergeProps(mergedProps, anchor) })}
{:else}
	<div {...mergeProps(mergedProps, anchor)}>
		{@render children?.()}
		<ChevronRightIcon class="ms-auto size-4" />
	</div>
{/if}
