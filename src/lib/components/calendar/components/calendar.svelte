<script lang="ts">
	import { watch } from "$lib/vendor/watch.svelte.js";
	import { mergeProps } from "$lib/vendor/index.js";
	import { type DateValue } from "@internationalized/date";
	import { CalendarRootState } from "$lib/components/calendar/calendar.svelte.js";
	import type { CalendarRootProps } from "$lib/components/calendar/index.js";
	import { useId } from "$lib/internal/use-id.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/components/_shared/utilities/config/prop-resolvers.js";

	let {
		child,
		children,
		id = useId(),
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
		type,
		disableDaysOutsideMonth = true,
		initialFocus = false,
		maxDays,
		monthFormat = "long",
		yearFormat = "numeric",
		...restProps
	}: CalendarRootProps = $props();

	const defaultPlaceholder = getDefaultDate({
		defaultValue: value,
		minValue,
		maxValue,
	});

	function handleDefaultPlaceholder() {
		if (placeholder !== undefined) return;
		placeholder = defaultPlaceholder;
	}

	// SSR
	handleDefaultPlaceholder();

	watch.pre(
		() => placeholder,
		() => {
			handleDefaultPlaceholder();
		}
	);

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = type === "single" ? undefined : [];
	}

	// SSR
	handleDefaultValue();

	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	const rootState = CalendarRootState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		weekdayFormat: { get current() { return weekdayFormat; } },
		weekStartsOn: { get current() { return weekStartsOn; } },
		pagedNavigation: { get current() { return pagedNavigation; } },
		isDateDisabled: { get current() { return isDateDisabled; } },
		isDateUnavailable: { get current() { return isDateUnavailable; } },
		fixedWeeks: { get current() { return fixedWeeks; } },
		numberOfMonths: { get current() { return numberOfMonths; } },
		locale: resolveLocaleProp(() => locale),
		calendarLabel: { get current() { return calendarLabel; } },
		readonly: { get current() { return readonly; } },
		disabled: { get current() { return disabled; } },
		minValue: { get current() { return minValue; } },
		maxValue: { get current() { return maxValue; } },
		disableDaysOutsideMonth: { get current() { return disableDaysOutsideMonth; } },
		initialFocus: { get current() { return initialFocus; } },
		maxDays: { get current() { return maxDays; } },
		placeholder: { get current() { return placeholder as DateValue; }, set current(v) { placeholder = v; onPlaceholderChange(v as DateValue); } },
		preventDeselect: { get current() { return preventDeselect; } },
		value: { get current() { return value; }, set current(v) {
        				value = v;
        				// oxlint-disable-next-line no-explicit-any
        				onValueChange(v as any);
        			} },
		type: { get current() { return type; } },
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
