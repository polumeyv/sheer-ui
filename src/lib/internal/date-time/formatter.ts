import { DateFormatter, type DateValue } from '@internationalized/date';
import { hasTime, isZonedDateTime, toDate } from './utils.js';
import type { HourCycle, TimeValue } from '$lib/internal/date-time/types.js';
import { convertTimeValueToDateValue } from './field/time-helpers.js';
import type { ReadableBox } from '$lib/internal/tools/index.js';

export type Formatter = ReturnType<typeof createFormatter>;
export type TimeFormatter = ReturnType<typeof createTimeFormatter>;

const defaultPartOptions: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric',
};

type CreateFormatterOptions = {
	locale: ReadableBox<string>;
	monthFormat: ReadableBox<Intl.DateTimeFormatOptions['month'] | ((month: number) => string)>;
	yearFormat: ReadableBox<Intl.DateTimeFormatOptions['year'] | ((year: number) => string)>;
};
/**
 * Creates a wrapper around the `DateFormatter`, which is
 * an improved version of the {@link Intl.DateTimeFormat} API,
 * that is used internally by the various date builders to
 * easily format dates in a consistent way.
 *
 * @see [DateFormatter](https://react-spectrum.adobe.com/internationalized/date/DateFormatter.html)
 */
export function createFormatter(opts: CreateFormatterOptions) {
	function getLocale() {
		return opts.locale.current;
	}

	function custom(date: Date, options: Intl.DateTimeFormatOptions) {
		return new DateFormatter(getLocale(), options).format(date);
	}

	function selectedDate(date: DateValue, includeTime = true) {
		if (hasTime(date) && includeTime) {
			return custom(toDate(date), {
				dateStyle: 'long',
				timeStyle: 'long',
			});
		}

		return custom(toDate(date), {
			dateStyle: 'long',
		});
	}

	function fullMonthAndYear(date: Date) {
		const locale = getLocale();
		const monthFormat = opts.monthFormat.current;
		const yearFormat = opts.yearFormat.current;

		if (typeof monthFormat !== 'function' && typeof yearFormat !== 'function') {
			return new DateFormatter(locale, {
				month: monthFormat,
				year: yearFormat,
			}).format(date);
		}

		const formattedMonth =
			typeof monthFormat === 'function' ? monthFormat(date.getMonth() + 1) : new DateFormatter(locale, { month: monthFormat }).format(date);

		const formattedYear =
			typeof yearFormat === 'function' ? yearFormat(date.getFullYear()) : new DateFormatter(locale, { year: yearFormat }).format(date);

		return `${formattedMonth} ${formattedYear}`;
	}

	function fullMonth(date: Date) {
		return new DateFormatter(getLocale(), { month: 'long' }).format(date);
	}

	function fullYear(date: Date) {
		return new DateFormatter(getLocale(), { year: 'numeric' }).format(date);
	}

	function toParts(date: DateValue, options?: Intl.DateTimeFormatOptions) {
		const locale = getLocale();

		if (isZonedDateTime(date)) {
			return new DateFormatter(locale, {
				...options,
				timeZone: date.timeZone,
			}).formatToParts(toDate(date));
		}

		return new DateFormatter(locale, options).formatToParts(toDate(date));
	}

	function dayOfWeek(date: Date, length: Intl.DateTimeFormatOptions['weekday'] = 'narrow') {
		return new DateFormatter(getLocale(), { weekday: length }).format(date);
	}

	function dayPeriod(date: Date, hourCycle: HourCycle | undefined = undefined) {
		const parts = new DateFormatter(getLocale(), {
			hour: 'numeric',
			minute: 'numeric',
			hourCycle: hourCycle === 24 ? 'h23' : undefined,
		}).formatToParts(date);

		const value = parts.find((p) => p.type === 'dayPeriod')?.value;

		if (value === 'PM') return 'PM';
		return 'AM';
	}

	function part(dateObj: DateValue, type: Intl.DateTimeFormatPartTypes, options: Intl.DateTimeFormatOptions = {}) {
		const opts = { ...defaultPartOptions, ...options };
		const parts = toParts(dateObj, opts);
		const part = parts.find((p) => p.type === type);

		return part ? part.value : '';
	}

	return {
		getLocale,
		fullMonth,
		fullYear,
		fullMonthAndYear,
		toParts,
		custom,
		part,
		dayPeriod,
		selectedDate,
		dayOfWeek,
	};
}

export function createTimeFormatter(initialLocale: string) {
	let locale = initialLocale;

	function setLocale(newLocale: string) {
		locale = newLocale;
	}

	function getLocale() {
		return locale;
	}

	function custom(date: Date, options: Intl.DateTimeFormatOptions) {
		return new DateFormatter(locale, options).format(date);
	}

	function selectedTime(date: TimeValue) {
		return custom(toDate(convertTimeValueToDateValue(date)), {
			timeStyle: 'long',
		});
	}

	function toParts(timeValue: TimeValue, options?: Intl.DateTimeFormatOptions) {
		const dateValue = convertTimeValueToDateValue(timeValue);

		if (isZonedDateTime(dateValue)) {
			return new DateFormatter(locale, {
				...options,
				timeZone: dateValue.timeZone,
			}).formatToParts(toDate(dateValue));
		} else {
			return new DateFormatter(locale, options).formatToParts(toDate(dateValue));
		}
	}

	function dayPeriod(date: Date, hourCycle: HourCycle | undefined = undefined) {
		const parts = new DateFormatter(locale, {
			hour: 'numeric',
			minute: 'numeric',
			hourCycle: hourCycle === 24 ? 'h23' : undefined,
		}).formatToParts(date);
		const value = parts.find((p) => p.type === 'dayPeriod')?.value;
		if (value === 'PM') return 'PM';
		return 'AM';
	}

	function part(dateObj: TimeValue, type: Intl.DateTimeFormatPartTypes, options: Intl.DateTimeFormatOptions = {}) {
		const opts = { ...defaultPartOptions, ...options };
		const parts = toParts(dateObj, opts);
		const part = parts.find((p) => p.type === type);
		return part ? part.value : '';
	}

	return {
		setLocale,
		getLocale,
		toParts,
		custom,
		part,
		dayPeriod,
		selectedTime,
	};
}
