<script lang="ts">
	import { join } from 'overrule';
	import { untrack } from 'svelte';
	import { boxWith, type WritableBox } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { SliderRootProps } from '../types.js';
	import { SliderRootState } from '../slider.svelte.js';
	import SliderRange from './slider-range.svelte';
	import SliderThumb from './slider-thumb.svelte';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		type,
		onValueChange = () => {},
		onValueCommit = () => {},
		disabled = false,
		min: minProp,
		max: maxProp,
		step = 1,
		dir = 'ltr',
		autoSort = true,
		orientation = 'horizontal',
		thumbPositioning = 'contain',
		trackPadding,
		class: className,
		...restProps
	}: SliderRootProps = $props();

	// Slider mode is construction-static: the root state chooses a single/multiple class once.
	const valueType = untrack(() => type);

	const min = $derived.by(() => {
		if (minProp !== undefined) return minProp;
		if (Array.isArray(step)) return Math.min(...step);
		return 0;
	});

	const max = $derived.by(() => {
		if (maxProp !== undefined) return maxProp;
		if (Array.isArray(step)) return Math.max(...step);
		return 100;
	});

	function repairUndefinedMultipleControlledValue() {
		if (value !== undefined) return;
		if (valueType !== 'multiple') return;
		value = [];
	}

	// SSR/initial setup: multiple Slider owns an array shape, even when empty.
	repairUndefinedMultipleControlledValue();

	$effect.pre(() => {
		value;

		untrack(() => {
			/**
			 * Parent spread-prop resets can make the bindable value undefined again.
			 * Repairing multiple mode here prevents internal range math from reading
			 * an undefined array. Single mode is normalized by the root state to the
			 * current min/step grid so existing onValueChange behavior is preserved.
			 */
			repairUndefinedMultipleControlledValue();
		});
	});

	const rootState = SliderRootState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				// @ts-expect-error - we know
				onValueChange(v);
			},
		) as WritableBox<number> | WritableBox<number[]>,
		// @ts-expect-error - we know
		onValueCommit: boxWith(() => onValueCommit),
		disabled: boxWith(() => disabled),
		min: boxWith(() => min),
		max: boxWith(() => max),
		step: boxWith(() => step),
		dir: boxWith(() => dir),
		autoSort: boxWith(() => autoSort),
		orientation: boxWith(() => orientation),
		thumbPositioning: boxWith(() => thumbPositioning),
		type: valueType,
		trackPadding: boxWith(() => trackPadding),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'slider',
				class: join(
					'relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
					className,
				),
			},
			restProps,
			rootState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<span {...mergedProps}>
		{#if children}
			{@render children(rootState.snippetProps)}
		{:else}
			{@const { thumbs } = rootState.snippetProps}
			<span
				data-orientation={orientation}
				data-slot="slider-track"
				class="bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5">
				<SliderRange />
			</span>
			{#each thumbs as thumb (thumb)}
				<SliderThumb index={thumb} />
			{/each}
		{/if}
	</span>
{/if}
