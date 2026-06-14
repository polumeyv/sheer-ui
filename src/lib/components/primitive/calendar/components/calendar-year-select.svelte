<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { CalendarYearSelectProps } from "$lib/components/primitive/calendar/index";
	import { CalendarYearSelectState } from "$lib/components/primitive/calendar/calendar.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		years,
		yearFormat = "numeric",
		disabled = false,
		"aria-label": ariaLabel = "Select a year",
		...restProps
	}: CalendarYearSelectProps = $props();

	const yearSelectState = CalendarYearSelectState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		years: { get current() { return years; } },
		yearFormat: { get current() { return yearFormat; } },
		disabled: { get current() { return Boolean(disabled); } },
	});

	const mergedProps = $derived(
		mergeProps(restProps, yearSelectState.props, { "aria-label": ariaLabel })
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...yearSelectState.snippetProps })}
{:else}
	<select {...mergedProps}>
		{#if children}
			{@render children?.(yearSelectState.snippetProps)}
		{:else}
			{#each yearSelectState.yearItems as year (year.value)}
				<option value={year.value} selected={year.value === yearSelectState.currentYear}>
					{year.label}
				</option>
			{/each}
		{/if}
	</select>
{/if}
