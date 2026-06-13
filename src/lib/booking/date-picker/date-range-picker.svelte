<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import type { DateRange } from '$lib/bits-ui.js';
	import { DateFormatter, type DateValue, getLocalTimeZone, parseDate } from '@internationalized/date';
	import { DateString } from '@polumeyv/lib/schemas';
	import { cn } from '../../utils.js';
	import { buttonVariants } from '../../components/button/index.js';
	import { RangeCalendar } from '../range-calendar/index.js';
	import * as Popover from '../../components/popover/index.js';

	type DateRangeString = {
		start?: DateString;
		end?: DateString;
	};

	interface Props {
		/** Selected range as branded `DateString`s — every date prop and callback speaks the same type. */
		value?: DateRangeString;
		placeholder?: string;
		dateFormat?: Intl.DateTimeFormatOptions['dateStyle'];
		locale?: string;
		disabled?: boolean;
		class?: string;
		triggerClass?: string;
		contentClass?: string;
		align?: 'start' | 'center' | 'end';
		side?: 'top' | 'right' | 'bottom' | 'left';
		onValueChange?: (value: DateRangeString) => void;
		// Calendar props
		numberOfMonths?: number;
		minValue?: DateString;
		maxValue?: DateString;
		weekdayFormat?: 'short' | 'long' | 'narrow';
		calendarLabel?: string;
		fixedWeeks?: boolean;
		isDateDisabled?: (date: DateString) => boolean;
		isDateUnavailable?: (date: DateString) => boolean;
	}

	let {
		value = $bindable(),
		placeholder = 'Pick a date range',
		dateFormat = 'medium',
		locale = 'en-US',
		disabled = false,
		class: className,
		triggerClass,
		contentClass,
		align = 'start',
		side = 'bottom',
		numberOfMonths = 2,
		onValueChange,
		minValue,
		maxValue,
		weekdayFormat,
		calendarLabel,
		fixedWeeks,
		isDateDisabled,
		isDateUnavailable,
	}: Props = $props();

	let startValue: DateValue | undefined = $state(undefined);

	// The @internationalized/date boundary: RangeCalendar (bits-ui) below this point speaks DateValue,
	// the public props above speak ISO strings.
	const parseDateSafe = (s: string | undefined) => {
		if (!s) return undefined;
		try {
			return parseDate(s);
		} catch {
			return undefined;
		}
	};

	const parseRangeSafe = (s: DateRangeString | undefined): DateRange | undefined => {
		const start = parseDateSafe(s?.start);
		return start ? { start, end: parseDateSafe(s?.end) } : undefined;
	};

	const range = $derived(parseRangeSafe(value));

	const brand = (v: DateValue | undefined): DateString | undefined => (v ? DateString.make(v.toString()) : undefined);

	function pick(next: DateRange | undefined) {
		const start = brand(next?.start);
		const end = brand(next?.end);
		if (start !== value?.start || end !== value?.end) {
			// spread: keep extra keys a consumer carries on the bound object (e.g. a label field)
			value = { ...value, start, end };
			onValueChange?.(value);
		}
	}

	const df = $derived(
		new DateFormatter(locale, {
			dateStyle: dateFormat,
		}),
	);

	const displayValue = $derived.by(() => {
		if (range?.start) {
			if (range.end) {
				return `${df.format(range.start.toDate(getLocalTimeZone()))} - ${df.format(range.end.toDate(getLocalTimeZone()))}`;
			}
			return df.format(range.start.toDate(getLocalTimeZone()));
		}
		if (startValue) {
			return df.format(startValue.toDate(getLocalTimeZone()));
		}
		return placeholder;
	});
</script>

<div class={cn('grid gap-2', className)}>
	<Popover.Root>
		<Popover.Trigger
			{disabled}
			class={cn(buttonVariants({ variant: 'outline' }), 'justify-start text-start font-normal', !range && 'text-muted-foreground', triggerClass)}>
			<CalendarIcon class="me-2 size-4" />
			{displayValue}
		</Popover.Trigger>
		<Popover.Content class={cn('w-auto! p-0!', contentClass)} {align} {side}>
			<RangeCalendar
				value={range}
				onValueChange={pick}
				onStartValueChange={(v) => {
					startValue = v;
				}}
				{numberOfMonths}
				minValue={parseDateSafe(minValue)}
				maxValue={parseDateSafe(maxValue)}
				{weekdayFormat}
				{calendarLabel}
				{fixedWeeks}
				isDateDisabled={isDateDisabled && ((d: DateValue) => isDateDisabled(DateString.make(d.toString())))}
				isDateUnavailable={isDateUnavailable && ((d: DateValue) => isDateUnavailable(DateString.make(d.toString())))} />
		</Popover.Content>
	</Popover.Root>
</div>
