/**
 * Calendar Utilities
 * Re-exports from @internationalized/date for convenience
 */

export {
	CalendarDate,
	CalendarDateTime,
	getLocalTimeZone,
	today,
	parseDate,
	type DateValue,
} from '@internationalized/date';

import { parseTime, formatTimeDisplay } from '@polumeyv/lib/booking/utils';

/**
 * Time Utilities
 */

export type TimeSlot = {
	value: string;
	label: string;
};

export type TimeRange = {
	start: string;
	end: string;
};

function toMinutes(time: string): number | null {
	const parsed = parseTime(time);
	if (!parsed) return null;
	return parsed.hour * 60 + parsed.minute;
}

export function compareTime(time1: string, time2: string): number {
	const m1 = toMinutes(time1);
	const m2 = toMinutes(time2);
	if (m1 === null || m2 === null) return 0;
	return m1 - m2;
}

export function isTimeInRange(time: string, minTime: string, maxTime: string): boolean {
	return compareTime(time, minTime) >= 0 && compareTime(time, maxTime) <= 0;
}

export function getTimeDuration(startTime: string, endTime: string): number {
	const start = toMinutes(startTime);
	const end = toMinutes(endTime);
	if (start === null || end === null) return 0;
	return end - start;
}

export function formatDuration(minutes: number): string {
	if (minutes < 60) return `${minutes}m`;
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function generateTimeSlots(startHour: number, endHour: number, interval: number): TimeSlot[] {
	const slots: TimeSlot[] = [];
	for (let minutes = startHour * 60; minutes < endHour * 60; minutes += interval) {
		const h = Math.floor(minutes / 60);
		const m = minutes % 60;
		const value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
		slots.push({ value, label: formatTimeDisplay(value) });
	}
	return slots;
}

export const b_HOURS: TimeSlot[] = generateTimeSlots(9, 17, 60);
export const EXTENDED_HOURS: TimeSlot[] = generateTimeSlots(7, 21, 60);
