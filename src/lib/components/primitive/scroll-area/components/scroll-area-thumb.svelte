<script lang="ts">
	import type { ScrollAreaThumbProps } from "$lib/components/primitive/scroll-area/index";
	import { getScrollAreaScrollbarVisibleContext } from "$lib/components/primitive/scroll-area/scroll-area.svelte";
	import ScrollAreaThumbImpl from "$lib/components/primitive/scroll-area/components/scroll-area-thumb-impl.svelte";
	import { createId } from "$lib/vendor/create-id";
	import PresenceLayer from "$lib/components/_shared/utilities/presence-layer/presence-layer.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		...restProps
	}: ScrollAreaThumbProps = $props();

	const scrollbarState = getScrollAreaScrollbarVisibleContext();
</script>

<PresenceLayer open={forceMount || scrollbarState.hasThumb} ref={scrollbarState.scrollbar.opts.ref}>
	{#snippet presence({ present })}
		<ScrollAreaThumbImpl {...restProps} {id} bind:ref {present} />
	{/snippet}
</PresenceLayer>
