<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { MenuArrowProps } from '$lib/components/_shared/menu/index';
	import { MenuArrowState } from '$lib/components/_shared/menu/arrow.svelte';
	import FloatingLayerArrow from '$lib/components/_shared/utilities/floating-layer/components/floating-layer-arrow.svelte';

	let { ref = $bindable(null), ...restProps }: MenuArrowProps = $props();

	const arrowState = MenuArrowState.create();
</script>

<FloatingLayerArrow bind:ref {...mergeProps(restProps, arrowState.props)} />
