<script lang="ts">
	import Clock from '@lucide/svelte/icons/clock';
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { buttonVariants } from '../../components/button';
	import * as Select from '../../components/select';
	import { Popover } from '../../components/popover';
	import { formatTimeDisplay, formatDuration } from '../../time';
	import {
		isTimeInRange,
		compareTime,
		getTimeDuration,
		type TimeSlot,
		type SlotRange,
		resolveTimeSlots,
		type TimeSlotPreset,
	} from './time-slots';

	// The internal SlotRange keeps plain strings ('' = unset end); every set value comes from a TimeSlot,
	// so casting at the guarded display seam is sound.
	const fmt = (t: string) => formatTimeDisplay(t);

	interface Props {
		value?: SlotRange;
		placeholder?: string;
		disabled?: boolean;
		class?: ClassValue;
		triggerClass?: ClassValue;
		contentClass?: ClassValue;
		align?: 'start' | 'center' | 'end';
		side?: 'top' | 'right' | 'bottom' | 'left';
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
	const timeSlots = $derived(resolveTimeSlots({ slots, preset, interval, startHour, endHour }));

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
		if (!value?.end) return fmt(value.start);

		const duration = getTimeDuration(value.start, value.end);
		const durationText = showDuration ? ` (${formatDuration(duration, 'compact')})` : '';
		return `${fmt(value.start)} - ${fmt(value.end)}${durationText}`;
	});

	function handleStartChange(newStart: string | undefined) {
		if (!newStart) {
			value = undefined;
			return;
		}

		// If end time is now invalid, clear it
		const newValue: SlotRange = { start: newStart, end: value?.end || '' };
		if (value?.end && compareTime(newStart, value.end) >= 0) {
			newValue.end = '';
		}

		value = newValue;
	}

	function handleEndChange(newEnd: string | undefined) {
		if (!newEnd || !value?.start) return;
		value = { start: value.start, end: newEnd };
	}
</script>

<div class={join('grid gap-2', className)}>
	<Popover.Root>
		<Popover.Trigger
			{disabled}
			class={buttonVariants({
				variant: 'outline',
				class: ['w-auto min-w-55 justify-start! text-start font-normal!', !value?.start && 'text-muted-foreground', triggerClass],
			})}>
			<Clock class="me-2 size-4" />
			{displayValue}
		</Popover.Trigger>
		<Popover.Content class={join('flex w-auto! gap-2 p-3!', contentClass)} {align} {side}>
			<div class="flex flex-col gap-1">
				<span class="text-xs text-muted-foreground px-1">Start</span>
				<Select.Root
					class="w-30"
					placeholder="Start time"
					maxHeight="12.5rem"
					value={value?.start}
					onchange={(e) => handleStartChange(e.currentTarget.value || undefined)}>
					{#each startSlots as slot (slot.value)}
						<Select.Option value={slot.value}>{slot.label}</Select.Option>
					{/each}
				</Select.Root>
			</div>

			<div class="flex items-end pb-2 text-muted-foreground">—</div>

			<div class="flex flex-col gap-1">
				<span class="text-xs text-muted-foreground px-1">End</span>
				<Select.Root
					class="w-30"
					placeholder="End time"
					maxHeight="12.5rem"
					value={value?.end}
					onchange={(e) => handleEndChange(e.currentTarget.value || undefined)}
					disabled={!value?.start}>
					{#each endSlots as slot (slot.value)}
						<Select.Option value={slot.value}>{slot.label}</Select.Option>
					{/each}
				</Select.Root>
			</div>
		</Popover.Content>
	</Popover.Root>
</div>
