import type { Cell, Column, DataTable, Header, Row } from './table.svelte.js';

export type ColumnDefTemplate<TProps> = string | ((props: TProps) => unknown);

export type FilterFn<TData> = (row: Row<TData>, columnId: string, value: unknown) => boolean;

export interface ColumnDef<TData, TValue = unknown> {
	id?: string;
	accessorKey?: string;
	accessorFn?: (original: TData, index: number) => TValue;
	header?: ColumnDefTemplate<HeaderContext<TData, TValue>>;
	cell?: ColumnDefTemplate<CellContext<TData, TValue>>;
	filterFn?: FilterFn<TData>;
	enableSorting?: boolean;
	enableHiding?: boolean;
	meta?: { class?: string };
}

export type ColumnSort = { id: string; desc: boolean };
export type ColumnFilter = { id: string; value: unknown };

export interface HeaderContext<TData, TValue = unknown> {
	table: DataTable<TData>;
	column: Column<TData, TValue>;
	header: Header<TData, TValue>;
}

export interface CellContext<TData, TValue = unknown> {
	table: DataTable<TData>;
	column: Column<TData, TValue>;
	row: Row<TData>;
	cell: Cell<TData, TValue>;
}
