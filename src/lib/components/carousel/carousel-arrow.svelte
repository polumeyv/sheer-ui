<script lang="ts">
	import { join } from 'overrule';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import type { WithoutChildren } from '../../internal/index.js';
	import { getCarouselContext } from './carouselState.svelte';
	import { Button, type Props } from '../button';

	let {
		direction,
		ref = $bindable(null),
		class: className,
		variant = 'outline',
		size = 'icon',
		...restProps
	}: WithoutChildren<Props> & { direction: 'next' | 'previous' } = $props();

	const emblaCtx = getCarouselContext();

	const isNext = $derived(direction === 'next');
	const Icon = $derived(isNext ? ArrowRightIcon : ArrowLeftIcon);
	const canScroll = $derived(isNext ? emblaCtx.canScrollNext : emblaCtx.canScrollPrev);
	// Full literal class strings per (direction, orientation) so Tailwind's scanner sees them intact.
	const horizontal = $derived(isNext ? '-inset-e-12 top-1/2 -translate-y-1/2' : '-inset-s-12 top-1/2 -translate-y-1/2');
	const vertical = $derived(
		isNext ? 'inset-s-1/2 -bottom-12 -translate-x-1/2 rotate-90' : 'inset-s-1/2 -top-12 -translate-x-1/2 rotate-90',
	);
</script>

<Button
	data-slot={isNext ? 'carousel-next' : 'carousel-previous'}
	{variant}
	{size}
	disabled={!canScroll}
	aria-disabled={!canScroll}
	class={join('absolute size-8! rounded-full!', emblaCtx.orientation === 'horizontal' ? horizontal : vertical, className)}
	onclick={isNext ? emblaCtx.scrollNext : emblaCtx.scrollPrev}
	{...restProps}
	bind:ref>
	<Icon class="size-4" />
	<span class="sr-only">{isNext ? 'Next' : 'Previous'} slide</span>
</Button>
