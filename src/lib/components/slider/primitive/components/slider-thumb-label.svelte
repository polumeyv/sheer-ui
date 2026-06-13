<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { SliderThumbLabelProps } from "$lib/components/slider/primitive/index.js";
	import { getSliderRootContext, SliderThumbLabelState } from "$lib/components/slider/primitive/slider.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		index,
		position: positionProp,
		...restProps
	}: SliderThumbLabelProps = $props();

	const root = getSliderRootContext();

	const position = $derived.by(() => {
		if (positionProp !== undefined) return positionProp;
		switch (root.direction) {
			case "lr":
			case "rl":
				return "top";
			case "tb":
			case "bt":
				return "left";
		}
	});

	const tickLabelState = SliderThumbLabelState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		index: { get current() { return index; } },
		position: { get current() { return position; } },
	});

	const mergedProps = $derived(mergeProps(restProps, tickLabelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>{@render children?.()}</span>
{/if}
