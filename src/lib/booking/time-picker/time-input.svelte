<script lang="ts">
	import { cn } from '../../utils.js';
	import * as Select from '../../components/select/index.js';
	import { Button } from '../../components/button/index.js';

	interface Props {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
		triggerClass?: string;
		onValueChange?: (value: string) => void;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		interval?: 15 | 30 | 60;
		use24Hour?: boolean;
	}

	let { value = $bindable(''), placeholder = 'Time', disabled = false, class: className, triggerClass, onValueChange, open = $bindable(false), onOpenChange, interval = 30, use24Hour = false }: Props = $props();

	// Generate time slots based on mode
	const slots = $derived.by(() => {
		const result: string[] = [];
		if (use24Hour) {
			// 24-hour: 0:00, 0:30, 1:00, ... 23:30
			for (let h = 0; h < 24; h++) {
				for (let m = 0; m < 60; m += interval) {
					result.push(`${h}:${String(m).padStart(2, '0')}`);
				}
			}
		} else {
			// 12-hour: 12, 12:30, 1, 1:30, ... 11, 11:30
			for (const h of [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
				for (let m = 0; m < 60; m += interval) {
					result.push(m === 0 ? `${h}` : `${h}:${String(m).padStart(2, '0')}`);
				}
			}
		}
		return result;
	});

	// Parse stored value "HH:MM" -> display info
	const parsed = $derived.by(() => {
		if (!value) return null;
		const parts = value.split(':').map(Number);
		const h = parts[0] ?? 0;
		const m = parts[1] ?? 0;
		const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
		const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
		return { hour24: h, hour12, minute: m, period };
	});

	// Display value for trigger - depends on mode
	const display = $derived.by(() => {
		if (!parsed) return '';
		if (use24Hour) {
			return `${parsed.hour24}:${String(parsed.minute).padStart(2, '0')}`;
		}
		return parsed.minute === 0 ? `${parsed.hour12}` : `${parsed.hour12}:${String(parsed.minute).padStart(2, '0')}`;
	});

	const period = $derived<'AM' | 'PM'>(parsed?.period ?? 'AM');

	// Convert to 24h format string for storage
	function to24(hour: number, minute: number, p?: 'AM' | 'PM'): string {
		let h = hour;
		if (!use24Hour && p) {
			if (p === 'AM' && h === 12) h = 0;
			else if (p === 'PM' && h !== 12) h += 12;
		}
		return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
	}

	function handleSelect(slot: string | undefined) {
		if (!slot) return;
		const parts = slot.includes(':') ? slot.split(':').map(Number) : [Number(slot), 0];
		const h = parts[0] ?? 0;
		const m = parts[1] ?? 0;
		const newValue = use24Hour ? to24(h, m) : to24(h, m, period);
		value = newValue;
		onValueChange?.(newValue);
	}

	function togglePeriod() {
		if (!parsed) {
			value = period === 'AM' ? '12:00' : '00:00';
		} else {
			const hour = parsed.hour12 ?? 12;
			value = to24(hour, parsed.minute, period === 'AM' ? 'PM' : 'AM');
		}
		onValueChange?.(value);
	}
</script>

<div class={cn('flex items-center gap-1', className)}>
	<Select.Root
		type="single"
		{open}
		onOpenChange={(o) => {
			open = o;
			onOpenChange?.(o);
		}}
		value={display || undefined}
		onValueChange={handleSelect}
		{disabled}>
		<Select.Trigger size="sm" class={cn(use24Hour ? 'w-[72px]!' : 'w-[60px]!', 'px-2!', triggerClass)}>
			<span class="flex-1 text-center">{display || placeholder}</span>
		</Select.Trigger>
		<Select.Content class="max-h-50!">
			{#each slots as slot}
				<Select.Item value={slot} label={slot} />
			{/each}
		</Select.Content>
	</Select.Root>

	{#if !use24Hour}
		<Button type="button" variant="outline" size="sm" {disabled} onclick={togglePeriod} class="w-10 px-0 font-medium">
			{period}
		</Button>
	{/if}
</div>
