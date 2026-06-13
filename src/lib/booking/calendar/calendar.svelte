<script lang="ts">
	import { Calendar as CalendarPrimitive } from "$lib/components/_shared/primitives.js";
	import * as Calendar from './index.js';
	import { cn, type WithoutChildrenOrChild } from '../../vendor/utils.js';
	import type { ButtonVariant } from '../../components/button/index.js';
	import { isEqualMonth, parseDate, type DateValue } from '@internationalized/date';
	import { DateString } from '@polumeyv/lib/schemas';
	import type { Snippet } from 'svelte';

	// Pull the `type: 'single'` member out of bits-ui's discriminated-union RootProps before Omit — Omit over
	// the whole union expands into a type too complex for consumers' typechecks to represent.
	type SingleRootProps = Extract<CalendarPrimitive.RootProps, { type: 'single' }>;

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
		captionLayout = 'label',
		locale = 'en-US',
		months: monthsProp,
		years,
		monthFormat: monthFormatProp,
		yearFormat = 'numeric',
		day,
		disableDaysOutsideMonth = false,
		...restProps
	}: Omit<
		WithoutChildrenOrChild<SingleRootProps>,
		'type' | 'value' | 'placeholder' | 'minValue' | 'maxValue' | 'isDateDisabled' | 'isDateUnavailable' | 'onValueChange' | 'onPlaceholderChange'
	> & {
		type: 'single';
		/** Selected date as a branded `DateString` — every date prop and callback on this component speaks the same type. */
		value?: DateString;
		/** Displayed month as a `DateString`. */
		placeholder?: DateString;
		onValueChange?: (value: DateString | undefined) => void;
		minValue?: DateString;
		maxValue?: DateString;
		isDateDisabled?: (date: DateString) => boolean;
		isDateUnavailable?: (date: DateString) => boolean;
		buttonVariant?: ButtonVariant;
		captionLayout?: 'dropdown' | 'dropdown-months' | 'dropdown-years' | 'label';
		months?: CalendarPrimitive.MonthSelectProps['months'];
		years?: CalendarPrimitive.YearSelectProps['years'];
		monthFormat?: CalendarPrimitive.MonthSelectProps['monthFormat'];
		yearFormat?: CalendarPrimitive.YearSelectProps['yearFormat'];
		day?: Snippet<[{ day: DateString; outsideMonth: boolean }]>;
	} = $props();

	const monthFormat = $derived.by(() => {
		if (monthFormatProp) return monthFormatProp;
		if (captionLayout.startsWith('dropdown')) return 'short';
		return 'long';
	});

	// The @internationalized/date boundary: bits-ui below this point speaks DateValue, everything above
	// speaks branded DateStrings. Function bindings convert in both directions right at the primitive.
	const parseSafe = (s: DateString | undefined) => {
		if (!s) return undefined;
		try {
			return parseDate(s);
		} catch {
			return undefined;
		}
	};
	const brand = (v: DateValue | undefined): DateString | undefined => (v ? DateString.make(v.toString()) : undefined);
	const calValue = $derived(parseSafe(value));
	const calPlaceholder = $derived(parseSafe(placeholder));
	const setPlaceholder = (v: DateValue | undefined) => (placeholder = brand(v));
</script>

<CalendarPrimitive.Root
	{type}
	bind:value={
		() => calValue,
		(v) => {
			value = brand(v);
			onValueChange?.(value);
		}
	}
	bind:ref
	bind:placeholder={() => calPlaceholder, setPlaceholder}
	minValue={parseSafe(minValue)}
	maxValue={parseSafe(maxValue)}
	isDateDisabled={isDateDisabled && ((d: DateValue) => isDateDisabled(DateString.make(d.toString())))}
	isDateUnavailable={isDateUnavailable && ((d: DateValue) => isDateUnavailable(DateString.make(d.toString())))}
	{weekdayFormat}
	{disableDaysOutsideMonth}
	class={cn(
		'p-3 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(8)] bg-background group/calendar in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent',
		className,
	)}
	{locale}
	{monthFormat}
	{yearFormat}
	{...restProps}>
	{#snippet children({ months, weekdays })}
		<Calendar.Months>
			<Calendar.Nav>
				<Calendar.PrevButton variant={buttonVariant} />
				<Calendar.NextButton variant={buttonVariant} />
			</Calendar.Nav>
			{#each months as month, monthIndex (month)}
				<Calendar.Month>
					<Calendar.Header>
						<Calendar.Caption
							{captionLayout}
							months={monthsProp}
							{monthFormat}
							{years}
							{yearFormat}
							month={month.value}
							bind:placeholder={() => calPlaceholder, setPlaceholder}
							{locale}
							{monthIndex} />
					</Calendar.Header>
					<Calendar.Grid>
						<Calendar.GridHead>
							<Calendar.GridRow class="select-none">
								{#each weekdays as weekday, i (i)}
									<Calendar.HeadCell>
										{weekday.slice(0, 2)}
									</Calendar.HeadCell>
								{/each}
							</Calendar.GridRow>
						</Calendar.GridHead>
						<Calendar.GridBody>
							{#each month.weeks as weekDates (weekDates)}
								<Calendar.GridRow class="mt-2 w-full">
									{#each weekDates as date (date)}
										<Calendar.Cell {date} month={month.value}>
											{#if day}
												{@render day({
													day: DateString.make(date.toString()),
													outsideMonth: !isEqualMonth(date, month.value),
												})}
											{:else}
												<Calendar.Day />
											{/if}
										</Calendar.Cell>
									{/each}
								</Calendar.GridRow>
							{/each}
						</Calendar.GridBody>
					</Calendar.Grid>
				</Calendar.Month>
			{/each}
		</Calendar.Months>
	{/snippet}
</CalendarPrimitive.Root>
