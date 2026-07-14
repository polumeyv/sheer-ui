<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { SliderThumbLabelProps } from '../types.js';
	import { getSliderRoot, SliderThumbLabelState } from '../slider.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import { getLabelPosition } from '../helpers.js';

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

	const root = getSliderRoot();

	const position = $derived(getLabelPosition(root.direction, positionProp));

	const tickLabelState = SliderThumbLabelState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
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
