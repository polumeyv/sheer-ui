<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import type { DateValue } from '@internationalized/date';
	import { formatDateDisplay } from '@polumeyv/utilities/date/formatters';
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { buttonVariants } from '../../components/button';
	import Calendar from '../calendar.svelte';
	import { Popover } from '../../components/popover';

	interface Props {
		/** Selected date as an `@internationalized/date` `DateValue` — every date prop and callback speaks the same type. */
		value?: DateValue;
		placeholder?: string;
		dateFormat?: Intl.DateTimeFormatOptions['dateStyle'];
		locale?: string;
		disabled?: boolean;
		class?: ClassValue;
		triggerClass?: ClassValue;
		contentClass?: ClassValue;
		align?: 'start' | 'center' | 'end';
		side?: 'top' | 'right' | 'bottom' | 'left';
		onValueChange?: (value: DateValue | undefined) => void;
		// Calendar props
		captionLayout?: 'dropdown' | 'dropdown-months' | 'dropdown-years' | 'label';
		minValue?: DateValue;
		maxValue?: DateValue;
		weekdayFormat?: 'short' | 'long' | 'narrow';
		calendarLabel?: string;
		fixedWeeks?: boolean;
		isDateDisabled?: (date: DateValue) => boolean;
		isDateUnavailable?: (date: DateValue) => boolean;
		/** Internal composition seam used by the presets adapter. */
		contentHeader?: Snippet;
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
		contentHeader,
	}: Props = $props();

	const displayValue = $derived(value ? formatDateDisplay(value.toString(), { dateStyle: dateFormat }, locale) : placeholder);

	function pick(next: DateValue | undefined) {
		value = next;
		onValueChange?.(next);
	}
</script>

<div class={join('grid gap-2', className)}>
	<Popover.Root>
		<Popover.Trigger
			{disabled}
			class={buttonVariants({
				variant: 'outline',
				class: ['w-70 justify-start! text-start font-normal!', !value && 'text-muted-foreground', triggerClass],
			})}>
			<CalendarIcon class={contentHeader ? 'me-2 size-4' : 'size-4'} />
			{displayValue}
		</Popover.Trigger>
		<Popover.Content
			class={join(contentHeader ? 'flex w-auto! flex-col space-y-2 p-2!' : 'w-auto! p-0!', contentClass)}
			{align}
			{side}>
			{@render contentHeader?.()}
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
