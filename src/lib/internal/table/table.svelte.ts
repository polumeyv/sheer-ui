import { SvelteSet } from 'svelte/reactivity';
import type { CellContext, ColumnDef, ColumnFilter, ColumnSort, FilterFn, HeaderContext } from './types.js';
import { facetCounts, makeAccessor, resolveColumnId, sortRows } from './core.js';
import { inferSortingFn } from './sorting-fns.js';
import { includesString, shouldAutoRemoveFilter } from './filter-fns.js';

export interface DataTableOptions<TData> {
	/** Thunk so the table tracks the consumer's own reactive source. */
	data: () => TData[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	columns: ColumnDef<TData, any>[] | (() => ColumnDef<TData, any>[]);
	/** Omit for an unpaginated table. */
	pageSize?: number;
}

export const createDataTable = <TData>(options: DataTableOptions<TData>) => new DataTable(options);

export class DataTable<TData> {
	readonly #data: () => TData[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly #defs: () => ColumnDef<TData, any>[];
	readonly #paginated: boolean;
	readonly #selection = new SvelteSet<string>();

	sorting = $state<ColumnSort[]>([]);
	columnFilters = $state<ColumnFilter[]>([]);
	columnVisibility = $state<Record<string, boolean>>({});
	#pageIndex = $state(0);
	#pageSize = $state(10);

	constructor(options: DataTableOptions<TData>) {
		this.#data = options.data;
		const { columns } = options;
		this.#defs = typeof columns === 'function' ? columns : () => columns;
		this.#paginated = options.pageSize !== undefined;
		if (options.pageSize !== undefined) this.#pageSize = options.pageSize;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly #columns: Column<TData, any>[] = $derived.by(() => this.#defs().map((def) => new Column(this, def)));
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly #columnsById = $derived(new Map<string, Column<TData, any>>(this.#columns.map((column) => [column.id, column])));
	readonly #coreRows: readonly Row<TData>[] = $derived.by(() => this.#data().map((original, index) => new Row(this, this.#selection, original, index)));

	readonly #activeFilters = $derived(
		this.columnFilters.flatMap((filter) => {
			const column = this.#columnsById.get(filter.id);
			return column ? [{ id: filter.id, filterFn: column.filterFn, value: filter.value }] : [];
		}),
	);
	// One row-id set per active filter, reused by both the filtered model and every facet.
	readonly #masks = $derived(
		this.#activeFilters.map((filter) => new Set(this.#coreRows.filter((row) => filter.filterFn(row, filter.id, filter.value)).map((row) => row.id))),
	);

	readonly filteredRows: readonly Row<TData>[] = $derived(
		this.#masks.length === 0 ? this.#coreRows : this.#coreRows.filter((row) => this.#masks.every((mask) => mask.has(row.id))),
	);

	readonly #sorted = $derived(
		sortRows(this.filteredRows, this.sorting, (columnId) =>
			this.#columnsById.get(columnId)?.canSort ? inferSortingFn(this.filteredRows, columnId) : undefined,
		),
	);

	readonly pageCount = $derived.by(() => (this.#paginated ? Math.max(1, Math.ceil(this.#sorted.length / this.#pageSize)) : 1));
	// Clamped on read, never written back: data shrinking under a stale index lands on the last page.
	readonly #safeIndex = $derived(Math.min(this.#pageIndex, this.pageCount - 1));

	readonly rows: readonly Row<TData>[] = $derived.by(() =>
		this.#paginated ? this.#sorted.slice(this.#safeIndex * this.#pageSize, (this.#safeIndex + 1) * this.#pageSize) : this.#sorted,
	);

	readonly canPreviousPage = $derived(this.#safeIndex > 0);
	readonly canNextPage = $derived(this.#safeIndex < this.pageCount - 1);

	get pagination(): { pageIndex: number; pageSize: number } {
		return { pageIndex: this.#safeIndex, pageSize: this.#pageSize };
	}

	setPageIndex(index: number) {
		this.#pageIndex = Math.min(Math.max(index, 0), this.pageCount - 1);
	}
	nextPage() {
		this.setPageIndex(this.#safeIndex + 1);
	}
	previousPage() {
		this.setPageIndex(this.#safeIndex - 1);
	}
	setPageSize(size: number) {
		const next = Math.max(1, size);
		// Keep the current top row visible, matching upstream's paging math.
		this.#pageIndex = Math.floor((this.#safeIndex * this.#pageSize) / next);
		this.#pageSize = next;
	}

	// User-initiated sort and filter changes restart paging; a data refetch underneath does not.
	setSorting(sorting: ColumnSort[]) {
		this.sorting = sorting;
		this.#pageIndex = 0;
	}
	setColumnFilters(filters: ColumnFilter[]) {
		this.columnFilters = filters;
		this.#pageIndex = 0;
	}
	resetColumnFilters() {
		this.setColumnFilters([]);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	get allColumns(): readonly Column<TData, any>[] {
		return this.#columns;
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	column(id: string): Column<TData, any> | undefined {
		return this.#columnsById.get(id);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly visibleColumns: readonly Column<TData, any>[] = $derived(this.#columns.filter((column) => column.isVisible));
	readonly headerGroups: readonly HeaderGroup<TData>[] = $derived([
		{ id: '0', headers: this.visibleColumns.map((column) => new Header(this, column)) },
	]);

	get selectedRowIds(): ReadonlySet<string> {
		return this.#selection;
	}
	setSelectedRowIds(ids: Iterable<string>) {
		const next = new Set(ids);
		for (const id of this.#selection) if (!next.has(id)) this.#selection.delete(id);
		for (const id of next) this.#selection.add(id);
	}

	readonly selectedRows: readonly Row<TData>[] = $derived(this.#coreRows.filter((row) => row.isSelected));
	readonly filteredSelectedRows: readonly Row<TData>[] = $derived(this.filteredRows.filter((row) => row.isSelected));

	readonly isAllPageRowsSelected = $derived(this.rows.length > 0 && this.rows.every((row) => row.isSelected));
	readonly isSomePageRowsSelected = $derived(this.isAllPageRowsSelected ? false : this.rows.some((row) => row.isSelected));
	toggleAllPageRowsSelected(value?: boolean) {
		const resolved = value ?? !this.isAllPageRowsSelected;
		for (const row of this.rows) row.toggleSelected(resolved);
	}

	/** Core rows minus every active filter except `columnId`'s own, so a facet counts its remaining options. */
	facetedRows(columnId: string): readonly Row<TData>[] {
		const masks = this.#activeFilters.flatMap((filter, index) => (filter.id === columnId ? [] : [this.#masks[index]!]));
		return masks.length === 0 ? this.#coreRows : this.#coreRows.filter((row) => masks.every((mask) => mask.has(row.id)));
	}
}

export class Column<TData, TValue = unknown> {
	readonly id: string;
	readonly columnDef: ColumnDef<TData, TValue>;
	readonly accessorFn?: (original: TData, index: number) => unknown;
	readonly filterFn: FilterFn<TData>;
	readonly #table: DataTable<TData>;

	constructor(table: DataTable<TData>, def: ColumnDef<TData, TValue>) {
		this.#table = table;
		this.columnDef = def;
		this.id = resolveColumnId(def);
		this.accessorFn = makeAccessor(def);
		this.filterFn = def.filterFn ?? includesString;
	}

	get canSort(): boolean {
		return (this.columnDef.enableSorting ?? true) && this.accessorFn !== undefined;
	}
	get isSorted(): false | 'asc' | 'desc' {
		const entry = this.#table.sorting.find((sort) => sort.id === this.id);
		return entry ? (entry.desc ? 'desc' : 'asc') : false;
	}

	// String columns start ascending, everything else descending (upstream's getAutoSortDir).
	#firstSortDir(): 'asc' | 'desc' {
		return typeof this.#table.filteredRows[0]?.getValue(this.id) === 'string' ? 'asc' : 'desc';
	}
	// Three-state cycle with removal: first direction → other direction → unsorted.
	#nextSortingOrder(): 'asc' | 'desc' | false {
		const first = this.#firstSortDir();
		const isSorted = this.isSorted;
		if (!isSorted) return first;
		if (isSorted !== first) return false;
		return isSorted === 'desc' ? 'asc' : 'desc';
	}

	toggleSorting(desc?: boolean, multi = false) {
		const nextOrder = this.#nextSortingOrder();
		const hasManualValue = desc !== undefined;
		const nextDesc = hasManualValue ? desc : nextOrder === 'desc';

		const old = this.#table.sorting;
		const existing = old.find((sort) => sort.id === this.id);
		const existingIndex = old.findIndex((sort) => sort.id === this.id);

		if (old.length > 0 && this.#canMultiSort && multi) {
			this.#table.setSorting(
				existing
					? !hasManualValue && nextOrder === false
						? old.filter((sort) => sort.id !== this.id)
						: old.map((sort) => (sort.id === this.id ? { ...sort, desc: nextDesc } : sort))
					: [...old, { id: this.id, desc: nextDesc }],
			);
			return;
		}

		// Single mode: only the most recently applied sort toggles through the cycle; anything else replaces.
		if (existing !== undefined && existingIndex === old.length - 1) {
			this.#table.setSorting(
				!hasManualValue && nextOrder === false
					? old.filter((sort) => sort.id !== this.id)
					: old.map((sort) => (sort.id === this.id ? { ...sort, desc: nextDesc } : sort)),
			);
			return;
		}
		this.#table.setSorting([{ id: this.id, desc: nextDesc }]);
	}

	get #canMultiSort(): boolean {
		return this.accessorFn !== undefined;
	}

	readonly sortHandler = (event: MouseEvent) => {
		if (!this.canSort) return;
		this.toggleSorting(undefined, this.#canMultiSort && event.shiftKey);
	};

	get canHide(): boolean {
		return this.columnDef.enableHiding ?? true;
	}
	get isVisible(): boolean {
		return this.#table.columnVisibility[this.id] ?? true;
	}
	set isVisible(visible: boolean) {
		if (!this.canHide || visible === this.isVisible) return;
		this.#table.columnVisibility = { ...this.#table.columnVisibility, [this.id]: visible };
	}

	get filterValue(): unknown {
		return this.#table.columnFilters.find((filter) => filter.id === this.id)?.value;
	}
	setFilterValue(value: unknown) {
		const others = this.#table.columnFilters.filter((filter) => filter.id !== this.id);
		this.#table.setColumnFilters(shouldAutoRemoveFilter(value) ? others : [...others, { id: this.id, value }]);
	}

	get facetedUniqueValues(): ReadonlyMap<unknown, number> {
		return facetCounts(this.#table.facetedRows(this.id), this.id);
	}
}

export class Row<TData> {
	readonly id: string;
	readonly index: number;
	readonly original: TData;
	readonly #table: DataTable<TData>;
	readonly #selection: SvelteSet<string>;
	// Plain Maps on purpose: both are written during $derived reads (sorting, templates), and a
	// reactive container there is a write-inside-read loop (effect_update_depth_exceeded).
	readonly #values = new Map<string, unknown>();
	readonly #cells = new Map<string, Cell<TData>>();

	constructor(table: DataTable<TData>, selection: SvelteSet<string>, original: TData, index: number) {
		this.#table = table;
		this.#selection = selection;
		this.original = original;
		this.index = index;
		this.id = String(index);
	}

	getValue<TValue = unknown>(columnId: string): TValue {
		if (this.#values.has(columnId)) return this.#values.get(columnId) as TValue;
		const value = this.#table.column(columnId)?.accessorFn?.(this.original, this.index);
		this.#values.set(columnId, value);
		return value as TValue;
	}

	get isSelected(): boolean {
		return this.#selection.has(this.id);
	}
	toggleSelected(value?: boolean) {
		if (value ?? !this.isSelected) this.#selection.add(this.id);
		else this.#selection.delete(this.id);
	}

	get visibleCells(): Cell<TData>[] {
		return this.#table.visibleColumns.map((column) => {
			let cell = this.#cells.get(column.id);
			if (cell === undefined) {
				cell = new Cell(this.#table, column, this);
				this.#cells.set(column.id, cell);
			}
			return cell;
		});
	}
}

export class Cell<TData, TValue = unknown> {
	readonly id: string;
	readonly column: Column<TData, TValue>;
	readonly row: Row<TData>;
	readonly context: CellContext<TData, TValue>;

	constructor(table: DataTable<TData>, column: Column<TData, TValue>, row: Row<TData>) {
		this.id = `${row.id}_${column.id}`;
		this.column = column;
		this.row = row;
		this.context = { table, column, row, cell: this };
	}
}

export class Header<TData, TValue = unknown> {
	readonly id: string;
	readonly colSpan = 1;
	readonly isPlaceholder = false;
	readonly column: Column<TData, TValue>;
	readonly context: HeaderContext<TData, TValue>;

	constructor(table: DataTable<TData>, column: Column<TData, TValue>) {
		this.id = column.id;
		this.column = column;
		this.context = { table, column, header: this };
	}
}

export interface HeaderGroup<TData> {
	id: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	headers: Header<TData, any>[];
}
