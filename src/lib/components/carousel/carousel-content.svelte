<script lang="ts">
	import { join } from 'overrule';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getCarouselContext, useCarousel } from './carouselState.svelte';
	import type { WithElementRef } from '../../utils.js';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const carouselCtx = getCarouselContext();
</script>

<div
	data-slot="carousel-content"
	class="overflow-hidden"
	{@attach useCarousel(
		() => ({
			options: {
				...carouselCtx.options,
				axis: carouselCtx.orientation === 'horizontal' ? 'x' : 'y',
				container: '[data-embla-container]',
				slides: '[data-embla-slide]',
			},
			plugins: carouselCtx.plugins,
		}),
		carouselCtx.registerApi,
	)}>
	<div
		bind:this={ref}
		class={join('flex', carouselCtx.orientation === 'horizontal' ? '-ms-4' : '-mt-4 flex-col', className)}
		data-embla-container=""
		{...restProps}>
		{@render children?.()}
	</div>
</div>
