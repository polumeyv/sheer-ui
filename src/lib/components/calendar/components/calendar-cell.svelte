<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/index.js";
	import { CalendarCellState } from "$lib/components/calendar/calendar.svelte.js";
	import type { CalendarCellProps } from "$lib/components/calendar/index.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		date,
		month,
		...restProps
	}: CalendarCellProps = $props();

	const cellState = CalendarCellState.create({
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
	{@render child({
		props: mergedProps,
		...cellState.snippetProps,
	})}
{:else}
	<td {...mergedProps}>
		{@render children?.(cellState.snippetProps)}
	</td>
{/if}
