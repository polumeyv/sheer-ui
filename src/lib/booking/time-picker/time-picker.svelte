<script lang="ts">
	import Clock from '@lucide/svelte/icons/clock';
	import { cn } from '../../vendor/utils';
	import { buttonVariants } from '../../components/button/index';
	import * as Select from '../../components/select/index';
	import type { TimeString } from '@polumeyv/lib/schemas';
	import { compareTime, generateTimeSlots, isTimeInRange, type TimeSlot, b_HOURS, EXTENDED_HOURS } from './time-slots';

	type TimeSlotPreset = 'business' | 'extended' | 'full' | 'custom';

	interface Props {
		value?: TimeString;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
		triggerClass?: string;
		align?: 'start' | 'center' | 'end';
		side?: 'top' | 'right' | 'bottom' | 'left';
		onValueChange?: (value: TimeString | undefined) => void;
		// Time slot configuration
		preset?: TimeSlotPreset;
		slots?: TimeSlot[];
		interval?: number;
		startHour?: number;
		endHour?: number;
		// Constraints
		minTime?: string;
		maxTime?: string;
		isTimeDisabled?: (time: string) => boolean;
	}

	let {
		value = $bindable(),
		placeholder = 'Select time',
		disabled = false,
		class: className,
		triggerClass,
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
		isTimeDisabled,
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

	// Filter slots based on constraints
	const filteredSlots = $derived.by(() => {
		return timeSlots.filter((slot) => {
			// Check min/max constraints
			if (minTime && maxTime) {
				if (!isTimeInRange(slot.value, minTime, maxTime)) return false;
			} else if (minTime && compareTime(slot.value, minTime) < 0) {
				return false;
			} else if (maxTime && compareTime(slot.value, maxTime) > 0) {
				return false;
			}

			// Check custom disabled function
			if (isTimeDisabled?.(slot.value)) return false;

			return true;
		});
	});

	function handleValueChange(newValue: string | undefined) {
		// Select erases the slot's brand to string; every selectable value is a TimeSlot.value, so it is sound.
		value = newValue as TimeString | undefined;
		onValueChange?.(value);
	}
</script>

<div class={cn('grid gap-2', className)}>
	<Select.Root
		{value}
		onchange={(e) => handleValueChange(e.currentTarget.value || undefined)}
		{disabled}
		{placeholder}
		side={side === 'top' ? 'top' : 'bottom'}
		{align}
		maxHeight="300px"
		class={buttonVariants({
			variant: 'outline',
			class: 'w-[180px] justify-start! text-start font-normal!',
		})}
		triggerClass={cn('justify-start px-0', !value && 'text-muted-foreground', triggerClass)}>
		{#snippet icon()}
			<Clock class="size-4" />
		{/snippet}
		{#each filteredSlots as slot (slot.value)}
			<Select.Option value={slot.value}>{slot.label}</Select.Option>
		{/each}
	</Select.Root>
</div>
