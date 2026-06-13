<script lang="ts">
	import { mergeProps } from "$lib/vendor/toolbelt/index.js";
	import { ScrollAreaScrollbarScrollState } from "$lib/components/scroll-area/primitive/scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "$lib/components/scroll-area/primitive/index.js";
	import ScrollAreaScrollbarVisible from "$lib/components/scroll-area/primitive/components/scroll-area-scrollbar-visible.svelte";
	import PresenceLayer from "$lib/components/_shared/utilities/presence-layer/presence-layer.svelte";

	let { forceMount = false, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarScrollState = ScrollAreaScrollbarScrollState.create();

	const mergedProps = $derived(mergeProps(restProps, scrollbarScrollState.props));
</script>

<PresenceLayer
	{...mergedProps}
	open={forceMount || !scrollbarScrollState.isHidden}
	ref={scrollbarScrollState.scrollbar.opts.ref}
>
	{#snippet presence()}
		<ScrollAreaScrollbarVisible {...mergedProps} />
	{/snippet}
</PresenceLayer>
