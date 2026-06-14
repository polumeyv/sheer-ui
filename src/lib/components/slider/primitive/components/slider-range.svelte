<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { SliderRangeProps } from "$lib/components/slider/primitive/index";
	import { SliderRangeState } from "$lib/components/slider/primitive/slider.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: SliderRangeProps = $props();

	const rangeState = SliderRangeState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});
	const mergedProps = $derived(mergeProps(restProps, rangeState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
