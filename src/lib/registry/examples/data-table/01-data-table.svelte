<script lang="ts" module>
	type Payment = {
		id: string;
		amount: number;
		status: 'pending' | 'processing' | 'success' | 'failed';
		email: string;
	};
</script>

<script lang="ts">
	import { type ColumnDef, getCoreRowModel, getSortedRowModel, type SortingState } from '@tanstack/table-core';
	import * as Table from '$lib/components/table/index.js';
	import {
		createSvelteTable,
		FlexRender,
		renderComponent,
		textCell,
		textHeader,
		SortButton
	} from '$lib/components/data-table/index.js';

	const data: Payment[] = [
		{ id: 'm5gr84i9', amount: 316, status: 'success', email: 'ken99@example.com' },
		{ id: '3u1reuv4', amount: 242, status: 'success', email: 'abe45@example.com' },
		{ id: 'derv1ws0', amount: 837, status: 'processing', email: 'monserrat44@example.com' },
		{ id: '5kma53ae', amount: 874, status: 'success', email: 'silas22@example.com' },
		{ id: 'bhqecj4p', amount: 721, status: 'failed', email: 'carmella@example.com' }
	];

	const columns: ColumnDef<Payment>[] = [
		{ accessorKey: 'status', header: textHeader('Status'), cell: textCell('status') },
		{ accessorKey: 'email', header: textHeader('Email'), cell: textCell('email') },
		{
			accessorKey: 'amount',
			header: ({ column }) =>
				renderComponent(SortButton, {
					label: 'Amount',
					class: '-ms-3',
					onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
				}),
			cell: textCell((row) => `$${row.amount.toFixed(2)}`, { bold: true })
		}
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
			}
		},
		onSortingChange: (updater) => {
			sorting = typeof updater === 'function' ? updater(sorting) : updater;
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});
</script>

<div class="w-full max-w-2xl rounded-md border">
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
