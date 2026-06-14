<script lang="ts">
	import {
		type ColumnDef,
		type SortingState,
		getCoreRowModel,
		getSortedRowModel,
	} from '@tanstack/table-core';
	import {
		FlexRender,
		SortButton,
		createSvelteTable,
		renderComponent,
		renderSnippet,
	} from '$lib/components/data-table/index';
	import * as Table from '$lib/components/table/index';

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

	const columns: ColumnDef<Invoice>[] = [
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

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
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
</script>

{#snippet amountHeader()}
	<span class="text-right block">Amount</span>
{/snippet}

<div class="w-full max-w-md rounded-md border">
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
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
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
