<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { RangeCalendarDayProps } from "$lib/components/range-calendar/index.js";
	import { RangeCalendarDayState } from "$lib/components/range-calendar/range-calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

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
