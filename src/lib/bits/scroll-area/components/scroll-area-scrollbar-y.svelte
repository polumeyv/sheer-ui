<script lang="ts">
	import { mergeProps } from "$lib/vendor/toolbelt/index.js";
	import { ScrollAreaScrollbarYState } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarShared from "./scroll-area-scrollbar-shared.svelte";

	let { ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarYState = ScrollAreaScrollbarYState.create();

	// oxlint-disable-next-line no-explicit-any
	const mergedProps = $derived(mergeProps(restProps, scrollbarYState.props)) as any;
</script>

<ScrollAreaScrollbarShared {...mergedProps} />
