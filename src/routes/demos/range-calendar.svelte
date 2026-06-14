<script lang="ts">
	import { CalendarDate, getLocalTimeZone, today, type DateValue } from '@internationalized/date';
	import * as RangeCalendar from '$lib/components/primitive/range-calendar/index';
	import type { DateRange } from '$lib/shared/index';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const ROOT = 'bg-background w-full max-w-sm rounded-md border p-3 shadow-sm [--cell-size:--spacing(8)]';
	const NAV_BTN =
		'hover:bg-accent inline-flex size-8 items-center justify-center rounded-md text-sm disabled:opacity-50';
	const HEADING = 'text-sm font-medium';
	const GRID = 'w-full border-collapse';
	const HEAD_CELL = 'text-muted-foreground w-(--cell-size) text-[0.8rem] font-normal';
	const DAY =
		'hover:bg-accent inline-flex size-(--cell-size) items-center justify-center rounded-md text-sm data-disabled:pointer-events-none data-disabled:opacity-50 data-selected:bg-primary data-selected:text-primary-foreground data-unavailable:line-through';

	const now = today(getLocalTimeZone());

	// 1 — default range
	let value = $state<DateRange>({
		start: new CalendarDate(2026, 6, 13),
		end: new CalendarDate(2026, 6, 20)
	});

	// 2 — constrained selection (min 2, max 7 days)
	let constrained = $state<DateRange>({ start: undefined, end: undefined });

	// 3 — two months, paged navigation
	let trip = $state<DateRange>({
		start: now,
		end: now.add({ days: 9 })
	});

	// 4 — unavailable / disabled dates (weekends disabled, a few booked)
	let booking = $state<DateRange>({ start: undefined, end: undefined });
	const isWeekend = (date: DateValue) => {
		const day = date.toDate(getLocalTimeZone()).getDay();
		return day === 0 || day === 6;
	};
	const bookedDays = [now.add({ days: 3 }), now.add({ days: 4 }), now.add({ days: 5 })];
	const isBooked = (date: DateValue) => bookedDays.some((d) => date.compare(d) === 0);
</script>

<div class="flex w-full max-w-3xl flex-col gap-10">
	<!-- 1 — default range -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">Select a start and end date.</p>
		</div>
		<RangeCalendar.Root bind:value weekdayFormat="short" class={ROOT}>
			{#snippet children({ months, weekdays })}
				{#each months as month (month.value)}
					<div class="flex items-center justify-between pb-4">
						<RangeCalendar.PrevButton class={NAV_BTN}>&lsaquo;</RangeCalendar.PrevButton>
						<RangeCalendar.Heading class={HEADING} />
						<RangeCalendar.NextButton class={NAV_BTN}>&rsaquo;</RangeCalendar.NextButton>
					</div>

					<RangeCalendar.Grid class={GRID}>
						<RangeCalendar.GridHead>
							<RangeCalendar.GridRow class="flex">
								{#each weekdays as weekday (weekday)}
									<RangeCalendar.HeadCell class={HEAD_CELL}>
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
											<RangeCalendar.Day class={DAY} />
										</RangeCalendar.Cell>
									{/each}
								</RangeCalendar.GridRow>
							{/each}
						</RangeCalendar.GridBody>
					</RangeCalendar.Grid>
				{/each}
			{/snippet}
		</RangeCalendar.Root>
	</section>

	<!-- 2 — constrained selection -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Min / max days</h3>
			<p class="text-muted-foreground mt-1 text-xs">Ranges must span between 2 and 7 days.</p>
		</div>
		<RangeCalendar.Root bind:value={constrained} minDays={2} maxDays={7} weekdayFormat="short" class={ROOT}>
			{#snippet children({ months, weekdays })}
				{#each months as month (month.value)}
					<div class="flex items-center justify-between pb-4">
						<RangeCalendar.PrevButton class={NAV_BTN}>&lsaquo;</RangeCalendar.PrevButton>
						<RangeCalendar.Heading class={HEADING} />
						<RangeCalendar.NextButton class={NAV_BTN}>&rsaquo;</RangeCalendar.NextButton>
					</div>

					<RangeCalendar.Grid class={GRID}>
						<RangeCalendar.GridHead>
							<RangeCalendar.GridRow class="flex">
								{#each weekdays as weekday (weekday)}
									<RangeCalendar.HeadCell class={HEAD_CELL}>
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
											<RangeCalendar.Day class={DAY} />
										</RangeCalendar.Cell>
									{/each}
								</RangeCalendar.GridRow>
							{/each}
						</RangeCalendar.GridBody>
					</RangeCalendar.Grid>
				{/each}
			{/snippet}
		</RangeCalendar.Root>
	</section>

	<!-- 3 — two months -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Two months</h3>
			<p class="text-muted-foreground mt-1 text-xs">Side-by-side months with paged navigation.</p>
		</div>
		<RangeCalendar.Root
			bind:value={trip}
			numberOfMonths={2}
			pagedNavigation
			weekdayFormat="short"
			class="bg-background w-full max-w-2xl rounded-md border p-3 shadow-sm [--cell-size:--spacing(8)]"
		>
			{#snippet children({ months, weekdays })}
				<div class="relative flex items-center justify-between pb-4">
					<RangeCalendar.PrevButton class={NAV_BTN}>&lsaquo;</RangeCalendar.PrevButton>
					<RangeCalendar.NextButton class={NAV_BTN}>&rsaquo;</RangeCalendar.NextButton>
				</div>
				<div class="flex flex-col gap-6 sm:flex-row sm:gap-4">
					{#each months as month (month.value)}
						<div>
							<RangeCalendar.Heading class="mb-4 block text-center {HEADING}" />
							<RangeCalendar.Grid class={GRID}>
								<RangeCalendar.GridHead>
									<RangeCalendar.GridRow class="flex">
										{#each weekdays as weekday (weekday)}
											<RangeCalendar.HeadCell class={HEAD_CELL}>
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
													<RangeCalendar.Day class={DAY} />
												</RangeCalendar.Cell>
											{/each}
										</RangeCalendar.GridRow>
									{/each}
								</RangeCalendar.GridBody>
							</RangeCalendar.Grid>
						</div>
					{/each}
				</div>
			{/snippet}
		</RangeCalendar.Root>
	</section>

	<!-- 4 — unavailable & disabled dates -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Booking</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Weekends disabled, booked days struck through and unselectable.
			</p>
		</div>
		<RangeCalendar.Root
			bind:value={booking}
			isDateDisabled={isWeekend}
			isDateUnavailable={isBooked}
			minValue={now}
			weekdayFormat="short"
			class={ROOT}
		>
			{#snippet children({ months, weekdays })}
				{#each months as month (month.value)}
					<div class="flex items-center justify-between pb-4">
						<RangeCalendar.PrevButton class={NAV_BTN}>&lsaquo;</RangeCalendar.PrevButton>
						<RangeCalendar.Heading class={HEADING} />
						<RangeCalendar.NextButton class={NAV_BTN}>&rsaquo;</RangeCalendar.NextButton>
					</div>

					<RangeCalendar.Grid class={GRID}>
						<RangeCalendar.GridHead>
							<RangeCalendar.GridRow class="flex">
								{#each weekdays as weekday (weekday)}
									<RangeCalendar.HeadCell class={HEAD_CELL}>
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
											<RangeCalendar.Day class={DAY} />
										</RangeCalendar.Cell>
									{/each}
								</RangeCalendar.GridRow>
							{/each}
						</RangeCalendar.GridBody>
					</RangeCalendar.Grid>
				{/each}
			{/snippet}
		</RangeCalendar.Root>
	</section>
</div>
