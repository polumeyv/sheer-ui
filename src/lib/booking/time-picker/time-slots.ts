/**
 * Time-slot helpers for the time-picker components — comparison, duration, and slot generation over
 * ISO 8601 "HH:MM" wall-clock strings. UI-internal; `formatTimeDisplay` (the wire/display formatter) stays in
 * `@polumeyv/lib/public` since apps render times directly.
 */
import { parseTime, Time } from '@internationalized/date';
import { formatTimeDisplay } from '@polumeyv/lib/public';

export type TimeSlot = { value: string; label: string };
export type TimeRange = { start: string; end: string };

/** Non-throwing parse of an ISO 8601 "HH:MM" wall-clock string → Time, or null if malformed. */
function toTime(time: string): Time | null {
	try {
		return parseTime(time);
	} catch {
		return null;
	}
}

/** Sign of (time1 − time2): negative if earlier, 0 if equal or either is malformed, positive if later. */
export function compareTime(time1: string, time2: string): number {
	const a = toTime(time1);
	const b = toTime(time2);
	if (!a || !b) return 0;
	return a.compare(b);
}

export function isTimeInRange(time: string, minTime: string, maxTime: string): boolean {
	return compareTime(time, minTime) >= 0 && compareTime(time, maxTime) <= 0;
}

/** Duration in minutes from startTime to endTime (0 if either is malformed). */
export function getTimeDuration(startTime: string, endTime: string): number {
	const start = toTime(startTime);
	const end = toTime(endTime);
	if (!start || !end) return 0;
	return end.hour * 60 + end.minute - (start.hour * 60 + start.minute);
}

export function formatDuration(minutes: number): string {
	if (minutes < 60) return `${minutes}m`;
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function generateTimeSlots(startHour: number, endHour: number, interval: number): TimeSlot[] {
	const slots: TimeSlot[] = [];
	const span = (endHour - startHour) * 60;
	// `elapsed` bounds the loop in minutes (so endHour === 24 works); `t` advances via Time.add,
	// which balances across the hour and wraps at midnight — its toString() zero-pads for us.
	let t = new Time(startHour);
	for (let elapsed = 0; elapsed < span; elapsed += interval) {
		const value = t.toString().slice(0, 5);
		slots.push({ value, label: formatTimeDisplay(value) });
		t = t.add({ minutes: interval });
	}
	return slots;
}

export const b_HOURS: TimeSlot[] = generateTimeSlots(9, 17, 60);
export const EXTENDED_HOURS: TimeSlot[] = generateTimeSlots(7, 21, 60);
