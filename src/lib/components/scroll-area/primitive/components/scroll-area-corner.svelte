<script lang="ts">
	import type { ScrollAreaCornerProps } from "$lib/components/scroll-area/primitive/index.js";
	import { getScrollAreaRootContext } from "$lib/components/scroll-area/primitive/scroll-area.svelte.js";
	import ScrollAreaCornerImpl from "$lib/components/scroll-area/primitive/components/scroll-area-corner-impl.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: ScrollAreaCornerProps = $props();

	const scrollAreaState = getScrollAreaRootContext();

	const hasBothScrollbarsVisible = $derived(
		Boolean(scrollAreaState.scrollbarXNode && scrollAreaState.scrollbarYNode)
	);
	const hasCorner = $derived(
		scrollAreaState.opts.type.current !== "scroll" && hasBothScrollbarsVisible
	);
</script>

{#if hasCorner}
	<ScrollAreaCornerImpl {...restProps} {id} bind:ref />
{/if}
