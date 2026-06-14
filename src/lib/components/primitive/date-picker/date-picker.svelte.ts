import { createContext } from 'svelte';
import type { DateValue } from '@internationalized/date';
import { type ReadableProps, type WritableProps } from '$lib/vendor/index';
import type { DateMatcher, SegmentPart } from '$lib/shared/index';
import type { Granularity, HourCycle, WeekStartsOn } from '$lib/shared/date/types';

export const [getDatePickerRootContext, setDatePickerRootContext] = createContext<DatePickerRootState>();

interface DatePickerRootStateOpts
	extends
		WritableProps<{
			value: DateValue | undefined;
			open: boolean;
			placeholder: DateValue;
		}>,
		ReadableProps<{
			readonlySegments: SegmentPart[];
			isDateUnavailable: DateMatcher;
			isDateDisabled: DateMatcher;
			minValue: DateValue | undefined;
			maxValue: DateValue | undefined;
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
			initialFocus: boolean;
			onDateSelect?: () => void;
			monthFormat: Intl.DateTimeFormatOptions['month'] | ((month: number) => string);
			yearFormat: Intl.DateTimeFormatOptions['year'] | ((year: number) => string);
		}> {
	defaultPlaceholder: DateValue;
}

export class DatePickerRootState {
	static create(opts: DatePickerRootStateOpts) {
		return setDatePickerRootContext(new DatePickerRootState(opts));
	}

	readonly opts: DatePickerRootStateOpts;

	constructor(opts: DatePickerRootStateOpts) {
		this.opts = opts;
	}
}
