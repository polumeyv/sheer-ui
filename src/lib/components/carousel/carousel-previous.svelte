<script lang="ts">
	import type { WithoutChildren } from '../../internal/index.js';
	import type { Props } from '../button';
	import CarouselArrow from './carousel-arrow.svelte';

	let { ref = $bindable(null), ...restProps }: WithoutChildren<Props> = $props();
</script>

<CarouselArrow direction="previous" bind:ref {...restProps} />
