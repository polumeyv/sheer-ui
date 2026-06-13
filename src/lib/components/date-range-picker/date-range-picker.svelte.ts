import { createContext } from 'svelte';
import type { DateValue } from '@internationalized/date';
import { type ReadableProps, type WritableProps } from '$lib/vendor/index.js';
import type { DateMatcher, DateRange, SegmentPart } from '$lib/shared/index.js';
import type { Granularity, HourCycle, WeekStartsOn } from '$lib/shared/date/types.js';

export const [getDateRangePickerRootContext, setDateRangePickerRootContext] = createContext<DateRangePickerRootState>();

interface DateRangePickerRootStateOpts
	extends
		WritableProps<{
			value: DateRange;
			startValue: DateValue | undefined;
			endValue: DateValue | undefined;
			open: boolean;
			placeholder: DateValue;
		}>,
		ReadableProps<{
			readonlySegments: SegmentPart[];
			isDateUnavailable: DateMatcher;
			isDateDisabled: DateMatcher;
			minValue: DateValue | undefined;
			maxValue: DateValue | undefined;
			minDays: number | undefined;
			maxDays: number | undefined;
			disabled: boolean;
			readonly: boolean;
			granularity: Granularity | undefined;
			hourCycle: HourCycle | undefined;
			locale: string;
			hideTimeZone: boolean;
			required: boolean;
			preventDeselect: boolean;
			pagedNavigation: boolean;
			weekStartsOn: WeekStartsOn | undefined;
			weekdayFormat: Intl.DateTimeFormatOptions['weekday'];
			fixedWeeks: boolean;
			numberOfMonths: number;
			calendarLabel: string;
			disableDaysOutsideMonth: boolean;
			excludeDisabled: boolean;
			onRangeSelect?: () => void;
			monthFormat: Intl.DateTimeFormatOptions['month'] | ((month: number) => string);
			yearFormat: Intl.DateTimeFormatOptions['year'] | ((year: number) => string);
		}> {
	defaultPlaceholder: DateValue;
}

export class DateRangePickerRootState {
	static create(opts: DateRangePickerRootStateOpts) {
		return setDateRangePickerRootContext(new DateRangePickerRootState(opts));
	}
	readonly opts: DateRangePickerRootStateOpts;

	constructor(opts: DateRangePickerRootStateOpts) {
		this.opts = opts;
	}
}
