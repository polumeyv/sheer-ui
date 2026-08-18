<script lang="ts">
	import type { DateValue } from "@internationalized/date";
	import * as RangeCalendar from "../../src/lib/components/range-calendar/exports.js";
	import type { DateRange } from "../../src/lib/internal/date-time/types.js";

	let {
		placeholder = $bindable(),
		value = $bindable(),
		minValue,
		maxValue,
	}: {
		placeholder?: DateValue;
		value?: DateRange;
		minValue?: DateValue;
		maxValue?: DateValue;
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

<RangeCalendar.Root bind:placeholder bind:value {minValue} {maxValue} disableDaysOutsideMonth={false}>
	{#snippet children({ months })}
		<RangeCalendar.PrevButton data-testid="prev">Previous</RangeCalendar.PrevButton>
		<RangeCalendar.NextButton data-testid="next">Next</RangeCalendar.NextButton>

		{#each months as month (month.value.toString())}
			<RangeCalendar.Grid>
				<RangeCalendar.GridBody>
					{#each month.weeks as weekDates, weekIndex (weekIndex)}
						<RangeCalendar.GridRow>
							{#each weekDates as date (date.toString())}
								<RangeCalendar.Cell {date} month={month.value}>
									<RangeCalendar.Day data-testid={`day-${date.toString()}`} />
								</RangeCalendar.Cell>
							{/each}
						</RangeCalendar.GridRow>
					{/each}
				</RangeCalendar.GridBody>
			</RangeCalendar.Grid>
		{/each}
	{/snippet}
</RangeCalendar.Root>
