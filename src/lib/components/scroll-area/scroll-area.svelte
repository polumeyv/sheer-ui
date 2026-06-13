<script lang="ts">
import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
import type { ScrollAreaRootProps } from '$lib/bits/scroll-area/types.js';
import { ScrollAreaRootState, ScrollAreaViewportState } from '$lib/bits/scroll-area/scroll-area.svelte.js';
import { createId } from '$lib/internal/create-id.js';
import { Scrollbar } from './index';
import Corner from '$lib/bits/scroll-area/components/scroll-area-corner.svelte';
import { cn, type WithoutChild } from '../../utils';

const uid = $props.id();

let {
	ref = $bindable(null),
	viewportRef = $bindable(null),
	id = createId(uid),
	type = 'hover',
	dir = 'ltr',
	scrollHideDelay = 600,
	class: className,
	orientation = 'vertical',
	scrollbarXClasses = '',
	scrollbarYClasses = '',
	children,
	...restProps
}: WithoutChild<ScrollAreaRootProps> & {
	orientation?: 'vertical' | 'horizontal' | 'both' | undefined;
	scrollbarXClasses?: string | undefined;
	scrollbarYClasses?: string | undefined;
	viewportRef?: HTMLElement | null;
} = $props();

const rootState = ScrollAreaRootState.create({
	type: boxWith(() => type),
	dir: boxWith(() => dir),
	scrollHideDelay: boxWith(() => scrollHideDelay),
	id: boxWith(() => id),
	ref: boxWith(
		() => ref,
		(v) => (ref = v)
	),
});

const mergedProps = $derived(
	mergeProps(
		{
			'data-slot': 'scroll-area',
			class: cn('relative', className),
		},
		restProps,
		rootState.props
	)
);

const viewportId = createId('viewport', uid);

const viewportState = ScrollAreaViewportState.create({
	id: boxWith(() => viewportId),
	ref: boxWith(
		() => viewportRef,
		(v) => (viewportRef = v)
	),
});

const mergedViewportProps = $derived(
	mergeProps(
		{
			'data-slot': 'scroll-area-viewport',
			class: 'ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1',
		},
		viewportState.props
	)
);
const mergedContentProps = $derived(mergeProps({}, viewportState.contentProps));
</script>

<div {...mergedProps}>
	<div {...mergedViewportProps}>
		<div {...mergedContentProps}>
			{@render children?.()}
		</div>
	</div>
	{#if orientation === 'vertical' || orientation === 'both'}
		<Scrollbar orientation="vertical" class={scrollbarYClasses} />
	{/if}
	{#if orientation === 'horizontal' || orientation === 'both'}
		<Scrollbar orientation="horizontal" class={scrollbarXClasses} />
	{/if}
	<Corner />
</div>

<style>
	/* Hide scrollbars cross browser and enable momentum scroll for touch devices */
	:global([data-scroll-area-viewport]) {
		scrollbar-width: none !important;
		-ms-overflow-style: none !important;
		-webkit-overflow-scrolling: touch !important;
	}
	:global([data-scroll-area-viewport])::-webkit-scrollbar {
		display: none !important;
	}

	:global(:where([data-scroll-area-viewport])) {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}
	:global(:where([data-scroll-area-content])) {
		flex-grow: 1;
	}
</style>
