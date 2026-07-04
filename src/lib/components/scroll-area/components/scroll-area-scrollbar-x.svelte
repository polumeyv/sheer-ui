<script lang="ts">
	import { onMount } from 'svelte';
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import { ScrollAreaScrollbarXState } from '../scroll-area.svelte.js';
	import type { _ScrollbarStubProps } from '../types.js';
	import ScrollAreaScrollbarShared from './scroll-area-scrollbar-shared.svelte';

	let { ...restProps }: _ScrollbarStubProps = $props();

	let isMounted = $state(false);
	onMount(() => {
		isMounted = true;
	});

	const scrollbarXState = ScrollAreaScrollbarXState.create({
		mounted: boxWith(() => isMounted),
	});
	// oxlint-disable-next-line no-explicit-any
	const mergedProps = $derived(mergeProps(restProps, scrollbarXState.props)) as any;
</script>

<ScrollAreaScrollbarShared {...mergedProps} />
