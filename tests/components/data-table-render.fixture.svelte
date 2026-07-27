<script lang="ts">
	import {
		createDataTable,
		FlexRender,
		selectColumn,
		textCell,
		type ColumnDef,
	} from '../../src/lib/components/data-table/index.js';

	type Item = { id: string; name: string };

	let { onNameCellRender }: { onNameCellRender: (id: string) => void } = $props();

	const data: Item[] = [
		{ id: 'a', name: 'Alpha' },
		{ id: 'b', name: 'Beta & Co' },
	];

	const columns: ColumnDef<Item>[] = [
		selectColumn(),
		{
			accessorKey: 'name',
			header: 'Name',
			cell: (context) => {
				onNameCellRender(context.row.original.id);
				return textCell<Item>('name')(context);
			},
		},
	];

	const table = createDataTable({ data: () => data, columns });
</script>

<table>
	<thead>
		{#each table.headerGroups as headerGroup (headerGroup.id)}
			<tr>
				{#each headerGroup.headers as header (header.id)}
					<th><FlexRender content={header.column.columnDef.header} context={header.context} /></th>
				{/each}
			</tr>
		{/each}
	</thead>
	<tbody>
		{#each table.rows as row (row.id)}
			<tr data-testid={`row-${row.original.id}`} data-selected={row.isSelected}>
				{#each row.visibleCells as cell (cell.id)}
					<td><FlexRender content={cell.column.columnDef.cell} context={cell.context} /></td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
