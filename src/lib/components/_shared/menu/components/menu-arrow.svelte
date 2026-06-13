<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { MenuArrowProps } from "$lib/components/_shared/menu/index.js";
	import { MenuArrowState } from "$lib/components/_shared/menu/menu.svelte.js";
	import FloatingLayerArrow from "$lib/components/_shared/utilities/floating-layer/components/floating-layer-arrow.svelte";

	let { ref = $bindable(null), ...restProps }: MenuArrowProps = $props();

	const arrowState = MenuArrowState.create();

	const mergedProps = $derived(mergeProps(restProps, arrowState.props));
</script>

<FloatingLayerArrow bind:ref {...mergedProps} />
