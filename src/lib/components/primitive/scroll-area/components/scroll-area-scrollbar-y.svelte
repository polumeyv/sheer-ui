<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { ScrollAreaScrollbarYState } from "$lib/components/primitive/scroll-area/scroll-area.svelte";
	import type { _ScrollbarStubProps } from "$lib/components/primitive/scroll-area/index";
	import ScrollAreaScrollbarShared from "$lib/components/primitive/scroll-area/components/scroll-area-scrollbar-shared.svelte";

	let { ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarYState = ScrollAreaScrollbarYState.create();

	// oxlint-disable-next-line no-explicit-any
	const mergedProps = $derived(mergeProps(restProps, scrollbarYState.props)) as any;
</script>

<ScrollAreaScrollbarShared {...mergedProps} />
