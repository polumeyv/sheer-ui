<script lang="ts">
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { today, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { formatDateDisplay } from '@polumeyv/utilities/date';
	import { buttonVariants } from '../../components/button';
	import Calendar from '../calendar.svelte';
	import { Popover } from '../../components/popover';
	import * as NativeSelect from '../../components/native-select';

	type PresetItem = {
		value: number;
		label: string;
	};

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
		presets?: PresetItem[];
		presetsPlaceholder?: string;
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
	}

	const defaultPresets: PresetItem[] = [
		{ value: 0, label: 'Today' },
		{ value: 1, label: 'Tomorrow' },
		{ value: 3, label: 'In 3 days' },
		{ value: 7, label: 'In a week' },
	];

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
		presets = defaultPresets,
		presetsPlaceholder = 'Select preset',
		onValueChange,
		captionLayout,
		minValue,
		maxValue,
		weekdayFormat,
		calendarLabel,
		fixedWeeks,
		isDateDisabled,
		isDateUnavailable,
	}: Props = $props();

	const displayValue = $derived(value ? formatDateDisplay(value.toString(), { dateStyle: dateFormat }, locale) : placeholder);

	// The preset dropdown is a write-only action menu: each pick maps a relative-day offset to a date, then resets
	// so the placeholder shows again (and the same preset can be re-picked). The chosen date is surfaced on the
	// outer popover trigger.
	let presetSelection = $state('');

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
			<CalendarIcon class="me-2 size-4" />
			{displayValue}
		</Popover.Trigger>
		<Popover.Content class={join('flex w-auto! flex-col space-y-2 p-2!', contentClass)} {align} {side}>
			<NativeSelect.Root
				class="w-full"
				placeholder={presetsPlaceholder}
				bind:value={presetSelection}
				onchange={(e) => {
					const v = e.currentTarget.value;
					presetSelection = '';
					if (!v) return;
					pick(today(getLocalTimeZone()).add({ days: Number.parseInt(v) }));
				}}>
				{#each presets as preset (preset.value)}
					<NativeSelect.Option value={`${preset.value}`}>{preset.label}</NativeSelect.Option>
				{/each}
			</NativeSelect.Root>
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
