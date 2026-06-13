<script lang="ts">import { untrack } from "svelte";
		import { mergeProps } from "$lib/vendor/index.js";
	import type { DateValue } from "@internationalized/date";
	import { DateRangePickerRootState } from "$lib/components/date-range-picker/date-range-picker.svelte.js";
	import type { DateRangePickerRootProps } from "$lib/components/date-range-picker/index.js";
	import { PopoverRootState } from "$lib/components/popover/primitive/popover.svelte.js";
	import { DateRangeFieldRootState } from "$lib/components/date-range-field/date-range-field.svelte.js";
	import FloatingLayer from "$lib/components/_shared/utilities/floating-layer/components/floating-layer.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import type { DateRange } from "$lib/shared/index.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/components/_shared/utilities/config/prop-resolvers.js";

	let {
		open = $bindable(false),
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		value = $bindable(),
		id = useId(),
		ref = $bindable(null),
		onValueChange = (() => {}),
		placeholder = $bindable(),
		onPlaceholderChange = (() => {}),
		isDateUnavailable = () => false,
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
		closeOnRangeSelect = true,
		onStartValueChange = (() => {}),
		onEndValueChange = (() => {}),
		validate = (() => {}),
		errorMessageId,
		minDays,
		maxDays,
		excludeDisabled = false,
		child,
		children,
		monthFormat = "long",
		yearFormat = "numeric",
		...restProps
	}: DateRangePickerRootProps = $props();

	let startValue = $state<DateValue | undefined>(value?.start);
	let endValue = $state<DateValue | undefined>(value?.end);

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = { start: undefined, end: undefined };
	}

	// SSR
	handleDefaultValue();

	/**
	 * Covers an edge case where when a spread props object is reassigned,
	 * the props are reset to their default values, which would make value
	 * undefined which causes errors to be thrown.
	 */
	$effect.pre(() => {
		void (value);
		untrack(() => {
			handleDefaultValue();
		});
	});

	const defaultPlaceholder = getDefaultDate({
		granularity,
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

	function onRangeSelect() {
		if (closeOnRangeSelect) {
			open = false;
		}
	}

	const pickerRootState = DateRangePickerRootState.create({
		open: { get current() { return open; }, set current(v) { open = v; onOpenChange(v); } },
		value: { get current() { return value as DateRange; }, set current(v) { value = v; onValueChange(v); } },
		placeholder: { get current() { return placeholder as DateValue; }, set current(v) { placeholder = v; onPlaceholderChange(v as DateValue); } },
		isDateUnavailable: { get current() { return isDateUnavailable; } },
		minValue: { get current() { return minValue; } },
		maxValue: { get current() { return maxValue; } },
		minDays: { get current() { return minDays; } },
		maxDays: { get current() { return maxDays; } },
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
		excludeDisabled: { get current() { return excludeDisabled; } },
		onRangeSelect: { get current() { return onRangeSelect; } },
		startValue: { get current() { return startValue; }, set current(v) { startValue = v; onStartValueChange(v); } },
		endValue: { get current() { return endValue; }, set current(v) { endValue = v; onEndValueChange(v); } },
		monthFormat: { get current() { return monthFormat; } },
		yearFormat: { get current() { return yearFormat; } },
		defaultPlaceholder,
	});

	PopoverRootState.create({
		open: pickerRootState.opts.open,
		onOpenChangeComplete: { get current() { return onOpenChangeComplete; } },
	});

	const fieldRootState = DateRangeFieldRootState.create({
		value: pickerRootState.opts.value,
		disabled: pickerRootState.opts.disabled,
		readonly: pickerRootState.opts.readonly,
		readonlySegments: pickerRootState.opts.readonlySegments,
		validate: { get current() { return validate; } },
		minValue: pickerRootState.opts.minValue,
		maxValue: pickerRootState.opts.maxValue,
		granularity: pickerRootState.opts.granularity,
		hideTimeZone: pickerRootState.opts.hideTimeZone,
		hourCycle: pickerRootState.opts.hourCycle,
		locale: pickerRootState.opts.locale,
		required: pickerRootState.opts.required,
		placeholder: pickerRootState.opts.placeholder,
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		startValue: pickerRootState.opts.startValue,
		endValue: pickerRootState.opts.endValue,
		onInvalid: { get current() { return onInvalid; } },
		errorMessageId: { get current() { return errorMessageId; } },
	});

	const mergedProps = $derived(mergeProps(restProps, fieldRootState.props));
</script>

<FloatingLayer>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</FloatingLayer>
