<script lang="ts">
	import type { DateValue } from "@internationalized/date";
	import * as DatePicker from "../../src/lib/components/date-picker/index.js";

	let {
		placeholder = $bindable(),
		value = $bindable(),
		minValue,
		maxValue,
	}: {
		placeholder?: DateValue;
		value?: DateValue;
		minValue?: DateValue;
		maxValue?: DateValue;
	} = $props();

	export function setPlaceholder(next: DateValue | undefined) {
		placeholder = next;
	}
</script>

<output data-testid="placeholder">{placeholder?.toString() ?? "undefined"}</output>
<output data-testid="value">{value?.toString() ?? "undefined"}</output>

<DatePicker.Root bind:placeholder bind:value {minValue} {maxValue} closeOnDateSelect={false}>
	<DatePicker.Calendar data-testid="calendar">
		{#snippet children({ months })}
			<DatePicker.PrevButton data-testid="prev">Previous</DatePicker.PrevButton>
			<DatePicker.NextButton data-testid="next">Next</DatePicker.NextButton>

			{#each months as month (month.value.toString())}
				<DatePicker.Grid>
					<DatePicker.GridBody>
						{#each month.weeks as weekDates, weekIndex (weekIndex)}
							<DatePicker.GridRow>
								{#each weekDates as date (date.toString())}
									<DatePicker.Cell {date} month={month.value}>
										<DatePicker.Day data-testid={`day-${date.toString()}`} />
									</DatePicker.Cell>
								{/each}
							</DatePicker.GridRow>
						{/each}
					</DatePicker.GridBody>
				</DatePicker.Grid>
			{/each}
		{/snippet}
	</DatePicker.Calendar>
</DatePicker.Root>
