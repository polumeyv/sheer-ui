<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { CalendarMonthSelectProps } from "$lib/components/calendar/index.js";
	import { CalendarMonthSelectState } from "$lib/components/calendar/calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		monthFormat = "long",
		disabled = false,
		"aria-label": ariaLabel = "Select a month",
		...restProps
	}: CalendarMonthSelectProps = $props();

	const monthSelectState = CalendarMonthSelectState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		months: { get current() { return months; } },
		monthFormat: { get current() { return monthFormat; } },
		disabled: { get current() { return Boolean(disabled); } },
	});

	const mergedProps = $derived(
		mergeProps(restProps, monthSelectState.props, { "aria-label": ariaLabel })
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...monthSelectState.snippetProps })}
{:else}
	<select {...mergedProps}>
		{#if children}
			{@render children?.(monthSelectState.snippetProps)}
		{:else}
			{#each monthSelectState.monthItems as month (month.value)}
				<option
					value={month.value}
					selected={month.value === monthSelectState.currentMonth}
				>
					{month.label}
				</option>
			{/each}
		{/if}
	</select>
{/if}
