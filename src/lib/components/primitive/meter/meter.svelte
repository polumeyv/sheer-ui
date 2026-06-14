<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { MeterRootProps } from "$lib/components/primitive/meter/index";
	import { MeterRootState } from "./meter.svelte.js";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		child,
		children,
		value = 0,
		max = 100,
		min = 0,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: MeterRootProps = $props();

	const rootState = MeterRootState.create({
		value: { get current() { return value; } },
		max: { get current() { return max; } },
		min: { get current() { return min; } },
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
