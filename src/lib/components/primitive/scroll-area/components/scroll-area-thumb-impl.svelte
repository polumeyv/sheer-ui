<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { ScrollAreaThumbProps } from "$lib/components/primitive/scroll-area/index";
	import { ScrollAreaThumbImplState } from "$lib/components/primitive/scroll-area/scroll-area.svelte";

	let {
		ref = $bindable(null),
		id,
		child,
		children,
		present,
		...restProps
	}: Omit<ScrollAreaThumbProps, "forceMount" | "id"> & {
		id: string;
		present: boolean;
	} = $props();

	const thumbState = ScrollAreaThumbImplState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(
		mergeProps(restProps, thumbState.props, {
			style: {
				hidden: !present,
			},
		})
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
