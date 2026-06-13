<script lang="ts">import { untrack } from "svelte";
	import { mergeProps, type WritableProp } from "$lib/vendor/index.js";
	import type { SliderRootProps } from "$lib/components/slider/primitive/index.js";
	import { SliderRootState } from "$lib/components/slider/primitive/slider.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		type,
		onValueChange = (() => {}),
		onValueCommit = (() => {}),
		disabled = false,
		min: minProp,
		max: maxProp,
		step = 1,
		dir = "ltr",
		autoSort = true,
		orientation = "horizontal",
		thumbPositioning = "contain",
		trackPadding,
		...restProps
	}: SliderRootProps = $props();

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
		if (type === "single") {
			return min;
		}
		return [];
	}

	// SSR
	handleDefaultValue();

	$effect.pre(() => {
		void (value);
		untrack(() => {
			handleDefaultValue();
		});
	});

	const rootState = SliderRootState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		value: { get current() { return value; }, set current(v) {
        				value = v;
        				// @ts-expect-error - we know
        				onValueChange(v);
        			} } as WritableProp<number> | WritableProp<number[]>,
		// @ts-expect-error - we know
		onValueCommit: { get current() { return onValueCommit; } },
		disabled: { get current() { return disabled; } },
		min: { get current() { return min; } },
		max: { get current() { return max; } },
		step: { get current() { return step; } },
		dir: { get current() { return dir; } },
		autoSort: { get current() { return autoSort; } },
		orientation: { get current() { return orientation; } },
		thumbPositioning: { get current() { return thumbPositioning; } },
		type,
		trackPadding: { get current() { return trackPadding; } },
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</span>
{/if}
