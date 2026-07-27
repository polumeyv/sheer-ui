import { describe, expect, test } from 'bun:test';
import { alphanumeric, basic, datetime, inferSortingFn, text, type RowLike } from './sorting-fns';

const row = (value: unknown): RowLike => ({ getValue: () => value });
const rows = (...values: unknown[]) => values.map(row);

describe('basic', () => {
	test('orders numbers', () => {
		expect(basic(row(1), row(2), 'x')).toBe(-1);
		expect(basic(row(2), row(1), 'x')).toBe(1);
		expect(basic(row(2), row(2), 'x')).toBe(0);
	});

	test('is case-sensitive for strings', () => {
		expect(basic(row('Z'), row('a'), 'x')).toBe(-1);
	});
});

describe('text', () => {
	test('lowercases before comparing', () => {
		expect(text(row('Z'), row('a'), 'x')).toBe(1);
		expect(text(row('a'), row('A'), 'x')).toBe(0);
	});

	test('coerces non-finite numbers and non-strings to empty', () => {
		expect(text(row(NaN), row(Infinity), 'x')).toBe(0);
		expect(text(row(null), row(undefined), 'x')).toBe(0);
		expect(text(row(5), row('5'), 'x')).toBe(0);
	});
});

describe('alphanumeric', () => {
	test('compares digit groups numerically', () => {
		expect(alphanumeric(row('a2'), row('a10'), 'x')).toBe(-1);
		expect(alphanumeric(row('a10'), row('a2'), 'x')).toBe(1);
	});

	test('string tokens sort before number tokens', () => {
		expect(alphanumeric(row('1'), row('a'), 'x')).toBe(1);
		expect(alphanumeric(row('a'), row('1'), 'x')).toBe(-1);
	});

	test('shorter prefix wins on exhaustion', () => {
		expect(alphanumeric(row('a1'), row('a1b'), 'x')).toBe(-1);
	});
});

describe('datetime', () => {
	test('compares by time value', () => {
		const earlier = new Date('2026-01-01');
		const later = new Date('2026-07-26');
		expect(datetime(row(earlier), row(later), 'x')).toBe(-1);
		expect(datetime(row(later), row(earlier), 'x')).toBe(1);
		expect(datetime(row(new Date(earlier)), row(new Date(earlier)), 'x')).toBe(0);
	});
});

describe('inferSortingFn', () => {
	test('Date values pick datetime', () => {
		expect(inferSortingFn(rows(new Date()), 'x')).toBe(datetime);
	});

	test('strings containing digit groups pick alphanumeric', () => {
		expect(inferSortingFn(rows('item-1'), 'x')).toBe(alphanumeric);
	});

	test('plain strings pick text', () => {
		expect(inferSortingFn(rows('alpha', 'beta'), 'x')).toBe(text);
	});

	test('numbers and empty input pick basic', () => {
		expect(inferSortingFn(rows(1, 2, 3), 'x')).toBe(basic);
		expect(inferSortingFn([], 'x')).toBe(basic);
	});

	test('samples the FIRST ten rows, so tables under 11 rows still infer text', () => {
		// Upstream's `.slice(10)` bug would return basic here.
		expect(inferSortingFn(rows('a', 'b', 'c'), 'x')).toBe(text);
	});

	test('an alphanumeric value past the sample window is not consulted', () => {
		const sample = [...Array.from({ length: 10 }, (_, i) => row('plain')), row('item-1')];
		expect(inferSortingFn(sample, 'x')).toBe(text);
	});
});
