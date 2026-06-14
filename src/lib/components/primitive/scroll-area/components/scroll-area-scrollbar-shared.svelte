<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { ScrollAreaScrollbarSharedState } from "$lib/components/primitive/scroll-area/scroll-area.svelte";
	import type { _ScrollbarStubProps } from "$lib/components/primitive/scroll-area/index";

	let { child, children, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarSharedState = ScrollAreaScrollbarSharedState.create();

	const mergedProps = $derived(mergeProps(restProps, scrollbarSharedState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
