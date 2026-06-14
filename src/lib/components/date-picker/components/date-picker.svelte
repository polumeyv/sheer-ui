<script lang="ts">import { untrack } from "svelte";

	// Date Picker composes the DateField, Popover, and Calendar components
	import type { DateValue } from "@internationalized/date";
	import { DatePickerRootState } from "$lib/components/date-picker/date-picker.svelte";
	import type { DatePickerRootProps } from "$lib/components/date-picker/index";
	import { PopoverRootState } from "$lib/components/popover/primitive/popover.svelte";
	import { DateFieldRootState } from "$lib/components/date-field/date-field.svelte";
	import { FloatingLayer } from "$lib/components/_shared/utilities/floating-layer/index";
	import { getDefaultDate } from "$lib/vendor/date-time/utils";
	import { resolveLocaleProp } from "$lib/components/_shared/utilities/config/prop-resolvers";

	let {
		open = $bindable(false),
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		value = $bindable(),
		onValueChange = (() => {}),
		placeholder = $bindable(),
		onPlaceholderChange = (() => {}),
		isDateUnavailable = () => false,
		validate = (() => {}),
		onInvalid = (() => {}),
		minValue,
		maxValue,
		disabled = false,
		readonly = false,
		granularity,
		readonlySegments = [],
		hourCycle,
		locale,
		hideTimeZone = false,
		required = false,
		calendarLabel = "Event",
		disableDaysOutsideMonth = true,
		preventDeselect = false,
		pagedNavigation = false,
		weekStartsOn,
		weekdayFormat = "narrow",
		isDateDisabled = () => false,
		fixedWeeks = false,
		numberOfMonths = 1,
		closeOnDateSelect = true,
		initialFocus = false,
		errorMessageId,
		children,
		monthFormat = "long",
		yearFormat = "numeric",
	}: DatePickerRootProps = $props();

	const defaultPlaceholder = getDefaultDate({
		granularity,
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

	/**
	 * Covers an edge case where when a spread props object is reassigned,
	 * the props are reset to their default values, which would make placeholder
	 * undefined which causes errors to be thrown.
	 */
	$effect.pre(() => {
		void (placeholder);
		untrack(() => {
			handleDefaultPlaceholder();
		});
	});

	function onDateSelect() {
		if (closeOnDateSelect) {
			open = false;
		}
	}

	const pickerRootState = DatePickerRootState.create({
		open: { get current() { return open; }, set current(v) { open = v; onOpenChange(v); } },
		value: { get current() { return value; }, set current(v) { value = v; onValueChange(v); } },
		placeholder: { get current() { return placeholder as DateValue; }, set current(v) { placeholder = v; onPlaceholderChange(v as DateValue); } },
		isDateUnavailable: { get current() { return isDateUnavailable; } },
		minValue: { get current() { return minValue; } },
		maxValue: { get current() { return maxValue; } },
		disabled: { get current() { return disabled; } },
		readonly: { get current() { return readonly; } },
		granularity: { get current() { return granularity; } },
		readonlySegments: { get current() { return readonlySegments; } },
		hourCycle: { get current() { return hourCycle; } },
		locale: resolveLocaleProp(() => locale),
		hideTimeZone: { get current() { return hideTimeZone; } },
		required: { get current() { return required; } },
		calendarLabel: { get current() { return calendarLabel; } },
		disableDaysOutsideMonth: { get current() { return disableDaysOutsideMonth; } },
		preventDeselect: { get current() { return preventDeselect; } },
		pagedNavigation: { get current() { return pagedNavigation; } },
		weekStartsOn: { get current() { return weekStartsOn; } },
		weekdayFormat: { get current() { return weekdayFormat; } },
		isDateDisabled: { get current() { return isDateDisabled; } },
		fixedWeeks: { get current() { return fixedWeeks; } },
		numberOfMonths: { get current() { return numberOfMonths; } },
		initialFocus: { get current() { return initialFocus; } },
		onDateSelect: { get current() { return onDateSelect; } },
		defaultPlaceholder,
		monthFormat: { get current() { return monthFormat; } },
		yearFormat: { get current() { return yearFormat; } },
	});

	PopoverRootState.create({
		open: pickerRootState.opts.open,
		onOpenChangeComplete: { get current() { return onOpenChangeComplete; } },
	});

	DateFieldRootState.create({
		value: pickerRootState.opts.value,
		disabled: pickerRootState.opts.disabled,
		readonly: pickerRootState.opts.readonly,
		readonlySegments: pickerRootState.opts.readonlySegments,
		validate: { get current() { return validate; } },
		onInvalid: { get current() { return onInvalid; } },
		minValue: pickerRootState.opts.minValue,
		maxValue: pickerRootState.opts.maxValue,
		granularity: pickerRootState.opts.granularity,
		hideTimeZone: pickerRootState.opts.hideTimeZone,
		hourCycle: pickerRootState.opts.hourCycle,
		locale: pickerRootState.opts.locale,
		required: pickerRootState.opts.required,
		placeholder: pickerRootState.opts.placeholder,
		errorMessageId: { get current() { return errorMessageId; } },
		isInvalidProp: { get current() { return undefined; } },
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
