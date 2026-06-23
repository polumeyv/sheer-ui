<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { SliderThumbProps } from '../types.js';
	import { SliderThumbState } from '../slider.svelte.js';
	import { createId } from '$lib/internal/create-id.js';

	const uid = $props.id();

	let { children, child, ref = $bindable(null), id = createId(uid), index, disabled = false, ...restProps }: SliderThumbProps = $props();

	const thumbState = SliderThumbState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		index: boxWith(() => index),
		disabled: boxWith(() => disabled),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'slider-thumb',
				class:
					'border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
			},
			restProps,
			thumbState.props,
		),
	);
</script>

{#if child}
	{@render child({
		active: thumbState.root.isThumbActive(thumbState.opts.index.current),
		props: mergedProps,
	})}
{:else}
	<span {...mergedProps}>
		{@render children?.({
			active: thumbState.root.isThumbActive(thumbState.opts.index.current),
		})}
	</span>
{/if}
