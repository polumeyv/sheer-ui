/**
 * Time-slot helpers for the time-picker components — comparison, duration, and slot generation over
 * ISO 8601 "HH:MM" wall-clock strings. UI-internal; the minute math and `formatTimeDisplay` (the wire/display
 * formatter) live in `@polumeyv/utilities`, the zero-dependency pure-TS layer this package builds on.
 */
import { timeToMinutes, minutesToTime, formatTimeDisplay } from '@polumeyv/utilities';

export type TimeSlot = { value: string; label: string };
export type SlotRange = { start: string; end: string };
export type TimeSlotPreset = 'business' | 'extended' | 'full' | 'custom';

/** Non-throwing parse of an ISO 8601 "HH:MM" wall-clock string → minutes since midnight, or null if malformed.
 *  The regex IS the brand's validation, so the cast is sound — this is the lenient seam for free-form props. */
const toMin = (time: string): number | null => /^\d{2}:\d{2}(:\d{2})?$/.test(time) ? timeToMinutes(time) : null;

/** Sign of (time1 − time2): negative if earlier, 0 if equal or either is malformed, positive if later. */
export function compareTime(time1: string, time2: string): number {
	const a = toMin(time1);
	const b = toMin(time2);
	if (a === null || b === null) return 0;
	return a - b;
}

export const isTimeInRange = (time: string, minTime: string, maxTime: string): boolean =>
	compareTime(time, minTime) >= 0 && compareTime(time, maxTime) <= 0;

/** Duration in minutes from startTime to endTime (0 if either is malformed). */
export function getTimeDuration(startTime: string, endTime: string): number {
	const start = toMin(startTime);
	const end = toMin(endTime);
	if (start === null || end === null) return 0;
	return end - start;
}

export function generateTimeSlots(startHour: number, endHour: number, interval: number): TimeSlot[] {
	const slots: TimeSlot[] = [];
	const span = (endHour - startHour) * 60;
	// `elapsed` bounds the loop in minutes (so endHour === 24 works); `minutesToTime` wraps at midnight
	// and zero-pads for us.
	for (let elapsed = 0; elapsed < span; elapsed += interval) {
		const value = minutesToTime(startHour * 60 + elapsed);
		slots.push({ value, label: formatTimeDisplay(value) });
	}
	return slots;
}

export const b_HOURS: TimeSlot[] = generateTimeSlots(9, 17, 60);
export const EXTENDED_HOURS: TimeSlot[] = generateTimeSlots(7, 21, 60);

type ResolveTimeSlotsOptions = {
	slots: TimeSlot[] | undefined;
	preset: TimeSlotPreset;
	interval: number;
	startHour: number;
	endHour: number;
};

export const resolveTimeSlots = ({ slots, preset, interval, startHour, endHour }: ResolveTimeSlotsOptions) => {
	if (slots) return slots;
	if (preset === 'business') return b_HOURS;
	if (preset === 'extended') return EXTENDED_HOURS;
	return preset === 'full' ? generateTimeSlots(0, 24, interval) : generateTimeSlots(startHour, endHour, interval);
};
