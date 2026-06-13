<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { SliderTickProps } from "$lib/components/slider/primitive/index.js";
	import { SliderTickState } from "$lib/components/slider/primitive/slider.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		index,
		...restProps
	}: SliderTickProps = $props();

	const tickState = SliderTickState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		index: { get current() { return index; } },
	});

	const mergedProps = $derived(mergeProps(restProps, tickState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>{@render children?.()}</span>
{/if}
