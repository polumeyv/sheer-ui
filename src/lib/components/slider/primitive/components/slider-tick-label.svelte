<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { SliderTickLabelProps } from "$lib/components/slider/primitive/index.js";
	import { getSliderRootContext, SliderTickLabelState } from "$lib/components/slider/primitive/slider.svelte.js";
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
	}: SliderTickLabelProps = $props();

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

	const tickLabelState = SliderTickLabelState.create({
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
