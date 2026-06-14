<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { DateRangePickerCalendarProps } from "$lib/components/date-range-picker/index";
	import { getDateRangePickerRootContext } from "$lib/components/date-range-picker/date-range-picker.svelte";
	import { createId } from "$lib/vendor/create-id";
	import { RangeCalendarRootState } from "$lib/components/range-calendar/range-calendar.svelte";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: DateRangePickerCalendarProps = $props();

	const dateRangePickerRootState = getDateRangePickerRootContext();

	const rangeCalendarState = RangeCalendarRootState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		calendarLabel: dateRangePickerRootState.opts.calendarLabel,
		fixedWeeks: dateRangePickerRootState.opts.fixedWeeks,
		isDateDisabled: dateRangePickerRootState.opts.isDateDisabled,
		isDateUnavailable: dateRangePickerRootState.opts.isDateUnavailable,
		locale: dateRangePickerRootState.opts.locale,
		numberOfMonths: dateRangePickerRootState.opts.numberOfMonths,
		pagedNavigation: dateRangePickerRootState.opts.pagedNavigation,
		preventDeselect: dateRangePickerRootState.opts.preventDeselect,
		readonly: dateRangePickerRootState.opts.readonly,
		weekStartsOn: dateRangePickerRootState.opts.weekStartsOn,
		weekdayFormat: dateRangePickerRootState.opts.weekdayFormat,
		disabled: dateRangePickerRootState.opts.disabled,
		disableDaysOutsideMonth: dateRangePickerRootState.opts.disableDaysOutsideMonth,
		maxValue: dateRangePickerRootState.opts.maxValue,
		minValue: dateRangePickerRootState.opts.minValue,
		placeholder: dateRangePickerRootState.opts.placeholder,
		value: dateRangePickerRootState.opts.value,
		excludeDisabled: dateRangePickerRootState.opts.excludeDisabled,
		onRangeSelect: dateRangePickerRootState.opts.onRangeSelect,
		startValue: dateRangePickerRootState.opts.startValue,
		endValue: dateRangePickerRootState.opts.endValue,
		defaultPlaceholder: dateRangePickerRootState.opts.defaultPlaceholder,
		minDays: dateRangePickerRootState.opts.minDays,
		maxDays: dateRangePickerRootState.opts.maxDays,
		monthFormat: dateRangePickerRootState.opts.monthFormat,
		yearFormat: dateRangePickerRootState.opts.yearFormat,
	});

	const mergedProps = $derived(mergeProps(restProps, rangeCalendarState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...rangeCalendarState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(rangeCalendarState.snippetProps)}
	</div>
{/if}
