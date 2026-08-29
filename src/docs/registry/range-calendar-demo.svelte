<script lang="ts">
	// `components/range-calendar` is the headless bits primitive — it ships no
	// styling, so the consumer paints the grid/day cells with Tailwind utilities.
	// The class strings mirror the project's styled range composition in
	// `blocks/date-picker/range-date-picker.svelte`.
	import { RangeCalendar } from '../../lib/components/range-calendar/index.js';
	import { today, getLocalTimeZone } from '@internationalized/date';
	import type { DateRange } from '../../lib/internal/index.js';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	const start = today(getLocalTimeZone());
	let value = $state<DateRange>({ start, end: start.add({ days: 5 }) });
</script>

<RangeCalendar.Root bind:value weekdayFormat="short" class="w-fit rounded-md border p-3">
	{#snippet children({ months, weekdays })}
		<RangeCalendar.Header class="flex items-center justify-between">
			<RangeCalendar.PrevButton class="hover:bg-muted inline-grid size-7 place-items-center rounded-md">
				<ChevronLeftIcon class="size-4" />
			</RangeCalendar.PrevButton>
			<RangeCalendar.Heading class="text-sm font-medium" />
			<RangeCalendar.NextButton class="hover:bg-muted inline-grid size-7 place-items-center rounded-md">
				<ChevronRightIcon class="size-4" />
			</RangeCalendar.NextButton>
		</RangeCalendar.Header>
		<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
			{#each months as month, i (i)}
				<RangeCalendar.Grid class="w-full border-collapse select-none space-y-1">
					<RangeCalendar.GridHead>
						<RangeCalendar.GridRow class="flex w-full justify-between">
							{#each weekdays as day, di (di)}
								<RangeCalendar.HeadCell class="text-muted-foreground w-9 rounded-md text-xs font-normal!">
									{day.slice(0, 2)}
								</RangeCalendar.HeadCell>
							{/each}
						</RangeCalendar.GridRow>
					</RangeCalendar.GridHead>
					<RangeCalendar.GridBody>
						{#each month.weeks as weekDates, wi (wi)}
							<RangeCalendar.GridRow class="mt-1 flex w-full">
								{#each weekDates as date, ci (ci)}
									<RangeCalendar.Cell
										{date}
										month={month.value}
										class="relative size-9 p-0! text-center text-sm data-highlighted:bg-accent data-selection-end:rounded-r-md data-selection-start:rounded-l-md">
										<RangeCalendar.Day
											class="hover:border-foreground data-disabled:text-foreground/30 data-selected:bg-primary data-selected:text-primary-foreground data-unavailable:text-muted-foreground inline-grid size-9 place-items-center whitespace-nowrap rounded-md border border-transparent bg-transparent p-0 text-sm font-normal text-foreground data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through" />
									</RangeCalendar.Cell>
								{/each}
							</RangeCalendar.GridRow>
						{/each}
					</RangeCalendar.GridBody>
				</RangeCalendar.Grid>
			{/each}
		</div>
	{/snippet}
</RangeCalendar.Root>
