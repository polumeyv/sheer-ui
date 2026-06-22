<script lang="ts">
	import * as Slider from "../../src/lib/components/slider/index.js";

	type SliderValue = number | number[];

	let {
		value = $bindable(),
		type,
		min = 0,
		max = 100,
		step = 1,
		autoSort = true,
	}: {
		value?: SliderValue;
		type: "single" | "multiple";
		min?: number;
		max?: number;
		step?: number | number[];
		autoSort?: boolean;
	} = $props();

	let changeCount = $state(0);
	let commitCount = $state(0);
	let lastChanged = $state<SliderValue | undefined>();
	let lastCommitted = $state<SliderValue | undefined>();

	function cloneValue(current: SliderValue): SliderValue {
		return Array.isArray(current) ? [...current] : current;
	}

	function formatValue(current: SliderValue | undefined) {
		if (Array.isArray(current)) return `[${current.join(",")}]`;
		return current === undefined ? "undefined" : String(current);
	}

	function handleValueChange(next: SliderValue) {
		changeCount += 1;
		lastChanged = cloneValue(next);
	}

	function handleValueCommit(next: SliderValue) {
		commitCount += 1;
		lastCommitted = cloneValue(next);
	}

	export function setValue(next: SliderValue | undefined) {
		value = next;
	}

	export function setStep(next: number | number[]) {
		step = next;
	}

	export function setMin(next: number) {
		min = next;
	}

	export function setMax(next: number) {
		max = next;
	}
</script>

<output data-testid="value">{formatValue(value)}</output>
<output data-testid="change-count">{changeCount}</output>
<output data-testid="commit-count">{commitCount}</output>
<output data-testid="last-changed">{formatValue(lastChanged)}</output>
<output data-testid="last-committed">{formatValue(lastCommitted)}</output>

<form data-testid="form">
	{#if type === "single"}
		<Slider.Root
			bind:value
			type="single"
			{min}
			{max}
			{step}
			{autoSort}
			onValueChange={handleValueChange}
			onValueCommit={handleValueCommit}
		/>
	{:else}
		<Slider.Root
			bind:value
			type="multiple"
			{min}
			{max}
			{step}
			{autoSort}
			onValueChange={handleValueChange}
			onValueCommit={handleValueCommit}
		/>
	{/if}
</form>
