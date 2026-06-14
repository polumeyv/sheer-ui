<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import {
		ScrollAreaScrollbarAutoState,
		ScrollAreaScrollbarHoverState,
	} from "$lib/components/primitive/scroll-area/scroll-area.svelte";
	import type { _ScrollbarStubProps } from "$lib/components/primitive/scroll-area/index";
	import ScrollAreaScrollbarVisible from "$lib/components/primitive/scroll-area/components/scroll-area-scrollbar-visible.svelte";
	import PresenceLayer from "$lib/components/_shared/utilities/presence-layer/presence-layer.svelte";

	let { forceMount = false, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarHoverState = ScrollAreaScrollbarHoverState.create();
	const scrollbarAutoState = ScrollAreaScrollbarAutoState.create();
	const mergedProps = $derived(
		mergeProps(restProps, scrollbarHoverState.props, scrollbarAutoState.props, {
			"data-state": scrollbarHoverState.isVisible ? "visible" : "hidden",
		})
	);

	const open = $derived(
		forceMount || (scrollbarHoverState.isVisible && scrollbarAutoState.isVisible)
	);
</script>

<PresenceLayer {open} ref={scrollbarAutoState.scrollbar.opts.ref}>
	{#snippet presence()}
		<ScrollAreaScrollbarVisible {...mergedProps} />
	{/snippet}
</PresenceLayer>
