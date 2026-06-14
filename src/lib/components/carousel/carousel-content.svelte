<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import useEmblaCarousel, { getEmblaContext } from './carouselState.svelte';
	import { cn, type WithElementRef } from '../../vendor/utils';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const emblaCtx = getEmblaContext();
</script>

<div
	data-slot="carousel-content"
	class="overflow-hidden"
	{@attach useEmblaCarousel(
		() => ({
			options: {
				...emblaCtx.options,
				axis: emblaCtx.orientation === 'horizontal' ? 'x' : 'y',
				container: '[data-embla-container]',
				slides: '[data-embla-slide]',
			},
			plugins: emblaCtx.plugins,
		}),
		emblaCtx.registerApi,
		() => emblaCtx.registerApi(undefined),
	)}>
	<div
		bind:this={ref}
		class={cn('flex', emblaCtx.orientation === 'horizontal' ? '-ms-4' : '-mt-4 flex-col', className)}
		data-embla-container=""
		{...restProps}>
		{@render children?.()}
	</div>
</div>
