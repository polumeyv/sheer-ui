<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import { ScrollAreaScrollbarXState } from "$lib/components/scroll-area/primitive/scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "$lib/components/scroll-area/primitive/index.js";
	import ScrollAreaScrollbarShared from "$lib/components/scroll-area/primitive/components/scroll-area-scrollbar-shared.svelte";

	let { ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarXState = ScrollAreaScrollbarXState.create();
	// oxlint-disable-next-line no-explicit-any
	const mergedProps = $derived(mergeProps(restProps, scrollbarXState.props)) as any;
</script>

<ScrollAreaScrollbarShared {...mergedProps} />
