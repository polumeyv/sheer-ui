<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { RangeCalendarCellProps } from "$lib/components/range-calendar/index.js";
	import { RangeCalendarCellState } from "$lib/components/range-calendar/range-calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		date,
		month,
		...restProps
	}: RangeCalendarCellProps = $props();

	const cellState = RangeCalendarCellState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		date: boxWith(() => date),
		month: boxWith(() => month),
	});

	const mergedProps = $derived(mergeProps(restProps, cellState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...cellState.snippetProps })}
{:else}
	<td {...mergedProps}>
		{@render children?.(cellState.snippetProps)}
	</td>
{/if}
