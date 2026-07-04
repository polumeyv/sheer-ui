<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { ScrollAreaRootProps } from '../types.js';
	import { ScrollAreaRootState, ScrollAreaViewportState } from '../scroll-area.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import Scrollbar from './scroll-area-scrollbar.svelte';
	import Corner from './scroll-area-corner.svelte';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		viewportRef = $bindable(null),
		id = createId(uid),
		type = 'hover',
		dir = 'ltr',
		scrollHideDelay = 600,
		orientation = 'vertical',
		scrollbarXClasses = '',
		scrollbarYClasses = '',
		children,
		...restProps
	}: ScrollAreaRootProps & {
		orientation?: 'vertical' | 'horizontal' | 'both' | undefined;
		scrollbarXClasses?: ClassValue | undefined;
		scrollbarYClasses?: ClassValue | undefined;
		viewportRef?: HTMLElement | null;
	} = $props();

	const rootState = ScrollAreaRootState.create({
		type: boxWith(() => type),
		dir: boxWith(() => dir),
		scrollHideDelay: boxWith(() => scrollHideDelay),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(mergeProps({ 'data-slot': 'scroll-area', class: 'relative' }, restProps, rootState.props));

	const viewportId = createId(uid);

	const viewportState = ScrollAreaViewportState.create({
		id: boxWith(() => viewportId),
		ref: boxWith(
			() => viewportRef,
			(v) => (viewportRef = v),
		),
	});

	const mergedViewportProps = $derived(
		mergeProps(
			{
				'data-slot': 'scroll-area-viewport',
				class:
					'ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1',
			},
			viewportState.props,
		),
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
