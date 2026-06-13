<script lang="ts">import { untrack } from "svelte";
		import { mergeProps } from "$lib/vendor/index.js";
	import { type DateValue } from "@internationalized/date";
	import type { RangeCalendarRootProps } from "$lib/components/range-calendar/index.js";
	import { RangeCalendarRootState } from "$lib/components/range-calendar/range-calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/components/_shared/utilities/config/prop-resolvers.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = (() => {}),
		placeholder = $bindable(),
		onPlaceholderChange = (() => {}),
		weekdayFormat = "narrow",
		weekStartsOn,
		pagedNavigation = false,
		isDateDisabled = () => false,
		isDateUnavailable = () => false,
		fixedWeeks = false,
		numberOfMonths = 1,
		locale,
		calendarLabel = "Event",
		disabled = false,
		readonly = false,
		minValue = undefined,
		maxValue = undefined,
		preventDeselect = false,
		disableDaysOutsideMonth = true,
		minDays,
		maxDays,
		onStartValueChange = (() => {}),
		onEndValueChange = (() => {}),
		excludeDisabled = false,
		monthFormat = "long",
		yearFormat = "numeric",
		...restProps
	}: RangeCalendarRootProps = $props();

	let startValue = $state<DateValue | undefined>(value?.start);
	let endValue = $state<DateValue | undefined>(value?.end);

	const defaultPlaceholder = getDefaultDate({
		defaultValue: value?.start,
		minValue,
		maxValue,
	});

	function handleDefaultPlaceholder() {
		if (placeholder !== undefined) return;
		placeholder = defaultPlaceholder;
	}

	// SSR
	handleDefaultPlaceholder();

	$effect.pre(() => {
		void (placeholder);
		untrack(() => {
			handleDefaultPlaceholder();
		});
	});

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = { start: undefined, end: undefined };
	}

	// SSR
	handleDefaultValue();

	$effect.pre(() => {
		void (value);
		untrack(() => {
			handleDefaultValue();
		});
	});

	const rootState = RangeCalendarRootState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		value: { get current() { return value!; }, set current(v) { value = v; onValueChange(v); } },
		placeholder: { get current() { return placeholder!; }, set current(v) { placeholder = v; onPlaceholderChange(v); } },
		disabled: { get current() { return disabled; } },
		readonly: { get current() { return readonly; } },
		preventDeselect: { get current() { return preventDeselect; } },
		minValue: { get current() { return minValue; } },
		maxValue: { get current() { return maxValue; } },
		isDateUnavailable: { get current() { return isDateUnavailable; } },
		isDateDisabled: { get current() { return isDateDisabled; } },
		pagedNavigation: { get current() { return pagedNavigation; } },
		weekStartsOn: { get current() { return weekStartsOn; } },
		weekdayFormat: { get current() { return weekdayFormat; } },
		numberOfMonths: { get current() { return numberOfMonths; } },
		locale: resolveLocaleProp(() => locale),
		calendarLabel: { get current() { return calendarLabel; } },
		fixedWeeks: { get current() { return fixedWeeks; } },
		disableDaysOutsideMonth: { get current() { return disableDaysOutsideMonth; } },
		minDays: { get current() { return minDays; } },
		maxDays: { get current() { return maxDays; } },
		excludeDisabled: { get current() { return excludeDisabled; } },
		startValue: { get current() { return startValue; }, set current(v) { startValue = v; onStartValueChange(v); } },
		endValue: { get current() { return endValue; }, set current(v) { endValue = v; onEndValueChange(v); } },
		monthFormat: { get current() { return monthFormat; } },
		yearFormat: { get current() { return yearFormat; } },
		defaultPlaceholder,
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</div>
{/if}
