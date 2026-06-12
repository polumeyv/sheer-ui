<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import type { DateString } from '@polumeyv/lib/schemas';
	import { cn } from '../../utils.js';
	import { buttonVariants } from '../../components/button/index.js';
	import { Calendar } from '../calendar/index.js';
	import * as Popover from '../../components/popover/index.js';

	interface Props {
		/** Selected date as a branded `DateString` — every date prop and callback speaks the same type. */
		value?: DateString;
		placeholder?: string;
		dateFormat?: Intl.DateTimeFormatOptions['dateStyle'];
		locale?: string;
		disabled?: boolean;
		class?: string;
		triggerClass?: string;
		contentClass?: string;
		align?: 'start' | 'center' | 'end';
		side?: 'top' | 'right' | 'bottom' | 'left';
		onValueChange?: (value: DateString | undefined) => void;
		// Calendar props
		captionLayout?: 'dropdown' | 'dropdown-months' | 'dropdown-years' | 'label';
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
		minValue,
		maxValue,
		weekdayFormat,
		calendarLabel,
		fixedWeeks,
		isDateDisabled,
		isDateUnavailable,
	}: Props = $props();

	// UTC-pinned both sides (instant and formatter), so the rendered date always matches the input string.
	const displayValue = $derived(
		value ? new Intl.DateTimeFormat(locale, { dateStyle: dateFormat, timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`)) : placeholder,
	);

	function pick(next: DateString | undefined) {
		value = next;
		onValueChange?.(next);
	}
</script>

<div class={cn('grid gap-2', className)}>
	<Popover.Root>
		<Popover.Trigger
			{disabled}
			class={cn(
				buttonVariants({
					variant: 'outline',
					class: 'w-70 justify-start! text-start font-normal!',
				}),
				!value && 'text-muted-foreground',
				triggerClass,
			)}>
			<CalendarIcon class="size-4" />
			{displayValue}
		</Popover.Trigger>
		<Popover.Content class={cn('w-auto! p-0!', contentClass)} {align} {side}>
			<Calendar
				type="single"
				{value}
				onValueChange={pick}
				{captionLayout}
				{minValue}
				{maxValue}
				{weekdayFormat}
				{calendarLabel}
				{fixedWeeks}
				{isDateDisabled}
				{isDateUnavailable} />
		</Popover.Content>
	</Popover.Root>
</div>
