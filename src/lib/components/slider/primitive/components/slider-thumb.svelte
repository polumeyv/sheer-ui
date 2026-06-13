<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { SliderThumbProps } from "$lib/components/slider/primitive/index.js";
	import { SliderThumbState } from "$lib/components/slider/primitive/slider.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		index,
		disabled = false,
		...restProps
	}: SliderThumbProps = $props();

	const thumbState = SliderThumbState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		index: { get current() { return index; } },
		disabled: { get current() { return disabled; } },
	});

	const mergedProps = $derived(mergeProps(restProps, thumbState.props));
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
