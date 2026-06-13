<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { SliderThumbLabelProps } from "../types.js";
	import { getSliderRootContext, SliderThumbLabelState } from "../slider.svelte.js";
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
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		index: boxWith(() => index),
		position: boxWith(() => position),
	});

	const mergedProps = $derived(mergeProps(restProps, tickLabelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>{@render children?.()}</span>
{/if}
