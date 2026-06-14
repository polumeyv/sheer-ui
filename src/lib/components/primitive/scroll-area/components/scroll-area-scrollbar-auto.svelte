<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { ScrollAreaScrollbarAutoState } from "$lib/components/primitive/scroll-area/scroll-area.svelte";
	import type { _ScrollbarStubProps } from "$lib/components/primitive/scroll-area/index";
	import ScrollAreaScrollbarVisible from "$lib/components/primitive/scroll-area/components/scroll-area-scrollbar-visible.svelte";
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
