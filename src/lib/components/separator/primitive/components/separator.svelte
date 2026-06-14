<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import { SeparatorRootState } from "$lib/components/separator/primitive/separator.svelte";
	import type { SeparatorRootProps } from "$lib/components/separator/primitive/index";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		decorative = false,
		orientation = "horizontal",
		...restProps
	}: SeparatorRootProps = $props();

	const rootState = SeparatorRootState.create({
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		id: { get current() { return id; } },
		decorative: { get current() { return decorative; } },
		orientation: { get current() { return orientation; } },
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
