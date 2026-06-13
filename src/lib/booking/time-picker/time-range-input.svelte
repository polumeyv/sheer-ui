<script lang="ts">
import Clock from '@lucide/svelte/icons/clock';
import { cn } from '../../vendor/utils.js';
import TimeInput from './time-input.svelte';

interface Props {
	value?: { start: string; end: string };
	disabled?: boolean;
	class?: string;
	triggerClass?: string;
	onValueChange?: (value: { start: string; end: string }) => void;
	interval?: 15 | 30 | 60;
	use24Hour?: boolean;
}

let {
	value = $bindable({ start: '', end: '' }),
	disabled = false,
	class: className,
	triggerClass,
	onValueChange,
	interval = 30,
	use24Hour = false,
}: Props = $props();

// Only one dropdown open at a time
let startOpen = $state(false);
let endOpen = $state(false);

function setStart(v: string) {
	value = { start: v, end: value.end };
	onValueChange?.(value);
}

function setEnd(v: string) {
	value = { start: value.start, end: v };
	onValueChange?.(value);
}
</script>

<div class={cn("flex items-center gap-3", className)}>
  <Clock class="size-4 text-muted-foreground shrink-0" />

  <TimeInput
    bind:value={value.start}
    onValueChange={setStart}
    open={startOpen}
    onOpenChange={(o) => { startOpen = o; if (o) endOpen = false; }}
    {disabled}
    {interval}
    {use24Hour}
    {triggerClass}
    placeholder="Start"
  />

  <span class="text-muted-foreground text-sm select-none">to</span>

  <TimeInput
    bind:value={value.end}
    onValueChange={setEnd}
    open={endOpen}
    onOpenChange={(o) => { endOpen = o; if (o) startOpen = false; }}
    {disabled}
    {interval}
    {use24Hour}
    {triggerClass}
    placeholder="End"
  />
</div>
