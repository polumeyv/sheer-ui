import { describe, expect, test } from 'bun:test';
import { facetCounts, makeAccessor, resolveColumnId, sortRows } from './core';
import { basic, text, type Comparator } from './sorting-fns';
import type { ColumnSort } from './types';

type Data = Record<string, unknown>;

const testRow = (values: Data, index: number) => ({
	index,
	id: String(index),
	getValue: (columnId: string) => values[columnId],
});
const testRows = (...values: Data[]) => values.map(testRow);

describe('resolveColumnId', () => {
	test('explicit id wins', () => {
		expect(resolveColumnId({ id: 'status', accessorKey: 'state', header: 'State' })).toBe('status');
	});

	test('accessorKey rewrites dots to underscores', () => {
		expect(resolveColumnId({ accessorKey: 'user.name' })).toBe('user_name');
	});

	test('string header is the last resort', () => {
		expect(resolveColumnId({ header: 'Created' })).toBe('Created');
	});

	test('throws when nothing resolves', () => {
		expect(() => resolveColumnId({ header: () => 'x' })).toThrow();
	});
});

describe('makeAccessor', () => {
	test('accessorFn wins over accessorKey', () => {
		const accessor = makeAccessor<Data>({ accessorKey: 'name', accessorFn: () => 'fn' })!;
		expect(accessor({ name: 'key' }, 0)).toBe('fn');
	});

	test('plain key reads directly', () => {
		expect(makeAccessor<Data>({ accessorKey: 'name' })!({ name: 'ada' }, 0)).toBe('ada');
	});

	test('dotted key walks the path and survives missing links', () => {
		const accessor = makeAccessor<Data>({ accessorKey: 'user.address.city' })!;
		expect(accessor({ user: { address: { city: 'Kyiv' } } }, 0)).toBe('Kyiv');
		expect(accessor({ user: null }, 0)).toBeUndefined();
	});

	test('no accessor without a key or fn', () => {
		expect(makeAccessor<Data>({ id: 'actions' })).toBeUndefined();
	});
});

describe('sortRows', () => {
	const comparatorFor =
		(fns: Record<string, Comparator>) =>
		(columnId: string): Comparator | undefined =>
			fns[columnId];

	test('returns the input array untouched when no sorting applies', () => {
		const rows = testRows({ a: 2 }, { a: 1 });
		expect(sortRows(rows, [], comparatorFor({ a: basic }))).toBe(rows);
		expect(sortRows(rows, [{ id: 'missing', desc: false }], comparatorFor({ a: basic }))).toBe(rows);
	});

	test('sorts ascending and descending without mutating the input', () => {
		const rows = testRows({ a: 2 }, { a: 1 }, { a: 3 });
		const asc = sortRows(rows, [{ id: 'a', desc: false }], comparatorFor({ a: basic }));
		expect(asc.map((row) => row.getValue('a'))).toEqual([1, 2, 3]);
		const desc = sortRows(rows, [{ id: 'a', desc: true }], comparatorFor({ a: basic }));
		expect(desc.map((row) => row.getValue('a'))).toEqual([3, 2, 1]);
		expect(rows.map((row) => row.getValue('a'))).toEqual([2, 1, 3]);
	});

	test('sorted rows keep object identity', () => {
		const rows = testRows({ a: 2 }, { a: 1 });
		const sorted = sortRows(rows, [{ id: 'a', desc: false }], comparatorFor({ a: basic }));
		expect(sorted[0]).toBe(rows[1]!);
		expect(sorted[1]).toBe(rows[0]!);
	});

	test('ties break on the next entry, then on row index', () => {
		const rows = testRows({ group: 'b', name: 'x' }, { group: 'a', name: 'y' }, { group: 'a', name: 'y' }, { group: 'a', name: 'x' });
		const sorting: ColumnSort[] = [
			{ id: 'group', desc: false },
			{ id: 'name', desc: true },
		];
		const sorted = sortRows(rows, sorting, comparatorFor({ group: text, name: text }));
		expect(sorted.map((row) => row.index)).toEqual([1, 2, 3, 0]);
	});
});

describe('facetCounts', () => {
	test('counts values including nullish ones', () => {
		const counts = facetCounts(testRows({ s: 'live' }, { s: 'live' }, { s: 'error' }, { s: undefined }), 's');
		expect(counts.get('live')).toBe(2);
		expect(counts.get('error')).toBe(1);
		expect(counts.get(undefined)).toBe(1);
	});
});
