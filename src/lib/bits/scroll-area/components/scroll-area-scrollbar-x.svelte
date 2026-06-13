<script lang="ts">
	import { mergeProps } from "$lib/vendor/toolbelt/index.js";
	import { ScrollAreaScrollbarXState } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarShared from "./scroll-area-scrollbar-shared.svelte";

	let { ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarXState = ScrollAreaScrollbarXState.create();
	// oxlint-disable-next-line no-explicit-any
	const mergedProps = $derived(mergeProps(restProps, scrollbarXState.props)) as any;
</script>

<ScrollAreaScrollbarShared {...mergedProps} />
