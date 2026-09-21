<script lang="ts">
	import { mergeProps } from '../../internal/merge-props.js';
	import type { ScrollAreaRootProps } from './types.js';

	let {
		ref = $bindable(null),
		type = 'hover',
		scrollHideDelay = 600,
		orientation = 'vertical',
		children,
		...restProps
	}: ScrollAreaRootProps = $props();

	let scrolling = $state(false);

	const mergedProps = $derived(
		mergeProps(
			{
				class:
					'ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 rounded-[inherit] focus-visible:ring-4 focus-visible:outline-1',
				onscroll: () => (scrolling = true),
				onscrollend: () => (scrolling = false),
			},
			restProps,
		),
	);
</script>

<div
	bind:this={ref}
	data-slot="scroll-area"
	data-type={type}
	data-orientation={orientation}
	data-scrolling={scrolling ? '' : undefined}
	style:--scroll-hide-delay="{scrollHideDelay}ms"
	{...mergedProps}>
	{@render children?.()}
</div>
