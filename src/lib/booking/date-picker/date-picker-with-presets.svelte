<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { DateFormatter, type DateValue, getLocalTimeZone, today, parseDate } from '@internationalized/date';
	import { cn } from '../../utils.js';
	import { buttonVariants } from '../../components/button/index.js';
	import { Calendar } from '../calendar/index.js';
	import * as Popover from '../../components/popover/index.js';
	import * as Select from '../../components/select/index.js';

	type PresetItem = {
		value: number;
		label: string;
	};

	interface Props {
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
		presets?: PresetItem[];
		presetsPlaceholder?: string;
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

	const defaultPresets: PresetItem[] = [
		{ value: 0, label: 'Today' },
		{ value: 1, label: 'Tomorrow' },
		{ value: 3, label: 'In 3 days' },
		{ value: 7, label: 'In a week' },
	];

	let {
		value = $bindable(),
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
		presets = defaultPresets,
		presetsPlaceholder = 'Select preset',
		onValueChange,
		onValueStringChange,
		captionLayout,
		minValue,
		maxValue,
		weekdayFormat,
		calendarLabel,
		fixedWeeks,
		isDateDisabled,
		isDateUnavailable,
	}: Props = $props();

	// Sync valueAsString -> value (on mount or external change)
	$effect(() => {
		if (valueAsString && !value) {
			try {
				value = parseDate(valueAsString);
			} catch {
				// Invalid date string, ignore
			}
		}
	});

	// Sync value -> valueAsString
	$effect(() => {
		if (value) {
			const str = value.toString();
			if (str !== valueAsString) {
				valueAsString = str;
				onValueStringChange?.(str);
			}
		} else if (valueAsString && !value) {
			valueAsString = '';
			onValueStringChange?.('');
		}
	});

	const df = $derived(
		new DateFormatter(locale, {
			dateStyle: dateFormat,
		}),
	);

	const displayValue = $derived(value ? df.format(value.toDate(getLocalTimeZone())) : placeholder);

	const selectValue = $derived(value ? displayValue : '');

	function handleValueChange(newValue: DateValue | undefined) {
		value = newValue;
		onValueChange?.(newValue);
	}
</script>

<div class={cn('grid gap-2', className)}>
	<Popover.Root>
		<Popover.Trigger
			{disabled}
			class={cn(
				buttonVariants({
					variant: 'outline',
					class: 'w-70 justify-start text-start font-normal',
				}),
				!value && 'text-muted-foreground',
				triggerClass,
			)}>
			<CalendarIcon class="me-2 size-4" />
			{displayValue}
		</Popover.Trigger>
		<Popover.Content class={cn('flex w-auto flex-col space-y-2 p-2', contentClass)} {align} {side}>
			<Select.Root
				type="single"
				value={selectValue}
				onValueChange={(v) => {
					if (!v) return;
					value = today(getLocalTimeZone()).add({ days: Number.parseInt(v) });
				}}>
				<Select.Trigger>
					{selectValue || presetsPlaceholder}
				</Select.Trigger>
				<Select.Content>
					{#each presets as preset (preset.value)}
						<Select.Item value={`${preset.value}`}>{preset.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<div class="rounded-md border">
				<Calendar
					type="single"
					bind:value
					onValueChange={handleValueChange}
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
