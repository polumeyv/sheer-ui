import { describe, expect, test } from 'vitest';
import type { ColumnDef } from '../../src/lib/internal/table/index.js';
import { makeTableHarness } from './data-table-harness.svelte.js';

type Person = { name: string };

const columns: ColumnDef<Person>[] = [{ accessorKey: 'name', header: 'Name' }];
const people: Person[] = [{ name: 'ada' }, { name: 'brian' }, { name: 'carol' }, { name: 'dan' }];

const harness = (pageSize?: number) => makeTableHarness({ initial: people, columns, pageSize });

describe('row selection', () => {
	test('toggleSelected flips and honors an explicit value', () => {
		const { table, dispose } = harness();
		const row = table.rows[0]!;
		row.toggleSelected();
		expect(row.isSelected).toBe(true);
		row.toggleSelected();
		expect(row.isSelected).toBe(false);
		row.toggleSelected(true);
		row.toggleSelected(true);
		expect(row.isSelected).toBe(true);
		dispose();
	});

	test('setSelectedRowIds round-trips and clears', () => {
		const { table, dispose } = harness();
		table.setSelectedRowIds(['0', '2']);
		expect(table.selectedRows.map((row) => row.original.name)).toEqual(['ada', 'carol']);
		table.setSelectedRowIds(['1']);
		expect([...table.selectedRowIds]).toEqual(['1']);
		table.setSelectedRowIds([]);
		expect(table.selectedRows).toHaveLength(0);
		dispose();
	});
});

describe('page-scoped selection', () => {
	test('toggleAllPageRowsSelected touches only the current page', () => {
		const { table, dispose } = harness(2);
		table.toggleAllPageRowsSelected();
		expect(table.selectedRows.map((row) => row.original.name)).toEqual(['ada', 'brian']);
		expect(table.isAllPageRowsSelected).toBe(true);

		table.nextPage();
		expect(table.isAllPageRowsSelected).toBe(false);
		expect(table.isSomePageRowsSelected).toBe(false);
		dispose();
	});

	test('header tri-state: some, then all, then none', () => {
		const { table, dispose } = harness(2);
		table.rows[0]!.toggleSelected(true);
		expect(table.isAllPageRowsSelected).toBe(false);
		expect(table.isSomePageRowsSelected).toBe(true);

		table.toggleAllPageRowsSelected(true);
		expect(table.isAllPageRowsSelected).toBe(true);
		expect(table.isSomePageRowsSelected).toBe(false);

		table.toggleAllPageRowsSelected(false);
		expect(table.selectedRows).toHaveLength(0);
		dispose();
	});

	test('an empty page is never "all selected"', () => {
		const { table, dispose, setData } = harness(2);
		setData([]);
		expect(table.isAllPageRowsSelected).toBe(false);
		dispose();
	});
});

describe('selection vs filtering', () => {
	test('filteredSelectedRows and selectedRows diverge under an active filter', () => {
		const { table, dispose } = harness();
		table.rows[1]!.toggleSelected(true);
		table.column('name')!.setFilterValue('car');
		expect(table.selectedRows.map((row) => row.original.name)).toEqual(['brian']);
		expect(table.filteredSelectedRows).toHaveLength(0);
		dispose();
	});
});
