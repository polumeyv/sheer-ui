import { describe, expect, test } from 'bun:test';
import { getLabelPosition, normalizeSliderValue } from './helpers.js';

describe('slider shared helpers', () => {
	test('keeps valid controlled values by identity and repairs invalid values', () => {
		const valid = [0, 5, 10];
		expect(normalizeSliderValue(5, valid)).toBe(5);
		expect(normalizeSliderValue(6, valid)).toBe(5);

		const values = [0, 10];
		expect(normalizeSliderValue(values, valid)).toBe(values);
		expect(normalizeSliderValue([1, 9], valid)).toEqual([0, 10]);
	});

	test('preserves explicit label positions and axis defaults', () => {
		expect(getLabelPosition('lr', undefined)).toBe('top');
		expect(getLabelPosition('rl', undefined)).toBe('top');
		expect(getLabelPosition('tb', undefined)).toBe('left');
		expect(getLabelPosition('bt', 'right')).toBe('right');
	});
});
