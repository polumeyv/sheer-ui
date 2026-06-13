<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { SliderTickProps } from "$lib/components/slider/primitive/types.js";
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
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		index: boxWith(() => index),
	});

	const mergedProps = $derived(mergeProps(restProps, tickState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>{@render children?.()}</span>
{/if}
