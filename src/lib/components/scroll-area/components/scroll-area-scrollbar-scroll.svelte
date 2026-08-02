<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import { ScrollAreaScrollbarScrollState } from '../scroll-area.svelte.js';
	import type { _ScrollbarStubProps } from '../types.js';
	import ScrollAreaScrollbarVisible from './scroll-area-scrollbar-visible.svelte';

	let { forceMount = false, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarScrollState = ScrollAreaScrollbarScrollState.create();

	const mergedProps = $derived(mergeProps(restProps, scrollbarScrollState.props));
</script>

{#if forceMount || !scrollbarScrollState.isHidden}
	<ScrollAreaScrollbarVisible {...mergedProps} />
{/if}
