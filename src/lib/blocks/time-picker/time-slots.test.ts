import { describe, expect, test } from 'bun:test';
import { EXTENDED_HOURS, b_HOURS, generateTimeSlots, resolveTimeSlots } from './time-slots.js';

const options = { slots: undefined, interval: 30, startHour: 10, endHour: 12 } as const;

describe('resolveTimeSlots', () => {
	test('preserves the named presets', () => {
		expect(resolveTimeSlots({ ...options, preset: 'business' })).toBe(b_HOURS);
		expect(resolveTimeSlots({ ...options, preset: 'extended' })).toBe(EXTENDED_HOURS);
		expect(resolveTimeSlots({ ...options, preset: 'full' })).toEqual(generateTimeSlots(0, 24, 30));
		expect(resolveTimeSlots({ ...options, preset: 'custom' })).toEqual(generateTimeSlots(10, 12, 30));
	});

	test('gives explicit slots precedence over every preset', () => {
		const slots = [{ value: '13:15', label: 'custom' }];
		expect(resolveTimeSlots({ ...options, slots, preset: 'business' })).toBe(slots);
	});
});
