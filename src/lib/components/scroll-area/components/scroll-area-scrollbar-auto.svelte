<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import { ScrollAreaScrollbarAutoState } from '../scroll-area.svelte.js';
	import type { _ScrollbarStubProps } from '../types.js';
	import ScrollAreaScrollbarVisible from './scroll-area-scrollbar-visible.svelte';

	let { forceMount = false, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarAutoState = ScrollAreaScrollbarAutoState.create();
	const mergedProps = $derived(mergeProps(restProps, scrollbarAutoState.props));
</script>

{#if forceMount || scrollbarAutoState.isVisible}
	<ScrollAreaScrollbarVisible {...mergedProps} />
{/if}
