import { DateFormatter, type DateValue } from '@internationalized/date';
import { hasTime, isZonedDateTime, toDate } from './utils.js';
import type { HourCycle, TimeValue } from '../../internal/date-time/types.js';
import { convertTimeValueToDateValue } from './field/time-helpers.js';
import type { ReadableBox } from '../../internal/tools/index.js';

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

const partsFor = (locale: string, dv: DateValue, options?: Intl.DateTimeFormatOptions) =>
	new DateFormatter(locale, isZonedDateTime(dv) ? { ...options, timeZone: dv.timeZone } : options).formatToParts(toDate(dv));

const customFor = (getLocale: () => string) => (date: Date, options: Intl.DateTimeFormatOptions) =>
	new DateFormatter(getLocale(), options).format(date);

const dayPeriodFor = (getLocale: () => string) => (date: Date, hourCycle?: HourCycle) =>
	new DateFormatter(getLocale(), { hour: 'numeric', minute: 'numeric', hourCycle: hourCycle === 24 ? 'h23' : undefined })
		.formatToParts(date)
		.find((p) => p.type === 'dayPeriod')?.value === 'PM'
		? 'PM'
		: 'AM';

const partFor =
	<T>(toParts: (o: T, opts?: Intl.DateTimeFormatOptions) => Intl.DateTimeFormatPart[]) =>
	(obj: T, type: Intl.DateTimeFormatPartTypes, options: Intl.DateTimeFormatOptions = {}) =>
		toParts(obj, { ...defaultPartOptions, ...options }).find((p) => p.type === type)?.value ?? '';

type CreateFormatterOptions = {
	locale: ReadableBox<string>;
	monthFormat: ReadableBox<Intl.DateTimeFormatOptions['month'] | ((month: number) => string)>;
	yearFormat: ReadableBox<Intl.DateTimeFormatOptions['year'] | ((year: number) => string)>;
};

export function createFormatter(opts: CreateFormatterOptions) {
	const getLocale = () => opts.locale.current;
	const custom = customFor(getLocale);
	const dayPeriod = dayPeriodFor(getLocale);
	const toParts = (date: DateValue, options?: Intl.DateTimeFormatOptions) => partsFor(getLocale(), date, options);
	const part = partFor(toParts);

	const selectedDate = (date: DateValue, includeTime = true) =>
		custom(toDate(date), hasTime(date) && includeTime ? { dateStyle: 'long', timeStyle: 'long' } : { dateStyle: 'long' });

	const fullMonth = (date: Date) => new DateFormatter(getLocale(), { month: 'long' }).format(date);
	const fullYear = (date: Date) => new DateFormatter(getLocale(), { year: 'numeric' }).format(date);
	const dayOfWeek = (date: Date, length: Intl.DateTimeFormatOptions['weekday'] = 'narrow') =>
		new DateFormatter(getLocale(), { weekday: length }).format(date);

	function fullMonthAndYear(date: Date) {
		const locale = getLocale();
		const monthFormat = opts.monthFormat.current;
		const yearFormat = opts.yearFormat.current;
		if (typeof monthFormat !== 'function' && typeof yearFormat !== 'function') {
			return new DateFormatter(locale, { month: monthFormat, year: yearFormat }).format(date);
		}
		const month =
			typeof monthFormat === 'function' ? monthFormat(date.getMonth() + 1) : new DateFormatter(locale, { month: monthFormat }).format(date);
		const year =
			typeof yearFormat === 'function' ? yearFormat(date.getFullYear()) : new DateFormatter(locale, { year: yearFormat }).format(date);
		return `${month} ${year}`;
	}

	return { getLocale, fullMonth, fullYear, fullMonthAndYear, toParts, custom, part, dayPeriod, selectedDate, dayOfWeek };
}

export function createTimeFormatter(initialLocale: string) {
	let locale = initialLocale;
	const getLocale = () => locale;
	const setLocale = (l: string) => void (locale = l);
	const custom = customFor(getLocale);
	const dayPeriod = dayPeriodFor(getLocale);
	const toParts = (tv: TimeValue, options?: Intl.DateTimeFormatOptions) => partsFor(getLocale(), convertTimeValueToDateValue(tv), options);
	const part = partFor(toParts);
	const selectedTime = (date: TimeValue) => custom(toDate(convertTimeValueToDateValue(date)), { timeStyle: 'long' });

	return { setLocale, getLocale, toParts, custom, part, dayPeriod, selectedTime };
}
