<script lang="ts">
	import type { DateValue } from "@internationalized/date";
	import * as DateField from "../../src/lib/components/date-field/index.js";

	let {
		placeholder = $bindable(),
		value = $bindable(),
		minValue,
		maxValue,
		name = "birthday",
	}: {
		placeholder?: DateValue;
		value?: DateValue;
		minValue?: DateValue;
		maxValue?: DateValue;
		name?: string;
	} = $props();

	export function setPlaceholder(next: DateValue | undefined) {
		placeholder = next;
	}
</script>

<output data-testid="placeholder">{placeholder?.toString() ?? "undefined"}</output>
<output data-testid="value">{value?.toString() ?? "undefined"}</output>

<form data-testid="form">
	<DateField.Root bind:placeholder bind:value {minValue} {maxValue}>
		<DateField.Input {name} data-testid="field">
			{#snippet children({ segments })}
				{#each segments as segment, index (`${segment.part}-${index}`)}
					<DateField.Segment part={segment.part} data-testid={`segment-${segment.part}`}>
						{segment.value}
					</DateField.Segment>
				{/each}
			{/snippet}
		</DateField.Input>
	</DateField.Root>
</form>
