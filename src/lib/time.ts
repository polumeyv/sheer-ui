/**
 * Wall-clock time helpers + duration display over plain ISO 8601 "HH:MM" strings. Pure, zone-free minute math.
 * The time-picker block's currency, and the display door every consumer renders wall-clock through.
 */

/** "HH:MM" → minutes since midnight. Extra `:SS` is ignored rather than rejected — the booking grid is whole minutes. */
export const timeToMinutes = (time: string): number => {
	const [h = 0, m = 0] = time.split(':').map(Number);
	return h * 60 + m;
};

/** Non-throwing {@link timeToMinutes}: `null` unless `time` is "HH:MM" (with the same tolerated `:SS`) — the
 *  lenient seam for free-form strings that were never decoded through the `TimeString` brand. */
export const tryTimeToMinutes = (time: string): number | null => (/^\d{2}:\d{2}(:\d{2})?$/.test(time) ? timeToMinutes(time) : null);

/** Minutes since midnight → "HH:MM", wrapping at midnight in either direction (1440 → "00:00", -30 → "23:30"). */
export const minutesToTime = (minutes: number): string => {
	const min = ((minutes % 1440) + 1440) % 1440;
	return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
};

/** Both wall-clock currencies: the "HH:MM" wire form, or minutes since midnight from compute code. */
const asMinutes = (time: string | number): number => (typeof time === 'number' ? time : timeToMinutes(time));

/** Wall-clock time → a UTC instant on the epoch day, ready for the UTC formatter. */
const timeToDate = (time: string | number) => new Date(asMinutes(time) * 60_000);

const timeFormatters = {
	12: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }),
	// hourCycle, not `hour12: false`: Chrome (per the ECMA-402 spec) resolves the latter to h24, rendering midnight "24:30".
	24: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hourCycle: 'h23', timeZone: 'UTC' }),
};

/** Wall-clock time ("HH:MM" or minutes) → "9:30 AM", or "09:30" with 24-hour display enabled. */
export const formatTimeDisplay = (time: string | number, options: { use24Hour?: boolean } = {}): string =>
	timeFormatters[options.use24Hour ? 24 : 12].format(timeToDate(time));

/** Wall-clock pair ("HH:MM" or minutes) → "9:30 – 10:15 AM" (locale-aware range). Ranges crossing midnight use
 *  individually formatted endpoints so `Intl.formatRange` cannot add calendar dates. */
export const formatTimeRange = (start: string | number, end: string | number): string =>
	asMinutes(end) < asMinutes(start)
		? `${formatTimeDisplay(start)} – ${formatTimeDisplay(end)}`
		: timeFormatters[12].formatRange(timeToDate(start), timeToDate(end));

/**
 * The three duration styles, and where each belongs — the style is required so a call site states which
 * register it is writing in rather than inheriting whichever helper it happened to import:
 *
 * - `compact` — "45m" / "1h 30m". Dense UI chrome where the unit is obvious from context (the time picker).
 * - `short` — "30 min" / "1 hr 30 min". Every domain length: service duration, booking length, buffer.
 * - `long` — "5 minutes" / "2 hours". Prose, where the duration sits inside a sentence.
 */
export type DurationStyle = 'compact' | 'short' | 'long';

const UNITS = {
	compact: { gap: '', hour: ['h', 'h'], minute: ['m', 'm'] },
	short: { gap: ' ', hour: ['hr', 'hrs'], minute: ['min', 'min'] },
	long: { gap: ' ', hour: ['hour', 'hours'], minute: ['minute', 'minutes'] },
} as const satisfies Record<DurationStyle, { gap: string; hour: readonly [string, string]; minute: readonly [string, string] }>;

/** A length in whole minutes, rendered in one of the {@link DurationStyle}s. */
export const formatDuration = (minutes: number, style: DurationStyle): string => {
	const { gap, hour, minute } = UNITS[style];
	const unit = (n: number, [one, many]: readonly [string, string]) => `${n}${gap}${n === 1 ? one : many}`;

	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	if (h === 0) return unit(m, minute);
	return m === 0 ? unit(h, hour) : `${unit(h, hour)} ${unit(m, minute)}`;
};
