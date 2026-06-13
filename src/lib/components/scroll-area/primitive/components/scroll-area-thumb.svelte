<script lang="ts">
	import type { ScrollAreaThumbProps } from "$lib/components/scroll-area/primitive/types.js";
	import { getScrollAreaScrollbarVisibleContext } from "$lib/components/scroll-area/primitive/scroll-area.svelte.js";
	import ScrollAreaThumbImpl from "$lib/components/scroll-area/primitive/components/scroll-area-thumb-impl.svelte";
	import { createId } from "$lib/internal/create-id.js";
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
