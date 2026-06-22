<script lang="ts">
	import { untrack } from 'svelte';
	import { watch } from '$lib/internal/toolbelt.js';
	import { boxWith, mergeProps } from '$lib/internal/toolbelt.js';
	import { type DateValue } from '@internationalized/date';
	import { CalendarRootState } from '../calendar.svelte.js';
	import type { CalendarRootProps } from '../types.js';
	import { useId } from '$lib/internal/use-id.js';
	import { getDefaultDate } from '$lib/internal/date-time/utils.js';
	import { resolveLocaleProp } from '../../utilities/config/prop-resolvers.js';

	let {
		child,
		children,
		id = useId(),
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
		type,
		disableDaysOutsideMonth = true,
		initialFocus = false,
		maxDays,
		monthFormat = 'long',
		yearFormat = 'numeric',
		...restProps
	}: CalendarRootProps = $props();

	const defaultPlaceholder = untrack(() => getDefaultDate({
		defaultValue: value,
		minValue,
		maxValue,
	}));

	function repairUndefinedControlledPlaceholder() {
		if (placeholder !== undefined) return;
		placeholder = defaultPlaceholder;
	}

	// SSR/initial setup: Calendar needs a writable placeholder for view navigation.
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
		value = type === 'single' ? undefined : [];
	}

	// SSR/initial setup: multiple mode owns an empty selection array, not undefined.
	repairUndefinedControlledValue();

	watch.pre(
		() => value,
		() => {
			/**
			 * Parent spread-prop resets can make value undefined again. Multiple mode
			 * repairs that to an empty selection array; single mode remains undefined.
			 */
			repairUndefinedControlledValue();
		},
	);

	const rootState = CalendarRootState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		weekdayFormat: boxWith(() => weekdayFormat),
		weekStartsOn: boxWith(() => weekStartsOn),
		pagedNavigation: boxWith(() => pagedNavigation),
		isDateDisabled: boxWith(() => isDateDisabled),
		isDateUnavailable: boxWith(() => isDateUnavailable),
		fixedWeeks: boxWith(() => fixedWeeks),
		numberOfMonths: boxWith(() => numberOfMonths),
		locale: resolveLocaleProp(() => locale),
		calendarLabel: boxWith(() => calendarLabel),
		readonly: boxWith(() => readonly),
		disabled: boxWith(() => disabled),
		minValue: boxWith(() => minValue),
		maxValue: boxWith(() => maxValue),
		disableDaysOutsideMonth: boxWith(() => disableDaysOutsideMonth),
		initialFocus: boxWith(() => initialFocus),
		maxDays: boxWith(() => maxDays),
		placeholder: boxWith(
			() => placeholder as DateValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v as DateValue);
			},
		),
		preventDeselect: boxWith(() => preventDeselect),
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				// oxlint-disable-next-line no-explicit-any
				onValueChange(v as any);
			},
		),
		type: boxWith(() => type),
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
