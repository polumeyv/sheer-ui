<script lang="ts">
import CalendarIcon from '@lucide/svelte/icons/calendar';
import { DateFormatter, type DateValue, getLocalTimeZone, parseDate } from '@internationalized/date';
import { cn } from '../../utils.js';
import { buttonVariants } from '../../components/button/index.js';
import { Calendar } from '../calendar/index.js';
import * as Popover from '../../components/popover/index.js';

interface Props {
	/** Controlled value; wins over `valueAsString` while set. Picks are reported via `onValueChange`. */
	value?: DateValue;
	valueAsString?: string;
	placeholder?: string;
	dateFormat?: Intl.DateTimeFormatOptions['dateStyle'];
	locale?: string;
	disabled?: boolean;
	class?: string;
	triggerClass?: string;
	contentClass?: string;
	align?: 'start' | 'center' | 'end';
	side?: 'top' | 'right' | 'bottom' | 'left';
	onValueChange?: (value: DateValue | undefined) => void;
	onValueStringChange?: (value: string) => void;
	// Calendar props
	captionLayout?: 'dropdown' | 'dropdown-months' | 'dropdown-years' | 'label';
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
	placeholder = 'Pick a date',
	dateFormat = 'long',
	locale = 'en-US',
	disabled = false,
	class: className,
	triggerClass,
	contentClass,
	align = 'start',
	side = 'bottom',
	captionLayout = 'dropdown',
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

const parseDateSafe = (s: string | undefined) => {
	if (!s) return undefined;
	try {
		return parseDate(s);
	} catch {
		return undefined;
	}
};

// Props are the source of truth; a pick overrides the derived until either prop changes
// externally, so a parent resetting `valueAsString` actually clears the picker.
let date = $derived(value ?? parseDateSafe(valueAsString));

function pick(next: DateValue | undefined) {
	date = next;
	const str = next?.toString() ?? '';
	if (str !== (valueAsString ?? '')) {
		valueAsString = str;
		onValueStringChange?.(str);
	}
	onValueChange?.(next);
}

const df = $derived(
	new DateFormatter(locale, {
		dateStyle: dateFormat,
	}),
);

const displayValue = $derived(date ? df.format(date.toDate(getLocalTimeZone())) : placeholder);
</script>

<div class={cn("grid gap-2", className)}>
  <Popover.Root>
    <Popover.Trigger
      {disabled}
      class={cn(
        buttonVariants({
          variant: "outline",
          class: "w-70 justify-start! text-start font-normal!"
        }),
        !date && "text-muted-foreground",
        triggerClass
      )}
    >
      <CalendarIcon class="size-4" />
      {displayValue}
    </Popover.Trigger>
    <Popover.Content class={cn("w-auto! p-0!", contentClass)} {align} {side}>
      <Calendar
        type="single"
        value={date}
        onValueChange={pick}
        {captionLayout}
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
