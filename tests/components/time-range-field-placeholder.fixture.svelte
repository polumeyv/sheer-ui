<script lang="ts">
	import type {
		HourCycle,
		TimeGranularity,
		TimeRange,
		TimeValue,
	} from "../../src/lib/shared/date/types.js";
	import * as TimeRangeField from "../../src/lib/components/time-range-field/index.js";

	let {
		placeholder = $bindable(),
		value = $bindable(),
		granularity,
		hourCycle,
		startName = "startTime",
		endName = "endTime",
	}: {
		placeholder?: TimeValue;
		value?: TimeRange;
		granularity?: TimeGranularity;
		hourCycle?: HourCycle;
		startName?: string;
		endName?: string;
	} = $props();

	function formatTime(time: TimeValue | undefined) {
		return time?.toString() ?? "undefined";
	}

	function formatRange(range: TimeRange | undefined) {
		if (!range) return "undefined";
		return `{start:${formatTime(range.start)},end:${formatTime(range.end)}}`;
	}

	export function setPlaceholder(next: TimeValue | undefined) {
		placeholder = next;
	}

	export function setValue(next: TimeRange | undefined) {
		value = next;
	}
</script>

<output data-testid="placeholder">{formatTime(placeholder)}</output>
<output data-testid="value">{formatRange(value)}</output>

<form data-testid="form">
	<TimeRangeField.Root bind:placeholder bind:value {granularity} {hourCycle}>
		<TimeRangeField.Input type="start" name={startName} data-testid="start-field">
			{#snippet children({ segments })}
				{#each segments as segment, index (`start-${segment.part}-${index}`)}
					<TimeRangeField.Segment
						part={segment.part}
						data-side="start"
						data-part={segment.part}
						data-testid={`start-segment-${segment.part}-${index}`}
					>
						{segment.value}
					</TimeRangeField.Segment>
				{/each}
			{/snippet}
		</TimeRangeField.Input>

		<TimeRangeField.Input type="end" name={endName} data-testid="end-field">
			{#snippet children({ segments })}
				{#each segments as segment, index (`end-${segment.part}-${index}`)}
					<TimeRangeField.Segment
						part={segment.part}
						data-side="end"
						data-part={segment.part}
						data-testid={`end-segment-${segment.part}-${index}`}
					>
						{segment.value}
					</TimeRangeField.Segment>
				{/each}
			{/snippet}
		</TimeRangeField.Input>
	</TimeRangeField.Root>
</form>
