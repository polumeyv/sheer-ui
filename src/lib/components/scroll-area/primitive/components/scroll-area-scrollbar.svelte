<script lang="ts">
	import { boxWith } from "$lib/vendor/toolbelt/index.js";
	import type { ScrollAreaScrollbarProps } from "$lib/components/scroll-area/primitive/index.js";
	import { ScrollAreaScrollbarState } from "$lib/components/scroll-area/primitive/scroll-area.svelte.js";
	import ScrollAreaScrollbarAuto from "$lib/components/scroll-area/primitive/components/scroll-area-scrollbar-auto.svelte";
	import ScrollAreaScrollbarScroll from "$lib/components/scroll-area/primitive/components/scroll-area-scrollbar-scroll.svelte";
	import ScrollAreaScrollbarHover from "$lib/components/scroll-area/primitive/components/scroll-area-scrollbar-hover.svelte";
	import ScrollAreaScrollbarVisible from "$lib/components/scroll-area/primitive/components/scroll-area-scrollbar-visible.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		orientation,
		...restProps
	}: ScrollAreaScrollbarProps = $props();

	const scrollbarState = ScrollAreaScrollbarState.create({
		orientation: boxWith(() => orientation),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const type = $derived(scrollbarState.root.opts.type.current);
</script>

{#if type === "hover"}
	<ScrollAreaScrollbarHover {...restProps} {id} />
{:else if type === "scroll"}
	<ScrollAreaScrollbarScroll {...restProps} {id} />
{:else if type === "auto"}
	<ScrollAreaScrollbarAuto {...restProps} {id} />
{:else if type === "always"}
	<ScrollAreaScrollbarVisible {...restProps} {id} />
{/if}
