<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { ScrollAreaViewportProps } from "$lib/components/scroll-area/primitive/index";
	import { ScrollAreaViewportState } from "$lib/components/scroll-area/primitive/scroll-area.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		children,
		...restProps
	}: ScrollAreaViewportProps = $props();

	const viewportState = ScrollAreaViewportState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, viewportState.props));
	const mergedContentProps = $derived(mergeProps({}, viewportState.contentProps));
</script>

<div {...mergedProps}>
	<div {...mergedContentProps}>
		{@render children?.()}
	</div>
</div>

<style>
	/* Hide scrollbars cross browser and enable momentum scroll for touch devices */
	:global([data-scroll-area-viewport]) {
		scrollbar-width: none !important;
		-ms-overflow-style: none !important;
		-webkit-overflow-scrolling: touch !important;
	}
	:global([data-scroll-area-viewport])::-webkit-scrollbar {
		display: none !important;
	}

	:global(:where([data-scroll-area-viewport])) {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}
	:global(:where([data-scroll-area-content])) {
		flex-grow: 1;
	}
</style>
