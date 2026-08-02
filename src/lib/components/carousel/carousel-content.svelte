<script lang="ts">
	import { join } from 'overrule';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '../../internal/utils.js';
	import { getCarouselWiring } from './carouselState.svelte';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const ctx = getCarouselWiring();
</script>

<div
	bind:this={ref}
	data-slot="carousel-content"
	data-orientation={ctx.orientation}
	class={join(
		// [overflow-anchor:none]: scroll anchoring fights the loop mode's `order` rotation
		'flex snap-mandatory scrollbar-none [overflow-anchor:none]',
		ctx.orientation === 'horizontal' ? 'snap-x gap-4 overflow-x-auto overscroll-x-contain' : 'snap-y flex-col gap-4 overflow-y-auto overscroll-y-contain',
		className,
	)}
	{@attach ctx.scroller}
	{...restProps}>
	{@render children?.()}
</div>
