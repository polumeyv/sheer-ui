/**
 * Time-slot helpers for the time-picker components — comparison, duration, and slot generation over
 * ISO 8601 "HH:MM" wall-clock strings. Block-internal; the minute math and `formatTimeDisplay` (the
 * wire/display formatter) live in `../../time`.
 */
import { tryTimeToMinutes, minutesToTime, formatTimeDisplay } from '../../time';

export type TimeSlot = { value: string; label: string };
export type SlotRange = { start: string; end: string };
export type TimeSlotPreset = 'business' | 'extended' | 'full' | 'custom';

/** Sign of (time1 − time2): negative if earlier, 0 if equal or either is malformed, positive if later. */
export function compareTime(time1: string, time2: string): number {
	const a = tryTimeToMinutes(time1);
	const b = tryTimeToMinutes(time2);
	if (a === null || b === null) return 0;
	return a - b;
}

export const isTimeInRange = (time: string, minTime: string, maxTime: string): boolean =>
	compareTime(time, minTime) >= 0 && compareTime(time, maxTime) <= 0;

/** Duration in minutes from startTime to endTime (0 if either is malformed). */
export function getTimeDuration(startTime: string, endTime: string): number {
	const start = tryTimeToMinutes(startTime);
	const end = tryTimeToMinutes(endTime);
	if (start === null || end === null) return 0;
	return end - start;
}

export function generateTimeSlots(startHour: number, endHour: number, interval: number): TimeSlot[] {
	const slots: TimeSlot[] = [];
	const span = (endHour - startHour) * 60;
	// `elapsed` bounds the loop in minutes (so endHour === 24 works); `minutesToTime` wraps at midnight
	// and zero-pads for us.
	for (let elapsed = 0; elapsed < span; elapsed += interval) {
		const min = startHour * 60 + elapsed;
		slots.push({ value: minutesToTime(min), label: formatTimeDisplay(min) });
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
