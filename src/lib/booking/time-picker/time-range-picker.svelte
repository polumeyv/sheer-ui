<script lang="ts">
	import Clock from '@lucide/svelte/icons/clock';
	import { cn } from '../../utils.js';
	import { buttonVariants } from '../../components/button/index.js';
	import * as Select from '../../components/select/index.js';
	import * as Popover from '../../components/popover/index.js';
	import { formatTimeDisplay } from '@polumeyv/lib/public';
	import { generateTimeSlots, isTimeInRange, compareTime, getTimeDuration, formatDuration, type TimeSlot, type TimeRange, b_HOURS, EXTENDED_HOURS } from './time-slots.js';

	type TimeSlotPreset = 'business' | 'extended' | 'full' | 'custom';

	interface Props {
		value?: TimeRange;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
		triggerClass?: string;
		contentClass?: string;
		align?: 'start' | 'center' | 'end';
		side?: 'top' | 'right' | 'bottom' | 'left';
		onValueChange?: (value: TimeRange | undefined) => void;
		// Time slot configuration
		preset?: TimeSlotPreset;
		slots?: TimeSlot[];
		interval?: number;
		startHour?: number;
		endHour?: number;
		// Constraints
		minTime?: string;
		maxTime?: string;
		minDuration?: number; // Minimum duration in minutes
		maxDuration?: number; // Maximum duration in minutes
		isTimeDisabled?: (time: string) => boolean;
		// Display options
		showDuration?: boolean;
	}

	let {
		value = $bindable(),
		placeholder = 'Select time range',
		disabled = false,
		class: className,
		triggerClass,
		contentClass,
		align = 'start',
		side = 'bottom',
		onValueChange,
		preset = 'extended',
		slots,
		interval = 60,
		startHour = 7,
		endHour = 21,
		minTime,
		maxTime,
		minDuration = 0,
		maxDuration,
		isTimeDisabled,
		showDuration = true,
	}: Props = $props();

	// Generate time slots based on configuration
	const timeSlots = $derived.by(() => {
		if (slots) return slots;

		switch (preset) {
			case 'business':
				return b_HOURS;
			case 'extended':
				return EXTENDED_HOURS;
			case 'full':
				return generateTimeSlots(0, 24, interval);
			case 'custom':
			default:
				return generateTimeSlots(startHour, endHour, interval);
		}
	});

	// Filter start time slots
	const startSlots = $derived.by(() => {
		return timeSlots.filter((slot) => {
			if (minTime && maxTime && !isTimeInRange(slot.value, minTime, maxTime)) return false;
			if (minTime && compareTime(slot.value, minTime) < 0) return false;
			if (maxTime && compareTime(slot.value, maxTime) > 0) return false;
			if (isTimeDisabled?.(slot.value)) return false;
			return true;
		});
	});

	// Filter end time slots based on selected start time
	const endSlots = $derived.by(() => {
		return timeSlots.filter((slot) => {
			// End time must be after start time
			if (value?.start && compareTime(slot.value, value.start) <= 0) return false;

			// Check duration constraints
			if (value?.start) {
				const duration = getTimeDuration(value.start, slot.value);
				if (minDuration && duration < minDuration) return false;
				if (maxDuration && duration > maxDuration) return false;
			}

			if (maxTime && compareTime(slot.value, maxTime) > 0) return false;
			if (isTimeDisabled?.(slot.value)) return false;

			return true;
		});
	});

	const displayValue = $derived.by(() => {
		if (!value?.start) return placeholder;
		if (!value?.end) return formatTimeDisplay(value.start);

		const duration = getTimeDuration(value.start, value.end);
		const durationText = showDuration ? ` (${formatDuration(duration)})` : '';
		return `${formatTimeDisplay(value.start)} - ${formatTimeDisplay(value.end)}${durationText}`;
	});

	function handleStartChange(newStart: string | undefined) {
		if (!newStart) {
			value = undefined;
			onValueChange?.(undefined);
			return;
		}

		// If end time is now invalid, clear it
		const newValue: TimeRange = { start: newStart, end: value?.end || '' };
		if (value?.end && compareTime(newStart, value.end) >= 0) {
			newValue.end = '';
		}

		value = newValue;
		onValueChange?.(newValue);
	}

	function handleEndChange(newEnd: string | undefined) {
		if (!newEnd || !value?.start) return;

		const newValue: TimeRange = { start: value.start, end: newEnd };
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
					class: 'w-auto min-w-[220px] justify-start text-start font-normal',
				}),
				!value?.start && 'text-muted-foreground',
				triggerClass,
			)}>
			<Clock class="me-2 size-4" />
			{displayValue}
		</Popover.Trigger>
		<Popover.Content class={cn('flex w-auto gap-2 p-3', contentClass)} {align} {side}>
			<div class="flex flex-col gap-1">
				<span class="text-xs text-muted-foreground px-1">Start</span>
				<Select.Root type="single" value={value?.start} onValueChange={handleStartChange}>
					<Select.Trigger class="w-[120px]">
						{value?.start ? formatTimeDisplay(value.start) : 'Start time'}
					</Select.Trigger>
					<Select.Content class="max-h-50">
						{#each startSlots as slot (slot.value)}
							<Select.Item value={slot.value}>{slot.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="flex items-end pb-2 text-muted-foreground">—</div>

			<div class="flex flex-col gap-1">
				<span class="text-xs text-muted-foreground px-1">End</span>
				<Select.Root type="single" value={value?.end} onValueChange={handleEndChange} disabled={!value?.start}>
					<Select.Trigger class="w-[120px]">
						{value?.end ? formatTimeDisplay(value.end) : 'End time'}
					</Select.Trigger>
					<Select.Content class="max-h-50">
						{#each endSlots as slot (slot.value)}
							<Select.Item value={slot.value}>{slot.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</Popover.Content>
	</Popover.Root>
</div>
