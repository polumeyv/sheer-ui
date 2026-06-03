<script lang="ts">
	import Clock from '@lucide/svelte/icons/clock';
	import { cn } from '../../utils.js';
	import { buttonVariants } from '../../components/button/index.js';
	import * as Select from '../../components/select/index.js';
	import { formatTimeDisplay } from '@polumeyv/lib/public';
	import { compareTime, generateTimeSlots, isTimeInRange, type TimeSlot, b_HOURS, EXTENDED_HOURS } from './time-slots.js';

	type TimeSlotPreset = 'business' | 'extended' | 'full' | 'custom';

	interface Props {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
		triggerClass?: string;
		contentClass?: string;
		align?: 'start' | 'center' | 'end';
		side?: 'top' | 'right' | 'bottom' | 'left';
		onValueChange?: (value: string | undefined) => void;
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

	const displayValue = $derived(value ? formatTimeDisplay(value) : placeholder);

	function handleValueChange(newValue: string | undefined) {
		value = newValue;
		onValueChange?.(newValue);
	}
</script>

<div class={cn('grid gap-2', className)}>
	<Select.Root type="single" {value} onValueChange={handleValueChange} {disabled}>
		<Select.Trigger
			class={cn(
				buttonVariants({
					variant: 'outline',
					class: 'w-[180px] justify-start text-start font-normal',
				}),
				!value && 'text-muted-foreground',
				triggerClass,
			)}>
			<Clock class="me-2 size-4" />
			{displayValue}
		</Select.Trigger>
		<Select.Content class={cn('max-h-[300px]', contentClass)} {align} {side}>
			{#each filteredSlots as slot (slot.value)}
				<Select.Item value={slot.value}>{slot.label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
