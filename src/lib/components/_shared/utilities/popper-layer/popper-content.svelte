<script lang="ts">
	import FloatingLayerContentStatic from "$lib/components/_shared/utilities/floating-layer/components/floating-layer-content-static.svelte";
	import FloatingLayerContent from "$lib/components/_shared/utilities/floating-layer/components/floating-layer-content.svelte";
	import type { FloatingLayerContentImplProps } from "$lib/components/_shared/utilities/floating-layer/index";

	let {
		content,
		isStatic = false,
		onPlaced,
		...restProps
	}: FloatingLayerContentImplProps & { isStatic: boolean } = $props();
</script>

{#if isStatic}
	<FloatingLayerContentStatic {content} {onPlaced} />
{:else}
	<FloatingLayerContent {content} {onPlaced} {...restProps} />
{/if}
