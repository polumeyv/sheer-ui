<script lang="ts">
	import type { ScrollAreaThumbProps } from "../types.js";
	import { getScrollAreaScrollbarVisible } from "../scroll-area.svelte.js";
	import ScrollAreaThumbImpl from "./scroll-area-thumb-impl.svelte";
	import { createId } from "../../../internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		...restProps
	}: ScrollAreaThumbProps = $props();

	const scrollbarState = getScrollAreaScrollbarVisible();
</script>

{#if forceMount || scrollbarState.hasThumb}
	<ScrollAreaThumbImpl {...restProps} {id} bind:ref present={scrollbarState.hasThumb} />
{/if}
