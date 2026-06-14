<script lang="ts">
		import type { ScrollAreaScrollbarProps } from "$lib/components/primitive/scroll-area/index";
	import { ScrollAreaScrollbarState } from "$lib/components/primitive/scroll-area/scroll-area.svelte";
	import ScrollAreaScrollbarAuto from "$lib/components/primitive/scroll-area/components/scroll-area-scrollbar-auto.svelte";
	import ScrollAreaScrollbarScroll from "$lib/components/primitive/scroll-area/components/scroll-area-scrollbar-scroll.svelte";
	import ScrollAreaScrollbarHover from "$lib/components/primitive/scroll-area/components/scroll-area-scrollbar-hover.svelte";
	import ScrollAreaScrollbarVisible from "$lib/components/primitive/scroll-area/components/scroll-area-scrollbar-visible.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		orientation,
		...restProps
	}: ScrollAreaScrollbarProps = $props();

	const scrollbarState = ScrollAreaScrollbarState.create({
		orientation: { get current() { return orientation; } },
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
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
