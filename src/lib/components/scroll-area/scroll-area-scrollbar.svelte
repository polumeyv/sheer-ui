<script lang="ts">
import { mergeProps } from '$lib/merge-props';
import type { ScrollAreaScrollbarProps } from '$lib/components/primitive/scroll-area/index';
import { ScrollAreaScrollbarState } from '$lib/components/primitive/scroll-area/scroll-area.svelte';
import ScrollAreaScrollbarAuto from '$lib/components/primitive/scroll-area/components/scroll-area-scrollbar-auto.svelte';
import ScrollAreaScrollbarScroll from '$lib/components/primitive/scroll-area/components/scroll-area-scrollbar-scroll.svelte';
import ScrollAreaScrollbarHover from '$lib/components/primitive/scroll-area/components/scroll-area-scrollbar-hover.svelte';
import ScrollAreaScrollbarVisible from '$lib/components/primitive/scroll-area/components/scroll-area-scrollbar-visible.svelte';
import Thumb from '$lib/components/primitive/scroll-area/components/scroll-area-thumb.svelte';
import { createId } from '$lib/vendor/create-id';
import { cn, type WithoutChild } from '../../vendor/utils';

const uid = $props.id();

let {
	ref = $bindable(null),
	id = createId(uid),
	class: className,
	orientation = 'vertical',
	children,
	...restProps
}: WithoutChild<ScrollAreaScrollbarProps> = $props();

const scrollbarState = ScrollAreaScrollbarState.create({
	orientation: { get current() { return orientation; } },
	id: { get current() { return id; } },
	ref: { get current() { return ref; }, set current(v) { (ref = v); } },
});

const type = $derived(scrollbarState.root.opts.type.current);

const mergedProps = $derived(
	mergeProps(
		{
			'data-slot': 'scroll-area-scrollbar',
			class: cn(
				'flex touch-none p-px transition-colors select-none',
				orientation === 'vertical' && 'h-full w-2.5 border-s border-s-transparent',
				orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent',
				className
			),
		},
		restProps
	)
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
