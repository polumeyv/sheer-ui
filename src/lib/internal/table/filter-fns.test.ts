import { describe, expect, test } from 'bun:test';
import { includesString, shouldAutoRemoveFilter } from './filter-fns';
import type { RowLike } from './sorting-fns';

const row = (value: unknown): RowLike => ({ getValue: () => value });

describe('includesString', () => {
	test('is a case-insensitive substring match', () => {
		expect(includesString(row('Ken Ninety-Nine'), 'x', 'ninety')).toBe(true);
		expect(includesString(row('Ken'), 'x', 'abe')).toBe(false);
	});

	test('null and undefined row values never match', () => {
		expect(includesString(row(null), 'x', '')).toBe(false);
		expect(includesString(row(undefined), 'x', 'a')).toBe(false);
	});

	test('coerces numeric row and filter values', () => {
		expect(includesString(row(316), 'x', '31')).toBe(true);
		expect(includesString(row(316), 'x', 4)).toBe(false);
	});
});

describe('shouldAutoRemoveFilter', () => {
	test('removes undefined and empty string', () => {
		expect(shouldAutoRemoveFilter(undefined)).toBe(true);
		expect(shouldAutoRemoveFilter('')).toBe(true);
	});

	test('keeps everything else, including falsy non-strings', () => {
		expect(shouldAutoRemoveFilter(0)).toBe(false);
		expect(shouldAutoRemoveFilter(false)).toBe(false);
		expect(shouldAutoRemoveFilter([])).toBe(false);
		expect(shouldAutoRemoveFilter('a')).toBe(false);
	});
});
