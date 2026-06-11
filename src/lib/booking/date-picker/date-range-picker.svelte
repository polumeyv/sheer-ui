<script lang="ts">
import CalendarIcon from '@lucide/svelte/icons/calendar';
import type { DateRange } from 'bits-ui';
import { DateFormatter, type DateValue, getLocalTimeZone, parseDate } from '@internationalized/date';
import { cn } from '../../utils.js';
import { buttonVariants } from '../../components/button/index.js';
import { RangeCalendar } from '../range-calendar/index.js';
import * as Popover from '../../components/popover/index.js';

type DateRangeString = {
	start?: string;
	end?: string;
};

interface Props {
	/** Controlled value; wins over `valueAsString` while set. Picks are reported via `onValueChange`. */
	value?: DateRange;
	valueAsString?: DateRangeString;
	placeholder?: string;
	dateFormat?: Intl.DateTimeFormatOptions['dateStyle'];
	locale?: string;
	disabled?: boolean;
	class?: string;
	triggerClass?: string;
	contentClass?: string;
	align?: 'start' | 'center' | 'end';
	side?: 'top' | 'right' | 'bottom' | 'left';
	onValueChange?: (value: DateRange | undefined) => void;
	onValueStringChange?: (value: DateRangeString) => void;
	// Calendar props
	numberOfMonths?: number;
	minValue?: DateValue;
	maxValue?: DateValue;
	weekdayFormat?: 'short' | 'long' | 'narrow';
	calendarLabel?: string;
	fixedWeeks?: boolean;
	isDateDisabled?: (date: DateValue) => boolean;
	isDateUnavailable?: (date: DateValue) => boolean;
}

let {
	value,
	valueAsString = $bindable(),
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
	onValueStringChange,
	minValue,
	maxValue,
	weekdayFormat,
	calendarLabel,
	fixedWeeks,
	isDateDisabled,
	isDateUnavailable,
}: Props = $props();

let startValue: DateValue | undefined = $state(undefined);

const parseRangeSafe = (s: DateRangeString | undefined): DateRange | undefined => {
	if (!s?.start) return undefined;
	try {
		return { start: parseDate(s.start), end: s.end ? parseDate(s.end) : undefined };
	} catch {
		return undefined;
	}
};

// Props are the source of truth; a pick overrides the derived until either prop changes
// externally, so a parent resetting `valueAsString` actually clears the picker.
let range = $derived(value ?? parseRangeSafe(valueAsString));

function pick(next: DateRange | undefined) {
	range = next;
	const start = next?.start?.toString();
	const end = next?.end?.toString();
	if (start !== valueAsString?.start || end !== valueAsString?.end) {
		// spread: keep extra keys a consumer carries on the bound object (e.g. a label field)
		valueAsString = { ...valueAsString, start, end };
		onValueStringChange?.(valueAsString);
	}
	onValueChange?.(next);
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

<div class={cn("grid gap-2", className)}>
  <Popover.Root>
    <Popover.Trigger
      {disabled}
      class={cn(
        buttonVariants({ variant: "outline" }),
        "justify-start text-start font-normal",
        !range && "text-muted-foreground",
        triggerClass
      )}
    >
      <CalendarIcon class="me-2 size-4" />
      {displayValue}
    </Popover.Trigger>
    <Popover.Content class={cn("w-auto p-0", contentClass)} {align} {side}>
      <RangeCalendar
        value={range}
        onValueChange={pick}
        onStartValueChange={(v) => {
          startValue = v;
        }}
        {numberOfMonths}
        {minValue}
        {maxValue}
        {weekdayFormat}
        {calendarLabel}
        {fixedWeeks}
        {isDateDisabled}
        {isDateUnavailable}
      />
    </Popover.Content>
  </Popover.Root>
</div>
