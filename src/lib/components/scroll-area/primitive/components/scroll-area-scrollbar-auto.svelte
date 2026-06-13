<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import { ScrollAreaScrollbarAutoState } from "$lib/components/scroll-area/primitive/scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "$lib/components/scroll-area/primitive/index.js";
	import ScrollAreaScrollbarVisible from "$lib/components/scroll-area/primitive/components/scroll-area-scrollbar-visible.svelte";
	import PresenceLayer from "$lib/components/_shared/utilities/presence-layer/presence-layer.svelte";

	let { forceMount = false, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarAutoState = ScrollAreaScrollbarAutoState.create();
	const mergedProps = $derived(mergeProps(restProps, scrollbarAutoState.props));
</script>

<PresenceLayer
	open={forceMount || scrollbarAutoState.isVisible}
	ref={scrollbarAutoState.scrollbar.opts.ref}
>
	{#snippet presence()}
		<ScrollAreaScrollbarVisible {...mergedProps} />
	{/snippet}
</PresenceLayer>
