<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/index.js";
	import type { PinInputCellProps } from "$lib/components/pin-input/index.js";
	import { PinInputCellState } from "$lib/components/pin-input/pin-input.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		cell,
		child,
		children,
		...restProps
	}: PinInputCellProps = $props();

	const cellState = PinInputCellState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		cell: boxWith(() => cell),
	});

	const mergedProps = $derived(mergeProps(restProps, cellState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
