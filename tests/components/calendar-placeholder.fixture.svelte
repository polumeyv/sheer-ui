<script lang="ts">
	import type { DateValue } from "@internationalized/date";
	import * as Calendar from "../../src/lib/components/calendar/exports.js";

	type CalendarValue = DateValue | DateValue[] | undefined;

	let {
		placeholder = $bindable(),
		value = $bindable(),
		minValue,
		maxValue,
		type = "single",
	}: {
		placeholder?: DateValue;
		value?: CalendarValue;
		minValue?: DateValue;
		maxValue?: DateValue;
		type?: "single" | "multiple";
	} = $props();

	function formatValue(currentValue: CalendarValue) {
		if (Array.isArray(currentValue)) {
			return `[${currentValue.map((date) => date.toString()).join(",")}]`;
		}

		return currentValue?.toString() ?? "undefined";
	}

	export function setPlaceholder(next: DateValue | undefined) {
		placeholder = next;
	}

	export function setValue(next: CalendarValue) {
		value = next;
	}
</script>

<output data-testid="placeholder">{placeholder?.toString() ?? "undefined"}</output>
<output data-testid="value">{formatValue(value)}</output>

<Calendar.Root bind:placeholder bind:value {type} {minValue} {maxValue} disableDaysOutsideMonth={false}>
	{#snippet children({ months })}
		<Calendar.PrevButton data-testid="prev">Previous</Calendar.PrevButton>
		<Calendar.NextButton data-testid="next">Next</Calendar.NextButton>

		{#each months as month (month.value.toString())}
			<Calendar.Grid>
				<Calendar.GridBody>
					{#each month.weeks as weekDates, weekIndex (weekIndex)}
						<Calendar.GridRow>
							{#each weekDates as date (date.toString())}
								<Calendar.Cell {date} month={month.value}>
									<Calendar.Day data-testid={`day-${date.toString()}`} />
								</Calendar.Cell>
							{/each}
						</Calendar.GridRow>
					{/each}
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	{/snippet}
</Calendar.Root>
