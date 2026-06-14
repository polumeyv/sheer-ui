<script lang="ts">
	import {
		type ColumnDef,
		type SortingState,
		type RowSelectionState,
		type ColumnFiltersState,
		type PaginationState,
		getCoreRowModel,
		getSortedRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
	} from '@tanstack/table-core';
	import {
		FlexRender,
		SortButton,
		createSvelteTable,
		renderComponent,
		renderSnippet,
		selectColumn,
	} from '$lib/components/data-table/index';
	import * as Table from '$lib/components/table/index';
	import { Button } from '$lib/components/button/index';

	// Shared class strings, factored out so each example stays copy-paste sized.
	const SHELL = 'w-full max-w-md rounded-md border';
	const FILTER_INPUT =
		'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-9 w-full max-w-sm rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none';

	type Invoice = {
		invoice: string;
		status: string;
		amount: number;
	};

	const data: Invoice[] = [
		{ invoice: 'INV-001', status: 'Paid', amount: 250 },
		{ invoice: 'INV-002', status: 'Pending', amount: 150 },
		{ invoice: 'INV-003', status: 'Unpaid', amount: 350 },
		{ invoice: 'INV-004', status: 'Paid', amount: 450 },
	];

	// A longer dataset so pagination has multiple pages.
	const ledger: Invoice[] = Array.from({ length: 23 }, (_, i) => ({
		invoice: `INV-${String(i + 1).padStart(3, '0')}`,
		status: ['Paid', 'Pending', 'Unpaid'][i % 3],
		amount: 100 + ((i * 37) % 400),
	}));

	// 1 — sorting (the preserved original example)
	const sortColumns: ColumnDef<Invoice>[] = [
		{
			accessorKey: 'invoice',
			header: ({ column }) =>
				renderComponent(SortButton, {
					label: 'Invoice',
					onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
				}),
			cell: ({ row }) => row.original.invoice,
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => row.original.status,
		},
		{
			accessorKey: 'amount',
			header: () => renderSnippet(amountHeader, undefined),
			cell: ({ row }) => `$${row.original.amount.toFixed(2)}`,
		},
	];

	let sorting = $state<SortingState>([]);

	const sortTable = createSvelteTable({
		get data() {
			return data;
		},
		columns: sortColumns,
		state: {
			get sorting() {
				return sorting;
			},
		},
		onSortingChange: (updater) => {
			sorting = typeof updater === 'function' ? updater(sorting) : updater;
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	// 2 — row selection (checkbox column)
	const selectColumns: ColumnDef<Invoice>[] = [
		selectColumn<Invoice>(),
		{
			accessorKey: 'invoice',
			header: 'Invoice',
			cell: ({ row }) => row.original.invoice,
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => row.original.status,
		},
	];

	let rowSelection = $state<RowSelectionState>({});

	const selectTable = createSvelteTable({
		get data() {
			return data;
		},
		columns: selectColumns,
		state: {
			get rowSelection() {
				return rowSelection;
			},
		},
		onRowSelectionChange: (updater) => {
			rowSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
		},
		getCoreRowModel: getCoreRowModel(),
	});

	// 3 — filtering (text filter on the invoice column)
	const filterColumns: ColumnDef<Invoice>[] = [
		{
			accessorKey: 'invoice',
			header: 'Invoice',
			cell: ({ row }) => row.original.invoice,
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => row.original.status,
		},
		{
			accessorKey: 'amount',
			header: 'Amount',
			cell: ({ row }) => `$${row.original.amount.toFixed(2)}`,
		},
	];

	let columnFilters = $state<ColumnFiltersState>([]);

	const filterTable = createSvelteTable({
		get data() {
			return data;
		},
		columns: filterColumns,
		state: {
			get columnFilters() {
				return columnFilters;
			},
		},
		onColumnFiltersChange: (updater) => {
			columnFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	const invoiceFilter = $derived(
		(filterTable.getColumn('invoice')?.getFilterValue() as string) ?? ''
	);

	// 4 — pagination
	const pageColumns: ColumnDef<Invoice>[] = [
		{
			accessorKey: 'invoice',
			header: 'Invoice',
			cell: ({ row }) => row.original.invoice,
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => row.original.status,
		},
		{
			accessorKey: 'amount',
			header: 'Amount',
			cell: ({ row }) => `$${row.original.amount.toFixed(2)}`,
		},
	];

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 5 });

	const pageTable = createSvelteTable({
		get data() {
			return ledger;
		},
		columns: pageColumns,
		state: {
			get pagination() {
				return pagination;
			},
		},
		onPaginationChange: (updater) => {
			pagination = typeof updater === 'function' ? updater(pagination) : updater;
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});
</script>

{#snippet amountHeader()}
	<span class="block text-right">Amount</span>
{/snippet}

{#snippet tableShell(t: typeof sortTable)}
	<Table.Root>
		<Table.Header>
			{#each t.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head>
							{#if !header.isPlaceholder}
								<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each t.getRowModel().rows as row (row.id)}
				<Table.Row data-state={row.getIsSelected() ? 'selected' : undefined}>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={t.getAllColumns().length} class="text-muted-foreground h-24 text-center">
						No results.
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/snippet}

<div class="flex w-full max-w-md flex-col gap-10">
	<!-- 1 — sorting -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Sorting</h3>
			<p class="text-muted-foreground mt-1 text-xs">Click the Invoice header to sort.</p>
		</div>
		<div class={SHELL}>
			{@render tableShell(sortTable)}
		</div>
	</section>

	<!-- 2 — row selection -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Row selection</h3>
			<p class="text-muted-foreground mt-1 text-xs">Checkbox column with a select-all header.</p>
		</div>
		<div class={SHELL}>
			{@render tableShell(selectTable)}
		</div>
		<p class="text-muted-foreground text-xs">
			{selectTable.getFilteredSelectedRowModel().rows.length} of
			{selectTable.getFilteredRowModel().rows.length} row(s) selected.
		</p>
	</section>

	<!-- 3 — filtering -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Filtering</h3>
			<p class="text-muted-foreground mt-1 text-xs">Filter rows by invoice number.</p>
		</div>
		<input
			value={invoiceFilter}
			oninput={(e) => filterTable.getColumn('invoice')?.setFilterValue(e.currentTarget.value)}
			placeholder="Filter invoices…"
			aria-label="Filter invoices"
			class={FILTER_INPUT}
		/>
		<div class={SHELL}>
			{@render tableShell(filterTable)}
		</div>
	</section>

	<!-- 4 — pagination -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Pagination</h3>
			<p class="text-muted-foreground mt-1 text-xs">Five rows per page with prev / next controls.</p>
		</div>
		<div class={SHELL}>
			{@render tableShell(pageTable)}
		</div>
		<div class="flex items-center justify-between gap-2">
			<p class="text-muted-foreground text-xs">
				Page {pageTable.getState().pagination.pageIndex + 1} of {pageTable.getPageCount()}
			</p>
			<div class="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					onclick={() => pageTable.previousPage()}
					disabled={!pageTable.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={() => pageTable.nextPage()}
					disabled={!pageTable.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	</section>
</div>
