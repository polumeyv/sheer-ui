<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { ScrollAreaThumbProps } from "$lib/components/scroll-area/primitive/index.js";
	import { ScrollAreaThumbImplState } from "$lib/components/scroll-area/primitive/scroll-area.svelte.js";

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
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
