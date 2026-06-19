<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { getCarouselContext } from './carouselState.svelte';
	import { cn, type WithElementRef } from "$lib/utils.js";

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="carousel-item"
	role="group"
	aria-roledescription="slide"
	class={cn('min-w-0 shrink-0 grow-0 basis-full', getCarouselContext().orientation === 'horizontal' ? 'ps-4' : 'pt-4', className)}
	data-embla-slide=""
	{...restProps}>
	{@render children?.()}
</div>
