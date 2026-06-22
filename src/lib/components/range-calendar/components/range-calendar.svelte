<script lang="ts">
	import { untrack } from 'svelte';
	import { watch } from '$lib/internal/toolbelt.js';
	import { boxWith, mergeProps } from '$lib/internal/toolbelt.js';
	import { type DateValue } from '@internationalized/date';
	import type { RangeCalendarRootProps } from '../types.js';
	import { RangeCalendarRootState } from '../range-calendar.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { getDefaultDate } from '$lib/internal/date-time/utils.js';
	import { resolveLocaleProp } from '../../utilities/config/prop-resolvers.js';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = () => {},
		placeholder = $bindable(),
		onPlaceholderChange = () => {},
		weekdayFormat = 'narrow',
		weekStartsOn,
		pagedNavigation = false,
		isDateDisabled = () => false,
		isDateUnavailable = () => false,
		fixedWeeks = false,
		numberOfMonths = 1,
		locale,
		calendarLabel = 'Event',
		disabled = false,
		readonly = false,
		minValue = undefined,
		maxValue = undefined,
		preventDeselect = false,
		disableDaysOutsideMonth = true,
		minDays,
		maxDays,
		onStartValueChange = () => {},
		onEndValueChange = () => {},
		excludeDisabled = false,
		monthFormat = 'long',
		yearFormat = 'numeric',
		...restProps
	}: RangeCalendarRootProps = $props();

	let startValue = $state<DateValue | undefined>(value?.start);
	let endValue = $state<DateValue | undefined>(value?.end);

	const defaultPlaceholder = untrack(() => getDefaultDate({
		defaultValue: value?.start,
		minValue,
		maxValue,
	}));

	function repairUndefinedControlledPlaceholder() {
		if (placeholder !== undefined) return;
		placeholder = defaultPlaceholder;
	}

	// SSR/initial setup: RangeCalendar needs a writable placeholder for view navigation.
	repairUndefinedControlledPlaceholder();

	watch.pre(
		() => placeholder,
		() => {
			/**
			 * Parent spread-prop resets can make the bindable placeholder undefined again.
			 * Repairing it is intentional: this is writable view/navigation state, and
			 * parents using bind:placeholder should observe the repaired value.
			 */
			repairUndefinedControlledPlaceholder();
		},
	);

	function repairUndefinedControlledValue() {
		if (value !== undefined) return;
		value = { start: undefined, end: undefined };
	}

	// SSR/initial setup: range state owns a DateRange object, even when empty.
	repairUndefinedControlledValue();

	watch.pre(
		() => value,
		() => {
			/**
			 * Parent spread-prop resets can make value undefined again. Repairing it
			 * preserves the controlled range object used by the selection state machine.
			 */
			repairUndefinedControlledValue();
		},
	);

	const rootState = RangeCalendarRootState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		value: boxWith(
			() => value!,
			(v) => {
				value = v;
				onValueChange(v);
			},
		),
		placeholder: boxWith(
			() => placeholder!,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v);
			},
		),
		disabled: boxWith(() => disabled),
		readonly: boxWith(() => readonly),
		preventDeselect: boxWith(() => preventDeselect),
		minValue: boxWith(() => minValue),
		maxValue: boxWith(() => maxValue),
		isDateUnavailable: boxWith(() => isDateUnavailable),
		isDateDisabled: boxWith(() => isDateDisabled),
		pagedNavigation: boxWith(() => pagedNavigation),
		weekStartsOn: boxWith(() => weekStartsOn),
		weekdayFormat: boxWith(() => weekdayFormat),
		numberOfMonths: boxWith(() => numberOfMonths),
		locale: resolveLocaleProp(() => locale),
		calendarLabel: boxWith(() => calendarLabel),
		fixedWeeks: boxWith(() => fixedWeeks),
		disableDaysOutsideMonth: boxWith(() => disableDaysOutsideMonth),
		minDays: boxWith(() => minDays),
		maxDays: boxWith(() => maxDays),
		excludeDisabled: boxWith(() => excludeDisabled),
		startValue: boxWith(
			() => startValue,
			(v) => {
				startValue = v;
				onStartValueChange(v);
			},
		),
		endValue: boxWith(
			() => endValue,
			(v) => {
				endValue = v;
				onEndValueChange(v);
			},
		),
		monthFormat: boxWith(() => monthFormat),
		yearFormat: boxWith(() => yearFormat),
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
