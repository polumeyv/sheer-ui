import { describe, expect, test } from 'vitest';
import type { ColumnDef } from '../../src/lib/internal/table/index.js';
import { makeTableHarness } from './data-table-harness.svelte.js';

type Person = { name: string; age: number };

const columns: ColumnDef<Person>[] = [
	{ accessorKey: 'name', header: 'Name' },
	{ accessorKey: 'age', header: 'Age' },
];

const people: Person[] = [
	{ name: 'ada', age: 36 },
	{ name: 'brian', age: 70 },
	{ name: 'carol', age: 52 },
	{ name: 'dan', age: 41 },
	{ name: 'ana', age: 29 },
	{ name: 'ed', age: 63 },
];

const harness = (overrides: { pageSize?: number; columns?: ColumnDef<Person>[] } = {}) =>
	makeTableHarness({ initial: people, columns: overrides.columns ?? columns, pageSize: overrides.pageSize });

describe('filtering', () => {
	test('a column filter shrinks filteredRows and resets the page', () => {
		const { table, dispose } = harness({ pageSize: 2 });
		table.setPageIndex(2);
		expect(table.pagination.pageIndex).toBe(2);

		table.column('name')!.setFilterValue('da');
		expect(table.filteredRows.map((row) => row.original.name)).toEqual(['ada', 'dan']);
		expect(table.pagination.pageIndex).toBe(0);
		dispose();
	});

	test('clearing the filter value removes its entry entirely', () => {
		const { table, dispose } = harness();
		table.column('name')!.setFilterValue('an');
		expect(table.columnFilters).toHaveLength(1);
		table.column('name')!.setFilterValue('');
		expect(table.columnFilters).toHaveLength(0);
		expect(table.column('name')!.filterValue).toBeUndefined();
		dispose();
	});

	test('a filter change does not re-read the data source', () => {
		const h = harness();
		void h.table.rows;
		const readsBefore = h.dataReads;
		h.table.column('name')!.setFilterValue('a');
		void h.table.rows;
		expect(h.dataReads).toBe(readsBefore);
		h.dispose();
	});

	test('facet counts ignore the column own filter but respect the others', () => {
		const { table, dispose } = harness();
		table.column('name')!.setFilterValue('a');
		table.column('age')!.setFilterValue(36);
		const facets = table.column('age')!.facetedUniqueValues;
		// name filter ('a') drops only ed; the age filter itself is excluded from its own facet.
		expect([...facets.keys()].sort()).toEqual([29, 36, 41, 52, 70]);
		expect(facets.get(36)).toBe(1);
		dispose();
	});
});

describe('sorting', () => {
	test('rows keep object identity across a sort', () => {
		const { table, dispose } = harness();
		const before = [...table.rows];
		table.column('age')!.toggleSorting(false);
		expect(table.rows[0]).toBe(before[4]!);
		expect(table.rows.map((row) => row.original.age)).toEqual([29, 36, 41, 52, 63, 70]);
		dispose();
	});

	test('string columns cycle asc → desc → unsorted', () => {
		const { table, dispose } = harness();
		const name = table.column('name')!;
		name.toggleSorting();
		expect(name.isSorted).toBe('asc');
		name.toggleSorting();
		expect(name.isSorted).toBe('desc');
		name.toggleSorting();
		expect(name.isSorted).toBe(false);
		expect(table.sorting).toHaveLength(0);
		dispose();
	});

	test('non-string columns start descending', () => {
		const { table, dispose } = harness();
		table.column('age')!.toggleSorting();
		expect(table.column('age')!.isSorted).toBe('desc');
		dispose();
	});

	test('a sort change resets the page', () => {
		const { table, dispose } = harness({ pageSize: 2 });
		table.setPageIndex(1);
		table.column('name')!.toggleSorting();
		expect(table.pagination.pageIndex).toBe(0);
		dispose();
	});

	test('columns without an accessor cannot sort', () => {
		const { table, dispose } = harness({
			columns: [...columns, { id: 'actions', header: '' }],
		});
		expect(table.column('actions')!.canSort).toBe(false);
		table.column('actions')!.sortHandler(new MouseEvent('click'));
		expect(table.sorting).toHaveLength(0);
		dispose();
	});
});

describe('pagination', () => {
	test('pageSize omitted means no pagination', () => {
		const { table, dispose } = harness();
		expect(table.rows).toHaveLength(people.length);
		expect(table.pageCount).toBe(1);
		expect(table.canNextPage).toBe(false);
		dispose();
	});

	test('data shrinking under a stale pageIndex clamps to the last page', () => {
		const { table, dispose, setData } = harness({ pageSize: 2 });
		expect(table.pageCount).toBe(3);
		table.setPageIndex(2);
		setData(people.slice(0, 2));
		expect(table.pageCount).toBe(1);
		expect(table.pagination.pageIndex).toBe(0);
		expect(table.rows).toHaveLength(2);
		dispose();
	});

	test('setPageSize keeps the current top row visible', () => {
		const { table, dispose } = harness({ pageSize: 2 });
		table.setPageIndex(2);
		table.setPageSize(4);
		expect(table.pagination).toEqual({ pageIndex: 1, pageSize: 4 });
		expect(table.rows[0]!.original.name).toBe('ana');
		dispose();
	});

	test('an empty result still reports one page', () => {
		const { table, dispose, setData } = harness({ pageSize: 2 });
		setData([]);
		expect(table.pageCount).toBe(1);
		expect(table.canPreviousPage).toBe(false);
		expect(table.canNextPage).toBe(false);
		dispose();
	});
});

describe('visibility', () => {
	test('hiding a column shrinks headers and visible cells together', () => {
		const { table, dispose } = harness();
		table.column('age')!.isVisible = false;
		expect(table.headerGroups[0]!.headers.map((header) => header.id)).toEqual(['name']);
		expect(table.rows[0]!.visibleCells.map((cell) => cell.column.id)).toEqual(['name']);
		dispose();
	});

	test('enableHiding: false wins over the isVisible setter', () => {
		const { table, dispose } = harness({
			columns: [{ accessorKey: 'name', header: 'Name', enableHiding: false }],
		});
		table.column('name')!.isVisible = false;
		expect(table.column('name')!.isVisible).toBe(true);
		dispose();
	});
});
