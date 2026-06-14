<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { RangeCalendarDayProps } from "$lib/components/primitive/range-calendar/index";
	import { RangeCalendarDayState } from "$lib/components/primitive/range-calendar/range-calendar.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: RangeCalendarDayProps = $props();

	const dayState = RangeCalendarDayState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, dayState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...dayState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{#if children}
			{@render children?.(dayState.snippetProps)}
		{:else}
			{dayState.cell.opts.date.current.day}
		{/if}
	</div>
{/if}
