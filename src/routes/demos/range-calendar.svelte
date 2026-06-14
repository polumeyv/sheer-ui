<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import * as RangeCalendar from '$lib/components/range-calendar/index';
	import type { DateRange } from '$lib/shared/index';

	let value = $state<DateRange>({
		start: new CalendarDate(2026, 6, 13),
		end: new CalendarDate(2026, 6, 20)
	});
</script>

<RangeCalendar.Root
	bind:value
	weekdayFormat="short"
	class="bg-background w-full max-w-sm rounded-md border p-3 shadow-sm [--cell-size:--spacing(8)]"
>
	{#snippet children({ months, weekdays })}
		{#each months as month (month.value)}
			<div class="flex items-center justify-between pb-4">
				<RangeCalendar.PrevButton
					class="hover:bg-accent inline-flex size-8 items-center justify-center rounded-md text-sm"
				>
					&lsaquo;
				</RangeCalendar.PrevButton>
				<RangeCalendar.Heading class="text-sm font-medium" />
				<RangeCalendar.NextButton
					class="hover:bg-accent inline-flex size-8 items-center justify-center rounded-md text-sm"
				>
					&rsaquo;
				</RangeCalendar.NextButton>
			</div>

			<RangeCalendar.Grid class="w-full border-collapse">
				<RangeCalendar.GridHead>
					<RangeCalendar.GridRow class="flex">
						{#each weekdays as weekday (weekday)}
							<RangeCalendar.HeadCell
								class="text-muted-foreground w-(--cell-size) text-[0.8rem] font-normal"
							>
								{weekday.slice(0, 2)}
							</RangeCalendar.HeadCell>
						{/each}
					</RangeCalendar.GridRow>
				</RangeCalendar.GridHead>
				<RangeCalendar.GridBody>
					{#each month.weeks as weekDates (weekDates)}
						<RangeCalendar.GridRow class="flex w-full">
							{#each weekDates as date (date)}
								<RangeCalendar.Cell {date} month={month.value} class="p-0">
									<RangeCalendar.Day
										class="hover:bg-accent inline-flex size-(--cell-size) items-center justify-center rounded-md text-sm data-disabled:opacity-50 data-selected:bg-primary data-selected:text-primary-foreground data-unavailable:line-through"
									/>
								</RangeCalendar.Cell>
							{/each}
						</RangeCalendar.GridRow>
					{/each}
				</RangeCalendar.GridBody>
			</RangeCalendar.Grid>
		{/each}
	{/snippet}
</RangeCalendar.Root>
