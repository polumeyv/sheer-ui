<script lang="ts" generics="TData, TValue">
import {
	type ColumnDef,
	type ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type RowSelectionState,
	type SortingState,
	type VisibilityState,
} from '@tanstack/table-core';
import * as DropdownMenu from '@polumeyv/ui/dropdown-menu';
import * as InputGroup from '@polumeyv/ui/input-group';
import * as Select from '@polumeyv/ui/select';
import * as Table from '@polumeyv/ui/table';
import { Button } from '@polumeyv/ui/button';
import { createSvelteTable, FlexRender } from '@polumeyv/ui/data-table';
import SearchIcon from '@lucide/svelte/icons/search';

import type { Snippet } from 'svelte';

type DataTableProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchColumn?: string;
	searchPlaceholder?: string;
	toolbar?: Snippet;
	actions?: Snippet<[{ selectedRows: TData[] }]>;
	onRowClick?: (row: TData) => void;
};

let {
	data,
	columns,
	searchColumn = 'clientName',
	searchPlaceholder = 'Search...',
	toolbar,
	actions,
	onRowClick,
}: DataTableProps<TData, TValue> = $props();

let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
let sorting = $state<SortingState>([]);
let columnFilters = $state<ColumnFiltersState>([]);
let columnVisibility = $state<VisibilityState>({});
let rowSelection = $state<RowSelectionState>({});

const table = createSvelteTable({
	get data() {
		return data;
	},
	get columns() {
		return columns;
	},
	getCoreRowModel: getCoreRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
	getSortedRowModel: getSortedRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
	onPaginationChange: (updater) => {
		if (typeof updater === 'function') {
			pagination = updater(pagination);
		} else {
			pagination = updater;
		}
	},
	onSortingChange: (updater) => {
		if (typeof updater === 'function') {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}
	},
	onColumnFiltersChange: (updater) => {
		if (typeof updater === 'function') {
			columnFilters = updater(columnFilters);
		} else {
			columnFilters = updater;
		}
	},
	onColumnVisibilityChange: (updater) => {
		if (typeof updater === 'function') {
			columnVisibility = updater(columnVisibility);
		} else {
			columnVisibility = updater;
		}
	},
	onRowSelectionChange: (updater) => {
		if (typeof updater === 'function') {
			rowSelection = updater(rowSelection);
		} else {
			rowSelection = updater;
		}
	},
	state: {
		get pagination() {
			return pagination;
		},
		get sorting() {
			return sorting;
		},
		get columnFilters() {
			return columnFilters;
		},
		get columnVisibility() {
			return columnVisibility;
		},
		get rowSelection() {
			return rowSelection;
		},
	},
});

const selectedRows = $derived(table.getFilteredSelectedRowModel().rows.map((row) => row.original));

const totalRows = $derived(table.getFilteredRowModel().rows.length);
const showPagination = $derived(totalRows > 10);
const pageSizeOptions = [10, 25, 50, 100];
</script>

<div>
	<div class="flex items-center gap-2 pb-4">
		<InputGroup.Root class="w-64">
			<InputGroup.Addon><SearchIcon /></InputGroup.Addon>
			<InputGroup.Input
				placeholder={searchPlaceholder}
				value={(table.getColumn(searchColumn)?.getFilterValue() as string) ??
					''}
				oninput={(e : Event ) =>
					table.getColumn(searchColumn)?.setFilterValue(
						(e.currentTarget as HTMLInputElement).value,
					)}
			/>
		</InputGroup.Root>
		{#if toolbar}
			{@render toolbar()}
		{/if}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button variant="outline">Columns</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="min-w-48! w-48">
				{#each table.getAllColumns().filter((col) => col.getCanHide()) as
					column
					(column.id)
				}
					<DropdownMenu.CheckboxItem
						class="capitalize"
						checked={column.getIsVisible()}
						onCheckedChange={(v : boolean | 'indeterminate') => column.toggleVisibility(!!v)}
					>
						{column.id}
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<div class="flex-1"></div>
		{#if actions}
			{@render actions({ selectedRows })}
		{/if}
	</div>
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head
							colspan={header.colSpan}
							class="[&:has([role=checkbox])]:ps-3"
						>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row
					data-state={row.getIsSelected() && 'selected'}
					class={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
					onclick={(e : MouseEvent) => {
						// Don't trigger row click if clicking on checkbox or interactive elements
						const target = e.target as HTMLElement;
						if (
							target.closest('[role="checkbox"]') ||
							target.closest('button') || target.closest('a')
						) return;
						onRowClick?.(row.original);
					}}
				>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell class="[&:has([role=checkbox])]:ps-3">
							<FlexRender
								content={cell.column.columnDef.cell}
								context={cell.getContext()}
							/>
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">
						No results.
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
	{#if showPagination}
		<div class="flex items-center justify-between gap-2 pt-4">
			<div class="flex items-center gap-2">
				<span class="text-muted-foreground text-sm">Rows per page</span>
				<Select.Root
					type="single"
					value={String(pagination.pageSize)}
					onValueChange={(v : string) => table.setPageSize(Number(v))}
				>
					<Select.Trigger class="h-8 w-18">
						{pagination.pageSize}
					</Select.Trigger>
					<Select.Content>
						{#each pageSizeOptions as size (size)}
							<Select.Item value={String(size)}>{size}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<span class="text-muted-foreground text-sm">
					{table.getFilteredSelectedRowModel().rows.length} of {totalRows}
					row(s) selected
				</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-muted-foreground text-sm">
					Page {pagination.pageIndex + 1} of {table.getPageCount()}
				</span>
				<Button
					variant="outline"
					size="sm"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	{/if}
</div>
