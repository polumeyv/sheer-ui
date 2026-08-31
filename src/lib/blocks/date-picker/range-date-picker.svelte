<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { DateFormatter, type DateValue } from '@internationalized/date';
	import type { DateRange } from '../../internal/index.js';
	import { toDate } from '../../internal/date-time/utils.js';
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { buttonVariants } from '../../components/button';
	import { RangeCalendar } from '../../components/range-calendar';
	import { Popover } from '../../components/popover';
	import * as Resizable from '../../components/resizable';

	interface Props {
		/** Selected range as `@internationalized/date` `DateValue`s — every date prop and callback speaks the same type. */
		value?: DateRange;
		placeholder?: string;
		dateFormat?: Intl.DateTimeFormatOptions['dateStyle'];
		locale?: string;
		disabled?: boolean;
		class?: ClassValue;
		triggerClass?: ClassValue;
		contentClass?: ClassValue;
		align?: 'start' | 'center' | 'end';
		side?: 'top' | 'right' | 'bottom' | 'left';
		numberOfMonths?: number;
		weekdayFormat?: 'short' | 'long' | 'narrow';
		minValue?: DateValue;
		maxValue?: DateValue;
	}

	let {
		value = $bindable(),
		placeholder = 'Pick a date range',
		dateFormat = 'medium',
		locale = 'en-US',
		disabled = false,
		class: className,
		triggerClass,
		contentClass,
		align = 'start',
		side = 'bottom',
		numberOfMonths = 1,
		weekdayFormat = 'short',
		minValue,
		maxValue,
	}: Props = $props();

	const fmtDay = (d: DateValue) => new DateFormatter(locale, { dateStyle: dateFormat }).format(toDate(d));
	const displayValue = $derived(
		value?.start ? (value.end ? `${fmtDay(value.start)} – ${fmtDay(value.end)}` : fmtDay(value.start)) : placeholder,
	);
</script>

<div class={join('grid gap-2', className)}>
	<Popover.Root>
		<Popover.Trigger
			{disabled}
			class={buttonVariants({
				variant: 'outline',
				class: ['w-70 justify-start! text-start font-normal!', !value?.start && 'text-muted-foreground', triggerClass],
			})}>
			<CalendarIcon class="size-4" />
			{displayValue}
		</Popover.Trigger>
		<Popover.Content class={join('w-auto! p-0!', contentClass)} {align} {side}>
			<RangeCalendar.Root bind:value {minValue} {maxValue} {numberOfMonths} {weekdayFormat} {locale} class="p-3">
				{#snippet children({ months, weekdays })}
					<RangeCalendar.Header class="flex items-center justify-between">
						<RangeCalendar.PrevButton class="inline-grid size-7 place-items-center rounded-md hover:bg-muted">
							<ChevronLeftIcon class="size-4" />
						</RangeCalendar.PrevButton>
						<RangeCalendar.Heading class="text-sm font-medium" />
						<RangeCalendar.NextButton class="inline-grid size-7 place-items-center rounded-md hover:bg-muted">
							<ChevronRightIcon class="size-4" />
						</RangeCalendar.NextButton>
					</RangeCalendar.Header>
					{#snippet monthGrid(month: (typeof months)[number])}
						<RangeCalendar.Grid class="w-full border-collapse select-none space-y-1">
							<RangeCalendar.GridHead>
								<RangeCalendar.GridRow class="flex w-full justify-between">
									{#each weekdays as day, di (di)}
										<RangeCalendar.HeadCell class="w-9 rounded-md text-xs font-normal! text-muted-foreground">
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
													class="inline-grid size-9 place-items-center whitespace-nowrap rounded-md border border-transparent bg-transparent p-0 text-sm font-normal text-foreground hover:border-foreground data-disabled:pointer-events-none data-disabled:text-foreground/30 data-outside-month:pointer-events-none data-selected:bg-primary data-selected:font-medium data-selected:text-primary-foreground data-unavailable:text-muted-foreground data-unavailable:line-through" />
											</RangeCalendar.Cell>
										{/each}
									</RangeCalendar.GridRow>
								{/each}
							</RangeCalendar.GridBody>
						</RangeCalendar.Grid>
					{/snippet}
					{#if months.length > 1}
						<Resizable.PaneGroup direction="horizontal" class="pt-4">
							{#each months as month, i (i)}
								{#if i > 0}
									<Resizable.Handle
										class="mx-2 w-px shrink-0 cursor-col-resize rounded-full bg-border transition-colors hover:bg-foreground/30 data-[active]:bg-foreground/40" />
								{/if}
								<Resizable.Pane minSize={30} defaultSize={100 / months.length}>
									{@render monthGrid(month)}
								</Resizable.Pane>
							{/each}
						</Resizable.PaneGroup>
					{:else}
						<div class="pt-4">
							{@render monthGrid(months[0]!)}
						</div>
					{/if}
				{/snippet}
			</RangeCalendar.Root>
		</Popover.Content>
	</Popover.Root>
</div>
