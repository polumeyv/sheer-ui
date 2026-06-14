<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { CalendarHeadCellState } from "$lib/components/primitive/calendar/calendar.svelte";
	import type { CalendarHeadCellProps } from "$lib/components/primitive/calendar/index";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarHeadCellProps = $props();

	const headCellState = CalendarHeadCellState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, headCellState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<th {...mergedProps}>
		{@render children?.()}
	</th>
{/if}
