<script lang="ts">
	import { ScrollAreaScrollbarVisibleState } from "$lib/components/primitive/scroll-area/scroll-area.svelte";
	import type { _ScrollbarStubProps } from "$lib/components/primitive/scroll-area/index";
	import ScrollAreaScrollbarX from "$lib/components/primitive/scroll-area/components/scroll-area-scrollbar-x.svelte";
	import ScrollAreaScrollbarY from "$lib/components/primitive/scroll-area/components/scroll-area-scrollbar-y.svelte";

	let { ...restProps }: Omit<_ScrollbarStubProps, "forceMount"> = $props();

	const scrollbarVisibleState = ScrollAreaScrollbarVisibleState.create();
</script>

{#if scrollbarVisibleState.scrollbar.opts.orientation.current === "horizontal"}
	<ScrollAreaScrollbarX {...restProps} />
{:else}
	<ScrollAreaScrollbarY {...restProps} />
{/if}
