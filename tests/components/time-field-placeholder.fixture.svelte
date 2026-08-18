<script lang="ts">
	import type { TimeValue, TimeGranularity, HourCycle } from "../../src/lib/internal/date-time/types.js";
	import * as TimeField from "../../src/lib/components/time-field/index.js";

	let {
		placeholder = $bindable(),
		value = $bindable(),
		granularity,
		hourCycle,
		name = "appointmentTime",
	}: {
		placeholder?: TimeValue;
		value?: TimeValue;
		granularity?: TimeGranularity;
		hourCycle?: HourCycle;
		name?: string;
	} = $props();

	export function setPlaceholder(next: TimeValue | undefined) {
		placeholder = next;
	}
</script>

<output data-testid="placeholder">{placeholder?.toString() ?? "undefined"}</output>
<output data-testid="value">{value?.toString() ?? "undefined"}</output>

<form data-testid="form">
	<TimeField.Root bind:placeholder bind:value {granularity} {hourCycle}>
		<TimeField.Input {name} data-testid="field">
			{#snippet children({ segments })}
				{#each segments as segment, index (`${segment.part}-${index}`)}
					<TimeField.Segment
						part={segment.part}
						data-part={segment.part}
						data-testid={`segment-${segment.part}-${index}`}
					>
						{segment.value}
					</TimeField.Segment>
				{/each}
			{/snippet}
		</TimeField.Input>
	</TimeField.Root>
</form>
