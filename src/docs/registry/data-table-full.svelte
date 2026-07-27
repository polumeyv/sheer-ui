<script lang="ts" module>
	type Payment = {
		id: string;
		amount: number;
		status: 'pending' | 'processing' | 'success' | 'failed';
		email: string;
	};
</script>

<script lang="ts">
	import * as Table from '../../lib/components/table/index.js';
	import {
		type ColumnDef,
		createDataTable,
		FlexRender,
		renderComponent,
		selectColumn,
		textCell,
		mutedCell,
		DataTableToolbar,
		DataTablePagination,
		DataTableViewOptions,
		DataTableColumnHeader
	} from '../../lib/components/data-table/index.js';

	const data: Payment[] = [
		{ id: 'm5gr84i9', amount: 316, status: 'success', email: 'ken99@example.com' },
		{ id: '3u1reuv4', amount: 242, status: 'success', email: 'abe45@example.com' },
		{ id: 'derv1ws0', amount: 837, status: 'processing', email: 'monserrat44@example.com' },
		{ id: '5kma53ae', amount: 874, status: 'success', email: 'silas22@example.com' },
		{ id: 'bhqecj4p', amount: 721, status: 'failed', email: 'carmella@example.com' },
		{ id: 'k2j4h6l8', amount: 450, status: 'pending', email: 'liam3@example.com' },
		{ id: 'p9o8i7u6', amount: 129, status: 'success', email: 'noah11@example.com' },
		{ id: 'q1w2e3r4', amount: 655, status: 'processing', email: 'emma7@example.com' },
		{ id: 'a5s6d7f8', amount: 380, status: 'failed', email: 'olivia9@example.com' },
		{ id: 'z9x8c7v6', amount: 205, status: 'success', email: 'ava21@example.com' },
		{ id: 'b1n2m3l4', amount: 990, status: 'pending', email: 'mia5@example.com' },
		{ id: 'g5h6j7k8', amount: 74, status: 'success', email: 'lucas88@example.com' },
		{ id: 't9r8e7w6', amount: 530, status: 'processing', email: 'mason14@example.com' },
		{ id: 'y1u2i3o4', amount: 615, status: 'success', email: 'sophia2@example.com' },
		{ id: 'c5v6b7n8', amount: 289, status: 'failed', email: 'ethan30@example.com' },
		{ id: 'd9f8g7h6', amount: 480, status: 'success', email: 'isabella6@example.com' },
		{ id: 'e1r2t3y4', amount: 155, status: 'pending', email: 'logan42@example.com' },
		{ id: 'f5g6h7j8', amount: 823, status: 'success', email: 'charlotte1@example.com' },
		{ id: 'h9j8k7l6', amount: 342, status: 'processing', email: 'jack19@example.com' },
		{ id: 'i1o2p3q4', amount: 767, status: 'success', email: 'amelia77@example.com' },
		{ id: 'j5k6l7z8', amount: 98, status: 'failed', email: 'oliver23@example.com' },
		{ id: 'l9z8x7c6', amount: 501, status: 'success', email: 'harper35@example.com' },
		{ id: 'n1m2b3v4', amount: 268, status: 'pending', email: 'henry50@example.com' }
	];

	const statuses = [
		{ value: 'pending', label: 'Pending' },
		{ value: 'processing', label: 'Processing' },
		{ value: 'success', label: 'Success' },
		{ value: 'failed', label: 'Failed' }
	];

	const columns: ColumnDef<Payment>[] = [
		selectColumn(),
		{
			accessorKey: 'status',
			header: 'Status',
			cell: mutedCell('status'),
			filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id))
		},
		{
			accessorKey: 'email',
			header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Email' }),
			cell: textCell('email')
		},
		{
			accessorKey: 'amount',
			header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Amount' }),
			cell: textCell((row) => `$${row.amount.toFixed(2)}`, { bold: true })
		}
	];

	const table = createDataTable({ data: () => data, columns, pageSize: 10 });
</script>

<div class="w-full max-w-3xl space-y-4">
	<div class="flex items-start gap-2">
		<div class="flex-1">
			<DataTableToolbar
				{table}
				searchColumn="email"
				searchPlaceholder="Filter emails..."
				filters={[{ column: 'status', title: 'Status', options: statuses }]} />
		</div>
		<DataTableViewOptions {table} />
	</div>
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.headerGroups as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head class="has-[[role=checkbox]]:ps-3">
								{#if !header.isPlaceholder}
									<FlexRender content={header.column.columnDef.header} context={header.context} />
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.rows as row (row.id)}
					<Table.Row data-state={row.isSelected && 'selected'}>
						{#each row.visibleCells as cell (cell.id)}
							<Table.Cell class="has-[[role=checkbox]]:ps-3">
								<FlexRender content={cell.column.columnDef.cell} context={cell.context} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<DataTablePagination {table} />
</div>
