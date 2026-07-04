<script lang="ts">
	import { join } from 'overrule';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '../../internal/utils.js';
	import { getCarouselNativeContext } from './carouselNativeState.svelte';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const ctx = getCarouselNativeContext();
	const snapAlign = $derived(ctx.align === 'center' ? 'snap-center' : ctx.align === 'end' ? 'snap-end' : 'snap-start');
</script>

<div
	bind:this={ref}
	data-slot="carousel-native-item"
	role="group"
	aria-roledescription="slide"
	class={join('min-w-0 shrink-0 grow-0 basis-full', snapAlign, className)}
	{...restProps}>
	{@render children?.()}
</div>
