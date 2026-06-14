<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import { CalendarCellState } from "$lib/components/calendar/calendar.svelte";
	import type { CalendarCellProps } from "$lib/components/calendar/index";
	import { createId } from "$lib/vendor/create-id";

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
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		date: { get current() { return date; } },
		month: { get current() { return month; } },
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
