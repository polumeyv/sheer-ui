import { describe, it, expect } from 'bun:test';
import { timeToMinutes, minutesToTime, formatTimeDisplay, formatTimeRange, formatDuration } from './time';

describe('timeToMinutes', () => {
	it('parses HH:MM', () => expect(timeToMinutes('09:30')).toBe(570));
	it('parses midnight', () => expect(timeToMinutes('00:00')).toBe(0));
	it('parses end of day', () => expect(timeToMinutes('23:59')).toBe(1439));
	it('ignores any seconds component', () => expect(timeToMinutes('09:30:15')).toBe(570));
});

describe('minutesToTime', () => {
	it('zero-pads', () => expect(minutesToTime(570)).toBe('09:30'));
	it('renders midnight', () => expect(minutesToTime(0)).toBe('00:00'));
	it('wraps a full day to midnight', () => expect(minutesToTime(1440)).toBe('00:00'));
	it('wraps past midnight', () => expect(minutesToTime(1500)).toBe('01:00'));
	it('wraps negative values backward', () => expect(minutesToTime(-30)).toBe('23:30'));
});

describe('formatTimeDisplay', () => {
	it('uses 12-hour display by default', () => expect(formatTimeDisplay('09:30')).toBe('9:30 AM'));
	it('supports 24-hour display', () => expect(formatTimeDisplay('09:30', { use24Hour: true })).toBe('09:30'));
	it('renders the midnight hour as 00, not 24', () => expect(formatTimeDisplay('00:30', { use24Hour: true })).toBe('00:30'));
	it('takes minutes since midnight directly', () => expect(formatTimeDisplay(570)).toBe('9:30 AM'));
});

describe('formatTimeRange', () => {
	it('preserves Intl range compaction within a day', () => expect(formatTimeRange('09:30', '10:15')).toBe('9:30 – 10:15 AM'));
	it('formats endpoints separately across midnight', () => expect(formatTimeRange('23:30', '00:15')).toBe('11:30 PM – 12:15 AM'));
	it('takes minutes since midnight directly', () => expect(formatTimeRange(570, 615)).toBe('9:30 – 10:15 AM'));
});

describe('formatDuration', () => {
	it('compact', () => expect([45, 60, 90].map((m) => formatDuration(m, 'compact'))).toEqual(['45m', '1h', '1h 30m']));
	it('short', () => expect([30, 60, 90, 120].map((m) => formatDuration(m, 'short'))).toEqual(['30 min', '1 hr', '1 hr 30 min', '2 hrs']));
	it('long', () =>
		expect([1, 5, 90, 120].map((m) => formatDuration(m, 'long'))).toEqual(['1 minute', '5 minutes', '1 hour 30 minutes', '2 hours']));

	it('keeps the remainder in every style', () =>
		expect((['compact', 'short', 'long'] as const).map((s) => formatDuration(150, s))).toEqual([
			'2h 30m',
			'2 hrs 30 min',
			'2 hours 30 minutes',
		]));
	it("zero renders in the style's minute unit", () => expect(formatDuration(0, 'short')).toBe('0 min'));
});
