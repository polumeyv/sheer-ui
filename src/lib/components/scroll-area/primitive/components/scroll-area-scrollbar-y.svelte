<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import { ScrollAreaScrollbarYState } from "$lib/components/scroll-area/primitive/scroll-area.svelte";
	import type { _ScrollbarStubProps } from "$lib/components/scroll-area/primitive/index";
	import ScrollAreaScrollbarShared from "$lib/components/scroll-area/primitive/components/scroll-area-scrollbar-shared.svelte";

	let { ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarYState = ScrollAreaScrollbarYState.create();

	// oxlint-disable-next-line no-explicit-any
	const mergedProps = $derived(mergeProps(restProps, scrollbarYState.props)) as any;
</script>

<ScrollAreaScrollbarShared {...mergedProps} />
