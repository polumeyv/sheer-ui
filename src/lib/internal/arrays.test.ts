import { describe, expect, test } from 'bun:test';
import {
	arraysAreEqual,
	backward,
	chunk,
	findWrapped,
	forward,
	getNextMatch,
	isValidIndex,
	next,
	prev
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

describe('findWrapped', () => {
	test('visits elements in rotation order from the start index', () => {
		const visited: string[] = [];
		findWrapped(['a', 'b', 'c', 'd'], 2, (v) => (visited.push(v), false));
		expect(visited).toEqual(['c', 'd', 'a', 'b']);
	});

	test('returns the first satisfying element, wrapping past the end', () => {
		expect(findWrapped(['a', 'b', 'c', 'd'], 2, (v) => v === 'b')).toBe('b');
	});

	test('keeps order for a zero start index', () => {
		expect(findWrapped(['a', 'b', 'c'], 0, () => true)).toBe('a');
	});

	test('wraps start indexes beyond the array length', () => {
		expect(findWrapped(['a', 'b', 'c'], 4, () => true)).toBe('b');
	});

	test('returns undefined for empty input or no match', () => {
		expect(findWrapped([], 2, () => true)).toBeUndefined();
		expect(findWrapped(['a'], 0, () => false)).toBeUndefined();
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

// Differential proof for the wrapArray → findWrapped rewrite: the pre-rewrite implementation,
// verbatim, driven against the live one over randomized inputs.
const oldWrapArray = <T,>(array: T[], startIndex: number) =>
	array.map((_, index) => array[(startIndex + index) % array.length]) as T[];

function oldGetNextMatch(values: string[], search: string, currentMatch?: string): string | undefined {
	const lowerSearch = search.toLowerCase();

	if (lowerSearch.endsWith(' ')) {
		const searchWithoutSpace = lowerSearch.slice(0, -1);
		const matchesWithoutSpace = values.filter((value) => value.toLowerCase().startsWith(searchWithoutSpace));
		if (matchesWithoutSpace.length <= 1) {
			return oldGetNextMatch(values, searchWithoutSpace, currentMatch);
		}

		const currentMatchLowercase = currentMatch?.toLowerCase();
		if (
			currentMatchLowercase &&
			currentMatchLowercase.startsWith(searchWithoutSpace) &&
			currentMatchLowercase.charAt(searchWithoutSpace.length) === ' ' &&
			search.trim() === searchWithoutSpace
		) {
			return currentMatch;
		}

		const spacedMatches = values.filter((value) => value.toLowerCase().startsWith(lowerSearch));
		if (spacedMatches.length > 0) {
			const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
			const wrappedMatches = oldWrapArray(spacedMatches, Math.max(currentMatchIndex, 0));
			const nextMatch = wrappedMatches.find((match) => match !== currentMatch);
			return nextMatch || currentMatch;
		}
	}

	const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
	const normalizedSearch = isRepeated ? search[0]! : search;
	const normalizedLowerSearch = normalizedSearch.toLowerCase();

	const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
	let wrappedValues = oldWrapArray(values, Math.max(currentMatchIndex, 0));
	const excludeCurrentMatch = normalizedSearch.length === 1;
	if (excludeCurrentMatch) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);

	const nextMatch = wrappedValues.find((value) => value?.toLowerCase().startsWith(normalizedLowerSearch));

	return nextMatch !== currentMatch ? nextMatch : undefined;
}

// mulberry32 — deterministic cases, reproducible failures.
const makeRng = (seed: number) => () => {
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

describe('findWrapped rewrite differentials', () => {
	const pool = [
		'New York', 'New Jersey', 'Newark', 'New', 'new york',
		'Alpha', 'Alpine', 'Apple', 'Apricot', 'ap', 'a', '',
		'Beta', 'Banana', 'aa', 'n ', ' lead'
	];
	const alphabet = ['a', 'n', 'e', 'w', 'p', ' ', 'A', 'N'];

	test('getNextMatch matches the pre-rewrite implementation over randomized inputs', () => {
		const rand = makeRng(0xc0ffee);
		const pick = <T,>(items: T[]) => items[Math.floor(rand() * items.length)]!;

		for (let caseIndex = 0; caseIndex < 20000; caseIndex++) {
			const values = Array.from({ length: 1 + Math.floor(rand() * 8) }, () => pick(pool));

			const searchKind = rand();
			let search: string;
			if (searchKind < 0.35) {
				const base = pick(values);
				search = base.slice(0, 1 + Math.floor(rand() * Math.max(base.length, 1)));
			} else if (searchKind < 0.5) {
				search = pick(alphabet).repeat(1 + Math.floor(rand() * 3));
			} else {
				search = Array.from({ length: 1 + Math.floor(rand() * 4) }, () => pick(alphabet)).join('');
			}
			if (rand() < 0.3) search += ' ';

			const matchKind = rand();
			const currentMatch = matchKind < 0.4 ? pick(values) : matchKind < 0.5 ? 'not-in-values' : undefined;

			const expected = oldGetNextMatch(values, search, currentMatch);
			const actual = getNextMatch(values, search, currentMatch);
			if (actual !== expected) {
				throw new Error(
					`divergence: values=${JSON.stringify(values)} search=${JSON.stringify(search)} currentMatch=${JSON.stringify(currentMatch)} old=${JSON.stringify(expected)} new=${JSON.stringify(actual)}`
				);
			}
		}
	});

	test('menubar next-candidate expressions match the pre-rewrite wrapArray/slice forms', () => {
		for (let length = 1; length <= 8; length++) {
			const candidates = Array.from({ length }, (_, i) => `item-${i}`);
			for (let currentIndex = 0; currentIndex < length; currentIndex++) {
				expect(candidates[(currentIndex + 1) % candidates.length]).toBe(
					oldWrapArray(candidates, currentIndex + 1)[0]!
				);
				expect(candidates[currentIndex + 1]).toBe(candidates.slice(currentIndex + 1)[0]!);
			}
		}
	});
});
