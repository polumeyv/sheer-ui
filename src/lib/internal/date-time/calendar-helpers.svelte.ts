import { type DateValue, endOfMonth, isSameDay, isSameMonth, startOfMonth } from '@internationalized/date';
import { type ReadableBox, type WritableBox, srOnlyStylesString } from '../tools/index.js';
import { tick, untrack } from 'svelte';
import {
	getDaysInMonth,
	getLastFirstDayOfWeek,
	getNextLastDayOfWeek,
	hasTime,
	isAfter,
	isBefore,
	parseAnyDateValue,
	parseStringToDateValue,
	toDate,
} from './utils.js';
import type { Formatter } from './formatter.js';
import { createBitsAttrs, boolToEmptyStrOrUndef } from '../attrs.js';
import { chunk, isValidIndex } from '../arrays.js';
import { isHTMLElement } from '../tools/utils/dom.js';
import { BROWSER } from 'esm-env';
import { kbd, SELECTION_KEYS } from '../kbd.js';
import type { DateMatcher, Month } from '../index.js';

/** Is `node` a calendar cell? */
export const isCalendarDayNode = (node: unknown): node is HTMLElement => isHTMLElement(node) && node.hasAttribute('data-bits-day');

/** Date values strictly between `start` and `end` (exclusive of both). */
export const getDaysBetween = (start: DateValue, end: DateValue) => {
	const days: DateValue[] = [];
	for (let d = start.add({ days: 1 }); d.compare(end) < 0; d = d.add({ days: 1 })) days.push(d);
	return days;
};

export type CreateMonthProps = {
	dateObj: DateValue;
	/** 0 = Sunday, 1 = Monday, etc. */
	weekStartsOn: number | undefined;
	/** Always render 6 weeks, even if the month doesn't span that many. */
	fixedWeeks: boolean;
	locale: string;
};

/**
 * Builds a `{ value, dates, weeks }` calendar-month object: `value` is the month's
 * date, `dates` is every day shown (including lead/trail days from neighboring
 * months), `weeks` chunks those into rows of 7 for grid rendering.
 */
function createMonth({ dateObj, weekStartsOn, fixedWeeks, locale }: CreateMonthProps): Month<DateValue> {
	const datesArray = Array.from({ length: getDaysInMonth(dateObj) }, (_, i) => dateObj.set({ day: i + 1 }));
	const firstDayOfMonth = startOfMonth(dateObj);
	const lastDayOfMonth = endOfMonth(dateObj);

	const [weekStart, weekLocale] = weekStartsOn !== undefined ? [weekStartsOn, 'en-US'] : [0, locale];
	const lastSunday = getLastFirstDayOfWeek(firstDayOfMonth, weekStart, weekLocale);
	const nextSaturday = getNextLastDayOfWeek(lastDayOfMonth, weekStart, weekLocale);

	const lastMonthDays = getDaysBetween(lastSunday.subtract({ days: 1 }), firstDayOfMonth);
	const nextMonthDays = getDaysBetween(lastDayOfMonth, nextSaturday.add({ days: 1 }));

	const totalDays = lastMonthDays.length + datesArray.length + nextMonthDays.length;

	if (fixedWeeks && totalDays < 42) {
		const extraDays = 42 - totalDays;
		const startFrom = nextMonthDays.at(-1) ?? dateObj.add({ months: 1 }).set({ day: 1 });
		const wasEmpty = nextMonthDays.length === 0;
		if (wasEmpty) nextMonthDays.push(startFrom);
		nextMonthDays.push(...Array.from({ length: wasEmpty ? extraDays - 1 : extraDays }, (_, i) => startFrom.add({ days: i + 1 })));
	}

	const allDays = lastMonthDays.concat(datesArray, nextMonthDays);
	return { value: dateObj, dates: allDays, weeks: chunk(allDays, 7) };
}

type SetMonthProps = CreateMonthProps & { numberOfMonths: number | undefined; currentMonths?: Month<DateValue>[] };

export const createMonths = ({ numberOfMonths = 1, dateObj, ...monthProps }: SetMonthProps) => {
	const months = [createMonth({ ...monthProps, dateObj })];
	for (let i = 1; i < numberOfMonths; i++) months.push(createMonth({ ...monthProps, dateObj: dateObj.add({ months: i }) }));
	return months;
};

type ShiftCalendarPageProps = {
	months: Month<DateValue>[];
	placeholder: WritableBox<DateValue>;
	pagedNavigation: boolean;
	numberOfMonths: number;
	direction: 1 | -1;
	setAnchor: (value: DateValue) => void;
};

export function shiftCalendarPage({ months, placeholder, pagedNavigation, numberOfMonths, direction, setAnchor }: ShiftCalendarPageProps) {
	const first = months[0]?.value;
	if (!first) return;
	const step = pagedNavigation ? numberOfMonths : 1;
	const target = direction === 1 ? first.add({ months: step }) : first.subtract({ months: step });
	setAnchor(target);
	placeholder.current = target;
}

export const shiftCalendarYear = (placeholder: WritableBox<DateValue>, years: number) =>
	(placeholder.current = placeholder.current.add({ years }));

export const setCalendarYear = (placeholder: WritableBox<DateValue>, year: number) =>
	(placeholder.current = placeholder.current.set({ year }));

export const setCalendarMonth = (placeholder: WritableBox<DateValue>, month: number) =>
	(placeholder.current = placeholder.current.set({ month }));

export const isOutsideCalendarView = (visibleMonths: DateValue[], date: DateValue) =>
	!visibleMonths.some((month) => isSameMonth(date, month));

export const getSelectableCells = (calendarNode: HTMLElement | null) =>
	calendarNode
		? Array.from(calendarNode.querySelectorAll('[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])')).filter(
				isHTMLElement,
			)
		: [];

/** Reads `data-value` off `node` and writes it into `placeholder`. Shared by calendar + range calendar. */
export const setPlaceholderToNodeValue = (node: HTMLElement, placeholder: WritableBox<DateValue>) => {
	const cellValue = node.getAttribute('data-value');
	if (cellValue) placeholder.current = parseStringToDateValue(cellValue, placeholder.current);
};

type ShiftCalendarFocusProps = {
	node: HTMLElement;
	add: number;
	placeholder: WritableBox<DateValue>;
	calendarNode: HTMLElement | null;
	isPrevButtonDisabled: boolean;
	isNextButtonDisabled: boolean;
	months: Month<DateValue>[];
	numberOfMonths: number;
};

/** Shared logic for shifting focus between cells in the calendar and range calendar. */
export function shiftCalendarFocus({
	node,
	add,
	placeholder,
	calendarNode,
	isPrevButtonDisabled,
	isNextButtonDisabled,
	months,
	numberOfMonths,
}: ShiftCalendarFocusProps) {
	const candidateCells = getSelectableCells(calendarNode);
	if (!candidateCells.length) return;

	const nextIndex = candidateCells.indexOf(node) + add;

	// Easy case: next cell is within the displayed range.
	if (isValidIndex(nextIndex, candidateCells)) {
		const nextCell = candidateCells[nextIndex]!;
		setPlaceholderToNodeValue(nextCell, placeholder);
		return nextCell.focus();
	}

	// Overflowed the displayed cells — shift a month and refetch.
	const goingBack = nextIndex < 0;
	if (goingBack ? isPrevButtonDisabled : isNextButtonDisabled) return;

	const firstMonth = months[0]?.value;
	if (!firstMonth) return;

	placeholder.current = goingBack ? firstMonth.subtract({ months: numberOfMonths }) : firstMonth.add({ months: numberOfMonths });

	// Without a tick here, it seems to be too quick for the DOM to update
	tick().then(() => {
		const newCandidateCells = getSelectableCells(calendarNode);
		if (!newCandidateCells.length) return;

		const newIndex = goingBack ? newCandidateCells.length - Math.abs(nextIndex) : nextIndex - candidateCells.length;
		if (!isValidIndex(newIndex, newCandidateCells)) return;

		const newCell = newCandidateCells[newIndex]!;
		// NOTE: original only synced placeholder on the "going back" path — preserved as-is.
		if (goingBack) setPlaceholderToNodeValue(newCell, placeholder);
		return newCell.focus();
	});
}

type HandleCalendarKeydownProps = {
	event: KeyboardEvent;
	handleCellClick: (event: Event, date: DateValue) => void;
	shiftFocus: (node: HTMLElement, add: number) => void;
	placeholderValue: DateValue;
};
const ARROW_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.ARROW_LEFT, kbd.ARROW_RIGHT] as const;
const kbdFocusMap: Record<(typeof ARROW_KEYS)[number], number> = {
	[kbd.ARROW_DOWN]: 7,
	[kbd.ARROW_UP]: -7,
	[kbd.ARROW_LEFT]: -1,
	[kbd.ARROW_RIGHT]: 1,
};

/** Shared keyboard event handler for the calendar and range calendar. */
export function handleCalendarKeydown({ event, handleCellClick, shiftFocus, placeholderValue }: HandleCalendarKeydownProps) {
	const currentCell = event.target;
	if (!isCalendarDayNode(currentCell)) return;
	// oxlint-disable-next-line no-explicit-any
	const isArrow = ARROW_KEYS.includes(event.key as any);
	if (!isArrow && !SELECTION_KEYS.includes(event.key)) return;

	event.preventDefault();

	if (isArrow) {
		const add = kbdFocusMap[event.key as (typeof ARROW_KEYS)[number]];
		if (add !== undefined) shiftFocus(currentCell, add);
		return;
	}

	const cellValue = currentCell.getAttribute('data-value');
	if (cellValue) handleCellClick(event, parseStringToDateValue(cellValue, placeholderValue));
}

type GetWeekdaysProps = { months: Month<DateValue>[]; weekdayFormat: Intl.DateTimeFormatOptions['weekday']; formatter: Formatter };

export const getWeekdays = ({ months, formatter, weekdayFormat }: GetWeekdaysProps) =>
	(months[0]?.weeks[0] ?? []).map((date) => formatter.dayOfWeek(toDate(date), weekdayFormat));

type CreateAccessibleHeadingProps = { calendarNode: HTMLElement; label: string; accessibleHeadingId: string };

/** Creates a visually-hidden accessible heading for the calendar. Returns a cleanup fn. */
export function createAccessibleHeading({ calendarNode, label, accessibleHeadingId }: CreateAccessibleHeadingProps) {
	const doc = calendarNode.ownerDocument;
	const div = doc.createElement('div');
	div.style.cssText = srOnlyStylesString;

	const h2 = doc.createElement('h2');
	Object.assign(h2, {
		textContent: label,
		id: accessibleHeadingId,
		ariaLive: 'polite',
		ariaAtomic: 'true',
	});

	calendarNode.insertBefore(div, calendarNode.firstChild);
	div.appendChild(h2);

	return () => {
		const heading = doc.getElementById(accessibleHeadingId);
		if (!heading) return;
		div.remove();
		heading.remove();
	};
}

type GetIsNextButtonDisabledProps = { maxValue: DateValue | undefined; months: Month<DateValue>[]; disabled: boolean };

export function getIsNextButtonDisabled({ maxValue, months, disabled }: GetIsNextButtonDisabledProps) {
	if (!maxValue || !months.length) return false;
	if (disabled) return true;
	const lastMonth = months.at(-1)?.value;
	return lastMonth ? isAfter(lastMonth.add({ months: 1 }).set({ day: 1 }), maxValue) : false;
}

type GetIsPrevButtonDisabledProps = { minValue: DateValue | undefined; months: Month<DateValue>[]; disabled: boolean };

export function getIsPrevButtonDisabled({ minValue, months, disabled }: GetIsPrevButtonDisabledProps) {
	if (!minValue || !months.length) return false;
	if (disabled) return true;
	const firstMonth = months[0]?.value;
	return firstMonth ? isBefore(firstMonth.subtract({ months: 1 }).set({ day: 35 }), minValue) : false;
}

type GetCalendarHeadingValueProps = { months: Month<DateValue>[]; formatter: Formatter; locale: string };

export function getCalendarHeadingValue({ months, formatter }: GetCalendarHeadingValueProps) {
	if (!months.length) return '';

	const startMonth = toDate(months[0]!.value);
	if (months.length === 1) return formatter.fullMonthAndYear(startMonth);

	const endMonth = toDate(months.at(-1)!.value);
	const startMonthName = formatter.fullMonth(startMonth);
	const endMonthName = formatter.fullMonth(endMonth);
	const startYear = formatter.fullYear(startMonth);
	const endYear = formatter.fullYear(endMonth);

	return startYear === endYear
		? `${startMonthName} - ${endMonthName} ${endYear}`
		: `${startMonthName} ${startYear} - ${endMonthName} ${endYear}`;
}

type GetCalendarElementProps = { fullCalendarLabel: string; id: string; isInvalid: boolean; disabled: boolean; readonly: boolean };

export const getCalendarElementProps = ({ fullCalendarLabel, id, isInvalid, disabled, readonly }: GetCalendarElementProps) =>
	({
		id,
		role: 'application',
		'aria-label': fullCalendarLabel,
		'data-invalid': boolToEmptyStrOrUndef(isInvalid),
		'data-disabled': boolToEmptyStrOrUndef(disabled),
		'data-readonly': boolToEmptyStrOrUndef(readonly),
	}) as const;

export type CalendarParts =
	| 'root'
	| 'grid'
	| 'cell'
	| 'next-button'
	| 'prev-button'
	| 'day'
	| 'grid-body'
	| 'grid-head'
	| 'grid-row'
	| 'head-cell'
	| 'header'
	| 'heading'
	| 'month-select'
	| 'year-select';

export function pickerOpenFocus(e: Event) {
	const doc = (e.target as HTMLElement).ownerDocument;
	const nodeToFocus = doc.querySelector<HTMLElement>('[data-bits-day][data-focused]');
	if (!nodeToFocus) return;
	e.preventDefault();
	nodeToFocus.focus();
}

export function getFirstNonDisabledDateInView(calendarRef: HTMLElement): DateValue | undefined {
	if (!BROWSER) return;
	const [el] = calendarRef.querySelectorAll<HTMLElement>('[data-bits-day]:not([aria-disabled=true])');
	const value = el?.getAttribute('data-value');
	const type = el?.getAttribute('data-type');
	if (!value || !type) return;
	return parseAnyDateValue(value, type);
}

/** Keeps the placeholder off disabled dates, so keyboard users always have a focusable cell. */
export function useEnsureNonDisabledPlaceholder({
	ref,
	placeholder,
	defaultPlaceholder,
	minValue,
	maxValue,
	isDateDisabled,
}: {
	ref: WritableBox<HTMLElement | null>;
	placeholder: WritableBox<DateValue | undefined>;
	isDateDisabled: ReadableBox<DateMatcher>;
	minValue: ReadableBox<DateValue | undefined>;
	maxValue: ReadableBox<DateValue | undefined>;
	defaultPlaceholder: DateValue;
}) {
	const isDisabled = (date: DateValue) =>
		isDateDisabled.current(date) ||
		(!!minValue.current && isBefore(date, minValue.current)) ||
		(!!maxValue.current && isBefore(maxValue.current, date));

	$effect(() => {
		ref.current;
		untrack(() => {
			if (!ref.current) return;
			// If the placeholder is still the (disabled) default, swap it for the
			// first available date in view so the calendar remains keyboard-reachable.
			// If every date in view is disabled, that's a dev-side config error.
			if (placeholder.current && isSameDay(placeholder.current, defaultPlaceholder) && isDisabled(defaultPlaceholder)) {
				placeholder.current = getFirstNonDisabledDateInView(ref.current) ?? defaultPlaceholder;
			}
		});
	});
}

export const getDateWithPreviousTime = (date: DateValue | undefined, prev: DateValue | undefined) =>
	date && prev && hasTime(date) && hasTime(prev)
		? date.set({ hour: prev.hour, minute: prev.minute, millisecond: prev.millisecond, second: prev.second })
		: date;

export const calendarAttrs = createBitsAttrs({
	component: 'calendar',
	parts: [
		'root',
		'grid',
		'cell',
		'next-button',
		'prev-button',
		'day',
		'grid-body',
		'grid-head',
		'grid-row',
		'head-cell',
		'header',
		'heading',
		'month-select',
		'year-select',
	],
});

type GetDefaultYearsProps = { placeholderYear: number; minValue: DateValue | undefined; maxValue: DateValue | undefined };

export function getDefaultYears(opts: GetDefaultYearsProps) {
	const latestYear = Math.max(opts.placeholderYear, new Date().getFullYear());
	const initialMinYear = latestYear - 100;
	const minYear = opts.minValue?.year ?? (opts.placeholderYear < initialMinYear ? opts.placeholderYear - 10 : initialMinYear);
	const maxYear = opts.maxValue?.year ?? latestYear + 10;
	const start = Math.min(minYear, maxYear);
	return Array.from({ length: maxYear - start + 1 }, (_, i) => start + i);
}
