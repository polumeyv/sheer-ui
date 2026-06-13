<script lang="ts">
	import type { TooltipArrowProps } from "$lib/components/tooltip/primitive/types.js";
	import FloatingLayerArrow from "$lib/components/_shared/utilities/floating-layer/components/floating-layer-arrow.svelte";

	let { ref = $bindable(null), ...restProps }: TooltipArrowProps = $props();
</script>

<FloatingLayerArrow bind:ref {...restProps} />
