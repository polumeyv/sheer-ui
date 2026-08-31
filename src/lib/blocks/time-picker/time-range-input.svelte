<script lang="ts">
	import Clock from '@lucide/svelte/icons/clock';
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import TimeInput from './time-input.svelte';

	interface Props {
		value?: { start: string; end: string };
		disabled?: boolean;
		class?: ClassValue;
		triggerClass?: ClassValue;
		interval?: 15 | 30 | 60;
		use24Hour?: boolean;
	}

	let {
		value = $bindable({ start: '', end: '' }),
		disabled = false,
		class: className,
		triggerClass,
		interval = 30,
		use24Hour = false,
	}: Props = $props();
</script>

<div class={join('flex items-center gap-3', className)}>
	<Clock class="size-4 text-muted-foreground shrink-0" />

	<TimeInput bind:value={value.start} {disabled} {interval} {use24Hour} {triggerClass} placeholder="Start" />

	<span class="text-muted-foreground text-sm select-none">to</span>

	<TimeInput bind:value={value.end} {disabled} {interval} {use24Hour} {triggerClass} placeholder="End" />
</div>
