<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { PinInputCellProps } from "$lib/components/pin-input/index";
	import { PinInputCellState } from "$lib/components/pin-input/pin-input.svelte";
	import { createId } from "$lib/vendor/create-id";

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
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		cell: { get current() { return cell; } },
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
