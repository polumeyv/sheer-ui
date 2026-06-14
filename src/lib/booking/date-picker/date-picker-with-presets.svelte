<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { addDays, todayIn, localTimeZone } from '@polumeyv/lib/public';
	import type { DateString } from '@polumeyv/lib/schemas';
	import { cn } from '../../vendor/utils';
	import { buttonVariants } from '../../components/button/index';
	import { Calendar } from '../calendar/index';
	import * as Popover from '../../components/popover/index';
	import * as Select from '../../components/select/index';

	type PresetItem = {
		value: number;
		label: string;
	};

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
		presets?: PresetItem[];
		presetsPlaceholder?: string;
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

	// UTC-pinned both sides (instant and formatter), so the rendered date always matches the input string.
	const displayValue = $derived(
		value ? new Intl.DateTimeFormat(locale, { dateStyle: dateFormat, timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`)) : placeholder,
	);

	// The preset dropdown is a write-only action menu: each pick maps a relative-day
	// offset to a date, then resets so the placeholder shows again (and the same preset
	// can be re-picked). The chosen date itself is surfaced on the outer popover trigger.
	let presetSelection = $state('');

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
			<CalendarIcon class="me-2 size-4" />
			{displayValue}
		</Popover.Trigger>
		<Popover.Content class={cn('flex w-auto! flex-col space-y-2 p-2!', contentClass)} {align} {side}>
			<Select.Root
				class="w-full"
				placeholder={presetsPlaceholder}
				bind:value={presetSelection}
				onchange={(e) => {
					const v = e.currentTarget.value;
					presetSelection = '';
					if (!v) return;
					pick(addDays(todayIn(localTimeZone()), Number.parseInt(v)));
				}}>
				{#each presets as preset (preset.value)}
					<Select.Option value={`${preset.value}`}>{preset.label}</Select.Option>
				{/each}
			</Select.Root>
			<div class="rounded-md border">
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
			</div>
		</Popover.Content>
	</Popover.Root>
</div>
