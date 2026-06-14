<script lang="ts">
	import type { PopoverArrowProps } from "$lib/components/primitive/popover/index";
	import FloatingLayerArrow from "$lib/components/_shared/utilities/floating-layer/components/floating-layer-arrow.svelte";

	let { ref = $bindable(null), ...restProps }: PopoverArrowProps = $props();
</script>

<FloatingLayerArrow bind:ref {...restProps} data-popover-arrow="" />
