<script lang="ts">
	import { boxWith, mergeProps, type WritableBox } from '$lib/vendor/toolbelt/index.js';
	import type { SliderRootProps } from '$lib/components/slider/primitive/types.js';
	import { SliderRootState, SliderRangeState } from '$lib/components/slider/primitive/slider.svelte.js';
	import SliderThumb from '$lib/components/slider/primitive/components/slider-thumb.svelte';
	import { createId } from '$lib/internal/create-id.js';
	import { noop } from '$lib/internal/noop.js';
	import { watch } from '$lib/vendor/runed/index.js';
	import { cn, type WithoutChildrenOrChild } from '../../utils';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		value = $bindable(),
		type,
		onValueChange = noop,
		onValueCommit = noop,
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
	}: WithoutChildrenOrChild<SliderRootProps> = $props();

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

	function handleDefaultValue() {
		if (value !== undefined) return;
		if (type === 'single') {
			return min;
		}
		return [];
	}

	// SSR
	handleDefaultValue();

	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	const rootState = SliderRootState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				// @ts-expect-error - we know
				onValueChange(v);
			}
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
		type,
		trackPadding: boxWith(() => trackPadding),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'slider',
				class: cn(
					'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
					className
				),
			},
			restProps,
			rootState.props
		)
	);

	// Range shell, inlined.
	const rangeId = createId(`${uid}-range`);
	let rangeRef = $state<HTMLElement | null>(null);
	const rangeState = SliderRangeState.create({
		id: boxWith(() => rangeId),
		ref: boxWith(
			() => rangeRef,
			(v) => (rangeRef = v)
		),
	});

	const rangeMergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'slider-range',
				class: cn(
					'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
				),
			},
			rangeState.props
		)
	);
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<span {...mergedProps}>
	{#snippet children({ thumbs }: { thumbs: number[] })}
		<span
			data-orientation={orientation}
			data-slot="slider-track"
			class={cn(
				'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'
			)}
		>
			<span {...rangeMergedProps}></span>
		</span>
		{#each thumbs as thumb (thumb)}
			<SliderThumb
				data-slot="slider-thumb"
				index={thumb}
				class="border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
			/>
		{/each}
	{/snippet}
	{@render children({ thumbs: rootState.snippetProps.thumbs })}
</span>
