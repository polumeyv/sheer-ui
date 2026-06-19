<script lang="ts">
	import { Calendar } from '../components/calendar';
	import type { CalendarRootProps, CalendarMonthSelectProps, CalendarYearSelectProps } from '../components/calendar/types.js';
	import { cn, type WithoutChildrenOrChild } from '$lib/utils.js';
	import type { ButtonVariant } from '$lib/components/button';
	import type { DateValue } from '@internationalized/date';
	import type { Snippet } from 'svelte';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	// Pull the `type: 'single'` member out of bits-ui's discriminated-union RootProps before Omit — Omit over
	// the whole union expands into a type too complex for consumers' typechecks to represent.
	type SingleRootProps = Extract<CalendarRootProps, { type: 'single' }>;

	let {
		ref = $bindable(null),
		type,
		value = $bindable(),
		placeholder = $bindable(),
		onValueChange,
		minValue,
		maxValue,
		isDateDisabled,
		isDateUnavailable,
		class: className,
		weekdayFormat = 'short',
		buttonVariant = 'ghost',
		locale = 'en-US',
		months: monthsProp,
		years,
		captionLayout = 'dropdown',
		monthFormat: monthFormatProp,
		yearFormat = 'numeric',
		day,
		disableDaysOutsideMonth = false,
		...restProps
	}: Omit<WithoutChildrenOrChild<SingleRootProps>, 'type'> & {
		type: 'single';
		buttonVariant?: ButtonVariant;
		captionLayout?: 'dropdown' | 'dropdown-months' | 'dropdown-years' | 'label';
		months?: CalendarMonthSelectProps['months'];
		years?: CalendarYearSelectProps['years'];
		monthFormat?: CalendarMonthSelectProps['monthFormat'];
		yearFormat?: CalendarYearSelectProps['yearFormat'];
		day?: Snippet<[{ day: DateValue; outsideMonth: boolean }]>;
	} = $props();

	const monthFormat = $derived.by(() => {
		if (monthFormatProp) return monthFormatProp;
		if (captionLayout.startsWith('dropdown')) return 'short';
		return 'long';
	});
</script>

<Calendar.Root
	{type}
	bind:value
	bind:ref
	bind:placeholder
	{onValueChange}
	{minValue}
	{maxValue}
	{isDateDisabled}
	{isDateUnavailable}
	{weekdayFormat}
	{disableDaysOutsideMonth}
	class="rounded border p-6"
	{locale}
	{monthFormat}
	{yearFormat}
	{...restProps}>
	{#snippet children({ months, weekdays })}
		<Calendar.Header class="flex items-center justify-between">
			<Calendar.PrevButton class="rounded bg-background-alt hover:bg-muted inline-flex items-center justify-center">
				<ChevronLeftIcon class="size-5" />
			</Calendar.PrevButton>
			<Calendar.Heading class="text-md font-medium" />
			<Calendar.NextButton class="rounded bg-background-alt hover:bg-muted inline-flex items-center justify-center">
				<ChevronRightIcon class="size-5" />
			</Calendar.NextButton>
		</Calendar.Header>
		<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
			{#each months as month, i (i)}
				<Calendar.Grid class="w-full border-collapse select-none space-y-1">
					<Calendar.GridHead>
						<Calendar.GridRow class="mb-1 flex w-full justify-between">
							{#each weekdays as day, i (i)}
								<Calendar.HeadCell class="text-muted-foreground font-normal! w-10 rounded-md text-xs">
									<div>{day.slice(0, 2)}</div>
								</Calendar.HeadCell>
							{/each}
						</Calendar.GridRow>
					</Calendar.GridHead>
					<Calendar.GridBody>
						{#each month.weeks as weekDates, i (i)}
							<Calendar.GridRow class="flex w-full">
								{#each weekDates as date, i (i)}
									<Calendar.Cell {date} month={month.value} class="p-0! relative size-10 text-center text-sm">
										<Calendar.Day
											class="rounded text-foreground hover:border-foreground data-selected:bg-foreground data-disabled:text-foreground/30 data-selected:text-background data-unavailable:text-muted-foreground data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal">
											<div
												class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-1.25 hidden size-1 rounded-full">
											</div>
											{date.day}
										</Calendar.Day>
									</Calendar.Cell>
								{/each}
							</Calendar.GridRow>
						{/each}
					</Calendar.GridBody>
				</Calendar.Grid>
			{/each}
		</div>
	{/snippet}
</Calendar.Root>
