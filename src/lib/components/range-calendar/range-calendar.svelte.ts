import { type DateValue, getLocalTimeZone, isSameDay, isSameMonth, isToday } from '@internationalized/date';
import { attachRef, DOMContext, type ReadableBoxedValues, type WritableBoxedValues } from '../../internal/tools/index.js';
import { getCalendarRoot, setCalendarRoot } from '../calendar/calendar.svelte.js';
import type { DateRange, Month } from '../../internal/index.js';
import type { BitsFocusEvent, BitsKeyboardEvent, BitsMouseEvent, RefAttachment, WithRefOpts } from '../../internal/types.js';
import { createId } from '../../internal/create-id.js';
import { boolToStr, boolToEmptyStrOrUndef } from '../../internal/attrs.js';
import { type Announcer, getAnnouncer } from '../../internal/date-time/announcer.js';
import { type Formatter, createFormatter } from '../../internal/date-time/formatter.js';
import {
	calendarAttrs,
	createAccessibleHeading,
	createMonths,
	getCalendarElementProps,
	getCalendarHeadingValue,
	getDefaultYears,
	getIsNextButtonDisabled,
	getIsPrevButtonDisabled,
	getWeekdays,
	handleCalendarKeydown,
	shiftCalendarFocus,
	shiftCalendarPage,
	shiftCalendarYear,
	setCalendarMonth,
	setCalendarYear,
	isOutsideCalendarView,
	useEnsureNonDisabledPlaceholder,
} from '../../internal/date-time/calendar-helpers.svelte.js';
import { areAllDaysBetweenValid, getDateValueType, isAfter, isBefore, isBetweenInclusive, toDate } from '../../internal/date-time/utils.js';
import type { WeekStartsOn } from '../../internal/date-time/types.js';
import { createContext, onMount, untrack } from 'svelte';

const [getRangeCalendarCell, setRangeCalendarCell] = createContext<RangeCalendarCellState>();

interface RangeCalendarRootStateOpts
	extends
		WithRefOpts,
		WritableBoxedValues<{
			value: DateRange;
			placeholder: DateValue;
		}>,
		ReadableBoxedValues<{
			preventDeselect: boolean;
			minValue: DateValue | undefined;
			maxValue: DateValue | undefined;
			disabled: boolean;
			pagedNavigation: boolean;
			weekStartsOn: WeekStartsOn | undefined;
			weekdayFormat: Intl.DateTimeFormatOptions['weekday'];
			isDateDisabled: (date: DateValue) => boolean;
			isDateUnavailable: (date: DateValue) => boolean;
			fixedWeeks: boolean;
			numberOfMonths: number;
			locale: string;
			calendarLabel: string;
			readonly: boolean;
			disableDaysOutsideMonth: boolean;
			excludeDisabled: boolean;
			minDays: number | undefined;
			maxDays: number | undefined;
			/**
			 * This is strictly used by the `DateRangePicker` component to close the popover when a date range
			 * is selected. It is not intended to be used by the user.
			 */
			onRangeSelect?: () => void;
			monthFormat: Intl.DateTimeFormatOptions['month'] | ((month: number) => string);
			yearFormat: Intl.DateTimeFormatOptions['year'] | ((year: number) => string);
		}> {
	defaultPlaceholder: DateValue;
}

export class RangeCalendarRootState {
	static create(opts: RangeCalendarRootStateOpts) {
		return setCalendarRoot(new RangeCalendarRootState(opts));
	}

	readonly opts: RangeCalendarRootStateOpts;
	readonly attachment: RefAttachment;
	readonly visibleMonths = $derived.by(() => this.months.map((month) => month.value));
	/** The month anchoring the view. Owned by navigation; the placeholder follow effect snaps it. */
	#anchor = $state.raw<DateValue | undefined>(undefined);
	readonly months = $derived.by((): Month<DateValue>[] => {
		const anchor = this.#anchor;
		if (!anchor) return [];
		return createMonths({
			dateObj: anchor,
			weekStartsOn: this.opts.weekStartsOn.current,
			locale: this.opts.locale.current,
			fixedWeeks: this.opts.fixedWeeks.current,
			numberOfMonths: this.opts.numberOfMonths.current,
		});
	});
	announcer: Announcer;
	formatter: Formatter;
	accessibleHeadingId: string;
	focusedValue = $state<DateValue | undefined>(undefined);
	lastPressedDateValue: DateValue | undefined = undefined;
	domContext: DOMContext;

	/**
	 * This derived state holds an array of localized day names for the current
	 * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
	 * updating its content when the option changes. Using this state to render the
	 * calendar's days of the week is strongly recommended, as it guarantees that
	 * the days are correctly formatted for the current locale and calendar view.
	 */
	readonly weekdays = $derived.by(() => {
		return getWeekdays({
			months: this.months,
			formatter: this.formatter,
			weekdayFormat: this.opts.weekdayFormat.current,
		});
	});

	/** The in-progress selection cursor IS the bound value — start-only ranges included — so both ends derive from it. */
	readonly startValue = $derived.by(() => this.opts.value.current.start);
	readonly endValue = $derived.by(() => this.opts.value.current.end);

	readonly isStartInvalid = $derived.by(() => {
		if (!this.startValue) return false;
		return this.isDateUnavailable(this.startValue) || this.isDateDisabled(this.startValue);
	});

	readonly isEndInvalid = $derived.by(() => {
		if (!this.endValue) return false;
		return this.isDateUnavailable(this.endValue) || this.isDateDisabled(this.endValue);
	});

	readonly isInvalid = $derived.by(() => {
		if (this.isStartInvalid || this.isEndInvalid) return true;

		if (this.endValue && this.startValue && isBefore(this.endValue, this.startValue))
			return true;

		return false;
	});

	readonly isNextButtonDisabled = $derived.by(() => {
		return getIsNextButtonDisabled({
			maxValue: this.opts.maxValue.current,
			months: this.months,
			disabled: this.opts.disabled.current,
		});
	});

	readonly isPrevButtonDisabled = $derived.by(() => {
		return getIsPrevButtonDisabled({
			minValue: this.opts.minValue.current,
			months: this.months,
			disabled: this.opts.disabled.current,
		});
	});

	readonly headingValue = $derived.by(() => {
		this.opts.monthFormat.current;
		this.opts.yearFormat.current;
		return getCalendarHeadingValue({
			months: this.months,
			formatter: this.formatter,
			locale: this.opts.locale.current,
		});
	});

	readonly fullCalendarLabel = $derived.by(() => `${this.opts.calendarLabel.current} ${this.headingValue}`);

	readonly highlightedRange = $derived.by(() => {
		if (this.startValue && this.endValue) return null;
		if (!this.startValue || !this.focusedValue) return null;

		const isStartBeforeFocused = isBefore(this.startValue, this.focusedValue);
		const start = isStartBeforeFocused ? this.startValue : this.focusedValue;
		const end = isStartBeforeFocused ? this.focusedValue : this.startValue;
		const range = { start, end };

		if (isSameDay(start.add({ days: 1 }), end) || isSameDay(start, end)) {
			return range;
		}

		const isValid = areAllDaysBetweenValid(start, end, this.isDateUnavailable, this.isDateDisabled);

		if (isValid) return range;
		return null;
	});

	readonly initialPlaceholderYear = $derived.by(() => untrack(() => this.opts.placeholder.current.year));

	readonly defaultYears = $derived.by(() => {
		return getDefaultYears({
			minValue: this.opts.minValue.current,
			maxValue: this.opts.maxValue.current,
			placeholderYear: this.initialPlaceholderYear,
		});
	});

	constructor(opts: RangeCalendarRootStateOpts) {
		this.opts = opts;
		this.accessibleHeadingId = createId('heading', opts.id.current);
		this.attachment = attachRef(opts.ref);
		this.domContext = new DOMContext(opts.ref);
		this.announcer = getAnnouncer(null);
		this.formatter = createFormatter({
			locale: this.opts.locale,
			monthFormat: this.opts.monthFormat,
			yearFormat: this.opts.yearFormat,
		});

		this.#anchor = this.opts.placeholder.current;

		this.#setupAccessibleHeadingEffect();

		onMount(() => {
			this.announcer = getAnnouncer(this.domContext.getDocument());
		});

		// Snap the view when the placeholder moves outside it (keyboard nav, dropdowns, external binds).
		$effect(() => {
			const placeholder = this.opts.placeholder.current;
			untrack(() => {
				if (!this.visibleMonths.some((month) => isSameMonth(month, placeholder))) {
					this.#anchor = placeholder;
				}
			});
		});

		/**
		 * Update the accessible heading's text content when the `fullCalendarLabel`
		 * changes.
		 */
		$effect(() => {
			const node = this.domContext.getElementById(this.accessibleHeadingId);
			if (!node) return;
			node.textContent = this.fullCalendarLabel;
		});

		// Snap the visible month to a newly set range start (covers external value writes too).
		$effect(() => {
			const start = this.opts.value.current.start;
			untrack(() => {
				if (start && this.opts.placeholder.current !== start) {
					this.opts.placeholder.current = start;
				}
			});
		});

		/**
		 * Check for disabled dates in the selected range when excludeDisabled is enabled
		 */
		$effect(() => {
			const startValue = this.startValue;
			const endValue = this.endValue;
			const excludeDisabled = this.opts.excludeDisabled.current;
			untrack(() => {
				if (!excludeDisabled || !startValue || !endValue) return;

				if (this.#hasDisabledDatesInRange(startValue, endValue)) {
					this.#setStartValue(undefined);
					this.#setEndValue(undefined);
					this.#announceEmpty();
				}
			});
		});

		this.shiftFocus = this.shiftFocus.bind(this);
		this.handleCellClick = this.handleCellClick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.prevPage = this.prevPage.bind(this);
		this.nextYear = this.nextYear.bind(this);
		this.prevYear = this.prevYear.bind(this);
		this.setYear = this.setYear.bind(this);
		this.setMonth = this.setMonth.bind(this);
		this.isDateDisabled = this.isDateDisabled.bind(this);
		this.isDateUnavailable = this.isDateUnavailable.bind(this);
		this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this);
		this.isSelected = this.isSelected.bind(this);

		useEnsureNonDisabledPlaceholder({
			placeholder: opts.placeholder,
			defaultPlaceholder: opts.defaultPlaceholder,
			isDateDisabled: opts.isDateDisabled,
			maxValue: opts.maxValue,
			minValue: opts.minValue,
			ref: opts.ref,
		});
	}

	#setupAccessibleHeadingEffect() {
		$effect(() => {
			if (!this.opts.ref.current) return;
			const removeHeading = createAccessibleHeading({
				calendarNode: this.opts.ref.current,
				label: untrack(() => this.fullCalendarLabel),
				accessibleHeadingId: this.accessibleHeadingId,
			});
			return removeHeading;
		});
	}

	#updateValue(cb: (value: DateRange) => DateRange) {
		const value = this.opts.value.current;
		const newValue = cb(value);
		this.opts.value.current = newValue;
		if (newValue.start && newValue.end) {
			this.opts.onRangeSelect?.current?.();
		}
	}

	#setStartValue(value: DateValue | undefined) {
		this.#updateValue((prev) => ({
			...prev,
			start: value,
		}));
	}

	#setEndValue(value: DateValue | undefined) {
		this.#updateValue((prev) => ({
			...prev,
			end: value,
		}));
	}

	isOutsideVisibleMonths(date: DateValue) {
		return isOutsideCalendarView(this.visibleMonths, date);
	}

	isDateDisabled(date: DateValue) {
		if (this.opts.isDateDisabled.current(date) || this.opts.disabled.current) return true;
		const minValue = this.opts.minValue.current;
		const maxValue = this.opts.maxValue.current;
		if (minValue && isBefore(date, minValue)) return true;
		if (maxValue && isAfter(date, maxValue)) return true;
		return false;
	}

	isDateUnavailable(date: DateValue) {
		return this.opts.isDateUnavailable.current(date);
	}

	isSelectionStart(date: DateValue) {
		return this.startValue ? isSameDay(date, this.startValue) : false;
	}

	isSelectionEnd(date: DateValue) {
		return this.endValue ? isSameDay(date, this.endValue) : false;
	}

	isSelected(date: DateValue) {
		if (this.startValue && isSameDay(this.startValue, date)) return true;
		if (this.endValue && isSameDay(this.endValue, date)) return true;
		if (this.startValue && this.endValue) {
			return isBetweenInclusive(date, this.startValue, this.endValue);
		}
		return false;
	}

	#isRangeValid(start: DateValue, end: DateValue): boolean {
		// ensure we always use the correct order for calculation
		const orderedStart = isBefore(end, start) ? end : start;
		const orderedEnd = isBefore(end, start) ? start : end;

		const startDate = orderedStart.toDate(getLocalTimeZone());
		const endDate = orderedEnd.toDate(getLocalTimeZone());

		const timeDifference = endDate.getTime() - startDate.getTime();
		const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
		const daysInRange = daysDifference + 1; // +1 to include both start and end days

		if (this.opts.minDays.current && daysInRange < this.opts.minDays.current) return false;
		if (this.opts.maxDays.current && daysInRange > this.opts.maxDays.current) return false;

		// check for disabled dates in range if excludeDisabled is enabled
		if (this.opts.excludeDisabled.current && this.#hasDisabledDatesInRange(orderedStart, orderedEnd)) {
			return false;
		}

		return true;
	}

	shiftFocus(node: HTMLElement, add: number) {
		return shiftCalendarFocus({
			node,
			add,
			placeholder: this.opts.placeholder,
			calendarNode: this.opts.ref.current,
			isPrevButtonDisabled: this.isPrevButtonDisabled,
			isNextButtonDisabled: this.isNextButtonDisabled,
			months: this.months,
			numberOfMonths: this.opts.numberOfMonths.current,
		});
	}

	#announceEmpty() {
		this.announcer.announce('Selected date is now empty.', 'polite');
	}

	#announceSelectedDate(date: DateValue) {
		this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(date, false)}`, 'polite');
	}

	#announceSelectedRange(start: DateValue, end: DateValue) {
		this.announcer.announce(
			`Selected Dates: ${this.formatter.selectedDate(start, false)} to ${this.formatter.selectedDate(end, false)}`,
			'polite',
		);
	}

	handleCellClick(e: Event, date: DateValue) {
		if (this.isDateDisabled(date) || this.isDateUnavailable(date)) return;
		const prevLastPressedDate = this.lastPressedDateValue;
		this.lastPressedDateValue = date;

		if (this.startValue && this.highlightedRange === null) {
			if (isSameDay(this.startValue, date) && !this.opts.preventDeselect.current && !this.endValue) {
				this.#setStartValue(undefined);
				this.opts.placeholder.current = date;
				this.#announceEmpty();
				return;
			} else if (!this.endValue) {
				e.preventDefault();
				if (prevLastPressedDate && isSameDay(prevLastPressedDate, date)) {
					this.#setStartValue(date);
					this.#announceSelectedDate(date);
				}
			}
		}

		if (
			this.startValue &&
			this.endValue &&
			isSameDay(this.endValue, date) &&
			!this.opts.preventDeselect.current
		) {
			this.#setStartValue(undefined);
			this.#setEndValue(undefined);
			this.opts.placeholder.current = date;
			this.#announceEmpty();
			return;
		}

		if (!this.startValue) {
			this.#announceSelectedDate(date);
			this.#setStartValue(date);
		} else if (!this.endValue) {
			// determine the start and end dates for validation
			const startDate = this.startValue;
			const endDate = date;
			const orderedStart = isBefore(endDate, startDate) ? endDate : startDate;
			const orderedEnd = isBefore(endDate, startDate) ? startDate : endDate;

			// check if the range violates constraints
			if (!this.#isRangeValid(orderedStart, orderedEnd)) {
				// reset to just the clicked date
				this.#setStartValue(date);
				this.#setEndValue(undefined);
				this.#announceSelectedDate(date);
			} else {
				// ensure start and end are properly ordered
				if (isBefore(endDate, startDate)) {
					// backward selection - reorder the values
					this.#setStartValue(endDate);
					this.#setEndValue(startDate);
					this.#announceSelectedRange(endDate, startDate);
				} else {
					// forward selection - keep original order
					this.#setEndValue(date);
					this.#announceSelectedRange(this.startValue, date);
				}
			}
		} else if (this.endValue && this.startValue) {
			this.#setEndValue(undefined);
			this.#announceSelectedDate(date);
			this.#setStartValue(date);
		}
	}

	onkeydown(event: BitsKeyboardEvent) {
		return handleCalendarKeydown({
			event,
			handleCellClick: this.handleCellClick,
			placeholderValue: this.opts.placeholder.current,
			shiftFocus: this.shiftFocus,
		});
	}

	/**
	 * Navigates to the next page of the calendar.
	 */
	nextPage() {
		this.#shiftView(1);
	}

	/**
	 * Navigates to the previous page of the calendar.
	 */
	prevPage() {
		this.#shiftView(-1);
	}

	/** Moves the anchor a page (or single month) and keeps the placeholder in the new view. */
	#shiftView(direction: 1 | -1) {
		shiftCalendarPage({
			months: this.months,
			placeholder: this.opts.placeholder,
			pagedNavigation: this.opts.pagedNavigation.current,
			numberOfMonths: this.opts.numberOfMonths.current,
			direction,
			setAnchor: (value) => (this.#anchor = value),
		});
	}

	nextYear() {
		shiftCalendarYear(this.opts.placeholder, 1);
	}

	prevYear() {
		shiftCalendarYear(this.opts.placeholder, -1);
	}

	setYear(year: number) {
		setCalendarYear(this.opts.placeholder, year);
	}

	setMonth(month: number) {
		setCalendarMonth(this.opts.placeholder, month);
	}

	getBitsAttr: (typeof calendarAttrs)['getAttr'] = (part) => {
		return calendarAttrs.getAttr(part, 'range-calendar');
	};

	readonly snippetProps = $derived.by(() => ({
		months: this.months,
		weekdays: this.weekdays,
	}));

	readonly props = $derived.by(
		() =>
			({
				...getCalendarElementProps({
					fullCalendarLabel: this.fullCalendarLabel,
					id: this.opts.id.current,
					isInvalid: this.isInvalid,
					disabled: this.opts.disabled.current,
					readonly: this.opts.readonly.current,
				}),
				[this.getBitsAttr('root')]: '',
				//
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);

	#hasDisabledDatesInRange(start: DateValue, end: DateValue): boolean {
		for (let date = start; isBefore(date, end) || isSameDay(date, end); date = date.add({ days: 1 })) {
			if (this.isDateDisabled(date)) return true;
		}
		return false;
	}
}

interface RangeCalendarCellStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			date: DateValue;
			month: DateValue;
		}> {}

export class RangeCalendarCellState {
	static create(opts: RangeCalendarCellStateOpts) {
		return setRangeCalendarCell(new RangeCalendarCellState(opts, getCalendarRoot() as RangeCalendarRootState));
	}
	readonly opts: RangeCalendarCellStateOpts;
	readonly root: RangeCalendarRootState;
	readonly attachment: RefAttachment;
	readonly cellDate = $derived.by(() => toDate(this.opts.date.current));
	readonly isOutsideMonth = $derived.by(() => !isSameMonth(this.opts.date.current, this.opts.month.current));
	readonly isDisabled = $derived.by(
		() => this.root.isDateDisabled(this.opts.date.current) || (this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current),
	);
	readonly isUnavailable = $derived.by(() => this.root.opts.isDateUnavailable.current(this.opts.date.current));
	readonly isDateToday = $derived.by(() => isToday(this.opts.date.current, getLocalTimeZone()));

	readonly isOutsideVisibleMonths = $derived.by(() => this.root.isOutsideVisibleMonths(this.opts.date.current));
	readonly isFocusedDate = $derived.by(() => isSameDay(this.opts.date.current, this.root.opts.placeholder.current));
	readonly isSelectedDate = $derived.by(() => this.root.isSelected(this.opts.date.current));
	readonly isSelectionStart = $derived.by(() => this.root.isSelectionStart(this.opts.date.current));

	readonly isRangeStart = $derived.by(() => this.root.isSelectionStart(this.opts.date.current));

	readonly isRangeEnd = $derived.by(() => {
		if (!this.root.endValue) return this.root.isSelectionStart(this.opts.date.current);
		return this.root.isSelectionEnd(this.opts.date.current);
	});

	readonly isRangeMiddle = $derived.by(() => this.isSelectionMiddle);

	readonly isSelectionMiddle = $derived.by(() => {
		return this.isSelectedDate && !this.isSelectionStart && !this.isSelectionEnd;
	});

	readonly isSelectionEnd = $derived.by(() => this.root.isSelectionEnd(this.opts.date.current));
	readonly isHighlighted = $derived.by(() =>
		this.root.highlightedRange
			? isBetweenInclusive(this.opts.date.current, this.root.highlightedRange.start, this.root.highlightedRange.end)
			: false,
	);

	readonly labelText = $derived.by(() =>
		this.root.formatter.custom(this.cellDate, {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}),
	);

	constructor(opts: RangeCalendarCellStateOpts, root: RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
	}

	readonly snippetProps = $derived.by(() => ({
		disabled: this.isDisabled,
		unavailable: this.isUnavailable,
		selected: this.isSelectedDate,
	}));

	readonly ariaDisabled = $derived.by(() => {
		return this.isDisabled || (this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current) || this.isUnavailable;
	});

	readonly sharedDataAttrs = $derived.by(
		() =>
			({
				'data-unavailable': boolToEmptyStrOrUndef(this.isUnavailable),
				'data-today': this.isDateToday ? '' : undefined,
				'data-outside-month': this.isOutsideMonth ? '' : undefined,
				'data-outside-visible-months': this.isOutsideVisibleMonths ? '' : undefined,
				'data-focused': this.isFocusedDate ? '' : undefined,
				'data-selection-start': this.isSelectionStart ? '' : undefined,
				'data-selection-end': this.isSelectionEnd ? '' : undefined,
				'data-range-start': this.isRangeStart ? '' : undefined,
				'data-range-end': this.isRangeEnd ? '' : undefined,
				'data-range-middle': this.isRangeMiddle ? '' : undefined,
				'data-highlighted': this.isHighlighted ? '' : undefined,
				'data-selected': boolToEmptyStrOrUndef(this.isSelectedDate),
				'data-value': this.opts.date.current.toString(),
				'data-type': getDateValueType(this.opts.date.current),
				'data-disabled': boolToEmptyStrOrUndef(this.isDisabled || (this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)),
			}) as const,
	);

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'gridcell',
				'aria-selected': boolToStr(this.isSelectedDate),
				'aria-disabled': boolToStr(this.ariaDisabled),
				...this.sharedDataAttrs,
				[this.root.getBitsAttr('cell')]: '',
				...this.attachment,
			}) as const,
	);
}

interface RangeCalendarDayStateOpts extends WithRefOpts {}

export class RangeCalendarDayState {
	static create(opts: RangeCalendarDayStateOpts) {
		return new RangeCalendarDayState(opts, getRangeCalendarCell());
	}

	readonly opts: RangeCalendarDayStateOpts;
	readonly cell: RangeCalendarCellState;
	readonly attachment: RefAttachment;

	constructor(opts: RangeCalendarDayStateOpts, cell: RangeCalendarCellState) {
		this.opts = opts;
		this.cell = cell;
		this.attachment = attachRef(opts.ref);

		this.onclick = this.onclick.bind(this);
		this.onmouseenter = this.onmouseenter.bind(this);
		this.onfocusin = this.onfocusin.bind(this);
	}

	readonly #tabindex = $derived.by(() =>
		(this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current) || this.cell.isDisabled
			? undefined
			: this.cell.isFocusedDate
				? 0
				: -1,
	);

	onclick(e: BitsMouseEvent) {
		if (this.cell.isDisabled) return;
		this.cell.root.handleCellClick(e, this.cell.opts.date.current);
	}

	onmouseenter(_: BitsMouseEvent) {
		if (this.cell.isDisabled) return;
		this.cell.root.focusedValue = this.cell.opts.date.current;
	}

	onfocusin(_: BitsFocusEvent) {
		if (this.cell.isDisabled) return;
		this.cell.root.focusedValue = this.cell.opts.date.current;
	}

	readonly snippetProps = $derived.by(() => ({
		disabled: this.cell.isDisabled,
		unavailable: this.cell.isUnavailable,
		selected: this.cell.isSelectedDate,
		day: `${this.cell.opts.date.current.day}`,
	}));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'button',
				'aria-label': this.cell.labelText,
				'aria-disabled': boolToStr(this.cell.ariaDisabled),
				...this.cell.sharedDataAttrs,
				tabindex: this.#tabindex,
				[this.cell.root.getBitsAttr('day')]: '',
				// Shared logic for range calendar and calendar
				'data-bits-day': '',
				//
				onclick: this.onclick,
				onmouseenter: this.onmouseenter,
				onfocusin: this.onfocusin,
				...this.attachment,
			}) as const,
	);
}
