<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import { ScrollAreaScrollbarSharedState } from "$lib/components/scroll-area/primitive/scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "$lib/components/scroll-area/primitive/index.js";

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
