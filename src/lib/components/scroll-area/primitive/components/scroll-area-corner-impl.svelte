<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { ScrollAreaCornerProps } from "$lib/components/scroll-area/primitive/index.js";
	import { ScrollAreaCornerImplState } from "$lib/components/scroll-area/primitive/scroll-area.svelte.js";

	let {
		ref = $bindable(null),
		id,
		children,
		child,
		...restProps
	}: Omit<ScrollAreaCornerProps, "id"> & {
		id: string;
	} = $props();

	const cornerState = ScrollAreaCornerImplState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, cornerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
