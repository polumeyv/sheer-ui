<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { SliderRangeProps } from '../types.js';
	import { SliderRangeState } from '../slider.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { children, child, ref = $bindable(null), id = createId(uid), ...restProps }: SliderRangeProps = $props();

	const rangeState = SliderRangeState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});
	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'slider-range',
				class: 'bg-primary absolute data-horizontal:h-full data-vertical:w-full',
			},
			restProps,
			rangeState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
