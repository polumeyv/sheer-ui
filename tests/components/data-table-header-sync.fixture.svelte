<script lang="ts">
	import {
		createDataTable,
		FlexRender,
		renderComponent,
		selectColumn,
		type ColumnDef,
	} from '../../src/lib/components/data-table/index.js';
	import { DataTableCheckbox } from '../../src/lib/components/data-table/index.js';

	type Item = { id: string };

	let { onHeaderRender }: { onHeaderRender: (checked: boolean) => void } = $props();

	const data: Item[] = Array.from({ length: 4 }, (_, i) => ({ id: `r${i}` }));

	const base = selectColumn<Item>();
	const columns: ColumnDef<Item>[] = [
		{
			...base,
			header: (context) => {
				onHeaderRender(context.table.isAllPageRowsSelected);
				return renderComponent(DataTableCheckbox, {
					checked: context.table.isAllPageRowsSelected,
					'aria-label': 'Select all',
				});
			},
		},
		{ accessorKey: 'id', header: 'Id' },
	];

	const table = createDataTable({ data: () => data, columns, pageSize: 2 });

	export function nextPage() {
		table.nextPage();
	}
	export function selectAllPage() {
		table.toggleAllPageRowsSelected(true);
	}
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
			<tr data-testid={`row-${row.original.id}`}>
				{#each row.visibleCells as cell (cell.id)}
					<td><FlexRender content={cell.column.columnDef.cell} context={cell.context} /></td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
