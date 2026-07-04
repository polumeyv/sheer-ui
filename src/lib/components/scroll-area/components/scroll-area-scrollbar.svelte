<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import type { ScrollAreaScrollbarProps } from '../types.js';
	import { ScrollAreaScrollbarState } from '../scroll-area.svelte.js';
	import ScrollAreaScrollbarAuto from './scroll-area-scrollbar-auto.svelte';
	import ScrollAreaScrollbarScroll from './scroll-area-scrollbar-scroll.svelte';
	import ScrollAreaScrollbarHover from './scroll-area-scrollbar-hover.svelte';
	import ScrollAreaScrollbarVisible from './scroll-area-scrollbar-visible.svelte';
	import Thumb from './scroll-area-thumb.svelte';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { ref = $bindable(null), id = createId(uid), orientation = 'vertical', children, ...restProps }: ScrollAreaScrollbarProps = $props();

	const scrollbarState = ScrollAreaScrollbarState.create({
		orientation: boxWith(() => orientation),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const type = $derived(scrollbarState.root.opts.type.current);

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'scroll-area-scrollbar',
				class: [
					'flex touch-none p-px transition-colors select-none',
					orientation === 'vertical' && 'h-full w-2.5 border-s border-s-transparent',
					orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent',
				],
			},
			restProps,
		),
	);
</script>

{#snippet scrollbarChildren()}
	{@render children?.()}
	<Thumb data-slot="scroll-area-thumb" class="bg-border relative flex-1 rounded-full" />
{/snippet}

{#if type === 'hover'}
	<ScrollAreaScrollbarHover {...mergedProps} {id} children={scrollbarChildren} />
{:else if type === 'scroll'}
	<ScrollAreaScrollbarScroll {...mergedProps} {id} children={scrollbarChildren} />
{:else if type === 'auto'}
	<ScrollAreaScrollbarAuto {...mergedProps} {id} children={scrollbarChildren} />
{:else if type === 'always'}
	<ScrollAreaScrollbarVisible {...mergedProps} {id} children={scrollbarChildren} />
{/if}
