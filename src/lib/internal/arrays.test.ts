import { describe, expect, test } from 'bun:test';
import {
	arraysAreEqual,
	backward,
	chunk,
	forward,
	getNextMatch,
	isValidIndex,
	next,
	prev,
	wrapArray
} from './arrays';

describe('arraysAreEqual', () => {
	test('compares primitive values by position', () => {
		expect(arraysAreEqual([1, 'two', true], [1, 'two', true])).toBe(true);
		expect(arraysAreEqual([1, 'two', true], [1, 'two', false])).toBe(false);
	});

	test('returns false for unequal lengths', () => {
		expect(arraysAreEqual([1, 2], [1, 2, 3])).toBe(false);
	});

	test('compares nested arrays and objects deeply', () => {
		expect(
			arraysAreEqual([{ id: 1, tags: ['a', 'b'] }], [{ id: 1, tags: ['a', 'b'] }])
		).toBe(true);
		expect(
			arraysAreEqual([{ id: 1, tags: ['a', 'b'] }], [{ id: 1, tags: ['a', 'c'] }])
		).toBe(false);
	});

	test('treats NaN values as equal', () => {
		expect(arraysAreEqual([Number.NaN], [Number.NaN])).toBe(true);
	});
});

describe('chunk', () => {
	test('splits arrays into even chunks', () => {
		expect(chunk([1, 2, 3, 4], 2)).toEqual([
			[1, 2],
			[3, 4]
		]);
	});

	test('keeps an uneven final chunk', () => {
		expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
	});

	test('returns an empty array for empty input', () => {
		expect(chunk([], 3)).toEqual([]);
	});

	test('returns an empty array for zero or negative sizes', () => {
		expect(chunk([1, 2, 3], 0)).toEqual([]);
		expect(chunk([1, 2, 3], -1)).toEqual([]);
	});
});

describe('isValidIndex', () => {
	const values = ['a', 'b', 'c'];

	test('accepts indexes within array bounds', () => {
		expect(isValidIndex(0, values)).toBe(true);
		expect(isValidIndex(2, values)).toBe(true);
	});

	test('rejects negative indexes', () => {
		expect(isValidIndex(-1, values)).toBe(false);
	});

	test('rejects indexes outside array bounds', () => {
		expect(isValidIndex(3, values)).toBe(false);
	});
});

describe('next', () => {
	test('returns undefined for empty arrays', () => {
		expect(next([], 0)).toBeUndefined();
	});

	test('returns the item for single-item arrays', () => {
		expect(next(['a'], 0)).toBe('a');
	});

	test('moves to the following item', () => {
		expect(next(['a', 'b', 'c'], 0)).toBe('b');
	});

	test('handles the end boundary with and without looping', () => {
		expect(next(['a', 'b', 'c'], 2, true)).toBe('a');
		expect(next(['a', 'b', 'c'], 2, false)).toBeUndefined();
	});
});

describe('prev', () => {
	test('returns undefined for empty arrays', () => {
		expect(prev([], 0)).toBeUndefined();
	});

	test('returns the item for single-item arrays', () => {
		expect(prev(['a'], 0)).toBe('a');
	});

	test('moves to the previous item', () => {
		expect(prev(['a', 'b', 'c'], 2)).toBe('b');
	});

	test('handles the start boundary with and without looping', () => {
		expect(prev(['a', 'b', 'c'], 0, true)).toBe('c');
		expect(prev(['a', 'b', 'c'], 0, false)).toBeUndefined();
	});
});

describe('forward', () => {
	test('returns undefined for empty arrays', () => {
		expect(forward([], 0, 1)).toBeUndefined();
	});

	test('returns the item for single-item arrays', () => {
		expect(forward(['a'], 0, 4)).toBe('a');
	});

	test('moves forward by the requested increment', () => {
		expect(forward(['a', 'b', 'c', 'd'], 1, 2)).toBe('d');
	});

	test('handles the end boundary with and without looping', () => {
		expect(forward(['a', 'b', 'c'], 2, 2, true)).toBe('b');
		expect(forward(['a', 'b', 'c'], 2, 2, false)).toBe('c');
	});
});

describe('backward', () => {
	test('returns undefined for empty arrays', () => {
		expect(backward([], 0, 1)).toBeUndefined();
	});

	test('returns the item for single-item arrays', () => {
		expect(backward(['a'], 0, 4)).toBe('a');
	});

	test('moves backward by the requested decrement', () => {
		expect(backward(['a', 'b', 'c', 'd'], 3, 2)).toBe('b');
	});

	test('handles the start boundary with and without looping', () => {
		expect(backward(['a', 'b', 'c'], 0, 2, true)).toBe('b');
		expect(backward(['a', 'b', 'c'], 0, 2, false)).toBe('a');
	});
});

describe('wrapArray', () => {
	test('rotates from the provided start index', () => {
		expect(wrapArray(['a', 'b', 'c', 'd'], 2)).toEqual(['c', 'd', 'a', 'b']);
	});

	test('keeps order for a zero start index', () => {
		expect(wrapArray(['a', 'b', 'c'], 0)).toEqual(['a', 'b', 'c']);
	});

	test('wraps start indexes beyond the array length', () => {
		expect(wrapArray(['a', 'b', 'c'], 4)).toEqual(['b', 'c', 'a']);
	});

	test('returns an empty array for empty input', () => {
		expect(wrapArray([], 2)).toEqual([]);
	});
});

describe('getNextMatch', () => {
	test('returns the first normal prefix match', () => {
		expect(getNextMatch(['Alpha', 'Beta', 'Gamma'], 'ga')).toBe('Gamma');
	});

	test('treats repeated-character searches as one character', () => {
		expect(getNextMatch(['Apple', 'Apricot', 'Banana'], 'aa', 'Apple')).toBe('Apricot');
	});

	test('excludes the current match for single-character searches', () => {
		expect(getNextMatch(['Alpha', 'Alpine', 'Beta'], 'a', 'Alpha')).toBe('Alpine');
	});

	test('ignores a trailing space when only one prefix match exists', () => {
		expect(getNextMatch(['New York', 'Boston'], 'new ')).toBe('New York');
	});

	test('keeps the current spaced match while the search ends at the space', () => {
		expect(getNextMatch(['New York', 'New Jersey', 'Newark'], 'new ', 'New York')).toBe(
			'New York'
		);
	});

	test('moves to another spaced match when the current match is excluded', () => {
		expect(getNextMatch(['New York', 'New Jersey', 'Newark'], 'new ', undefined)).toBe(
			'New York'
		);
	});
});
