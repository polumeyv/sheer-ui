<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { DatePickerCalendarProps } from "$lib/components/date-picker/index.js";
	import { getDatePickerRootContext } from "$lib/components/date-picker/date-picker.svelte.js";
	import { CalendarRootState } from "$lib/components/calendar/calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: DatePickerCalendarProps = $props();

	const datePickerRootState = getDatePickerRootContext();

	const calendarState = CalendarRootState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		calendarLabel: datePickerRootState.opts.calendarLabel,
		fixedWeeks: datePickerRootState.opts.fixedWeeks,
		isDateDisabled: datePickerRootState.opts.isDateDisabled,
		isDateUnavailable: datePickerRootState.opts.isDateUnavailable,
		locale: datePickerRootState.opts.locale,
		numberOfMonths: datePickerRootState.opts.numberOfMonths,
		pagedNavigation: datePickerRootState.opts.pagedNavigation,
		preventDeselect: datePickerRootState.opts.preventDeselect,
		readonly: datePickerRootState.opts.readonly,
		type: { get current() { return "single" as const; } },
		weekStartsOn: datePickerRootState.opts.weekStartsOn,
		weekdayFormat: datePickerRootState.opts.weekdayFormat,
		disabled: datePickerRootState.opts.disabled,
		disableDaysOutsideMonth: datePickerRootState.opts.disableDaysOutsideMonth,
		maxValue: datePickerRootState.opts.maxValue,
		minValue: datePickerRootState.opts.minValue,
		placeholder: datePickerRootState.opts.placeholder,
		value: datePickerRootState.opts.value,
		onDateSelect: datePickerRootState.opts.onDateSelect,
		initialFocus: datePickerRootState.opts.initialFocus,
		defaultPlaceholder: datePickerRootState.opts.defaultPlaceholder,
		maxDays: { get current() { return undefined; } },
		monthFormat: datePickerRootState.opts.monthFormat,
		yearFormat: datePickerRootState.opts.yearFormat,
	});

	const mergedProps = $derived(mergeProps(restProps, calendarState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...calendarState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(calendarState.snippetProps)}
	</div>
{/if}
