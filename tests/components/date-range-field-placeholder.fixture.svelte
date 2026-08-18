<script lang="ts">
	import type { DateValue } from "@internationalized/date";
	import * as DateRangeField from "../../src/lib/components/date-range-field/index.js";
	import type { DateRange } from "../../src/lib/internal/date-time/types.js";

	let {
		placeholder = $bindable(),
		value = $bindable(),
		minValue,
		maxValue,
		startName = "startDate",
		endName = "endDate",
	}: {
		placeholder?: DateValue;
		value?: DateRange;
		minValue?: DateValue;
		maxValue?: DateValue;
		startName?: string;
		endName?: string;
	} = $props();

	function formatDate(date: DateValue | undefined) {
		return date?.toString() ?? "undefined";
	}

	function formatRange(range: DateRange | undefined) {
		if (!range) return "undefined";
		return `{start:${formatDate(range.start)},end:${formatDate(range.end)}}`;
	}

	export function setPlaceholder(next: DateValue | undefined) {
		placeholder = next;
	}

	export function setValue(next: DateRange | undefined) {
		value = next;
	}
</script>

<output data-testid="placeholder">{formatDate(placeholder)}</output>
<output data-testid="value">{formatRange(value)}</output>

<form data-testid="form">
	<DateRangeField.Root bind:placeholder bind:value {minValue} {maxValue}>
		<DateRangeField.Input type="start" name={startName} data-testid="start-field">
			{#snippet children({ segments })}
				{#each segments as segment, index (`start-${segment.part}-${index}`)}
					<DateRangeField.Segment part={segment.part} data-testid={`start-segment-${segment.part}-${index}`}>
						{segment.value}
					</DateRangeField.Segment>
				{/each}
			{/snippet}
		</DateRangeField.Input>

		<DateRangeField.Input type="end" name={endName} data-testid="end-field">
			{#snippet children({ segments })}
				{#each segments as segment, index (`end-${segment.part}-${index}`)}
					<DateRangeField.Segment part={segment.part} data-testid={`end-segment-${segment.part}-${index}`}>
						{segment.value}
					</DateRangeField.Segment>
				{/each}
			{/snippet}
		</DateRangeField.Input>
	</DateRangeField.Root>
</form>
