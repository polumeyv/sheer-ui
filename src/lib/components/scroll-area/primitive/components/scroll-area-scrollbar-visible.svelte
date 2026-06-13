<script lang="ts">
	import { ScrollAreaScrollbarVisibleState } from "$lib/components/scroll-area/primitive/scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "$lib/components/scroll-area/primitive/index.js";
	import ScrollAreaScrollbarX from "$lib/components/scroll-area/primitive/components/scroll-area-scrollbar-x.svelte";
	import ScrollAreaScrollbarY from "$lib/components/scroll-area/primitive/components/scroll-area-scrollbar-y.svelte";

	let { ...restProps }: Omit<_ScrollbarStubProps, "forceMount"> = $props();

	const scrollbarVisibleState = ScrollAreaScrollbarVisibleState.create();
</script>

{#if scrollbarVisibleState.scrollbar.opts.orientation.current === "horizontal"}
	<ScrollAreaScrollbarX {...restProps} />
{:else}
	<ScrollAreaScrollbarY {...restProps} />
{/if}
