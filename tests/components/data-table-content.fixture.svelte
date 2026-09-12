<script lang="ts">
	import {
		createDataTable,
		DataTableContent,
		DataTablePagination,
		DataTableToolbar,
		mutedCell,
		renderSnippet,
		selectColumn,
		textCell,
		textHeader,
		type ColumnDef,
	} from '../../src/lib/components/data-table/index.js';

	type Item = { name: string; note: string | null };
	let {
		data = [
			{ name: 'Beta', note: null },
			{ name: 'Alpha', note: 'first' },
			{ name: 'Gamma', note: 'last' },
		],
		noteLabel = 'Note',
		onRowClick,
		onAction,
	}: {
		data?: Item[];
		noteLabel?: string;
		onRowClick?: (row: Item) => void;
		onAction?: (row: Item) => void;
	} = $props();

	const columns: ColumnDef<Item>[] = [
		selectColumn(),
		{ accessorKey: 'name', header: 'Name', cell: textCell('name', { bold: true }) },
		{
			accessorKey: 'note',
			header: () => textHeader(noteLabel)(),
			cell: mutedCell('note', { prefix: '<', suffix: '>' }),
			meta: { class: 'text-right' },
		},
		{ id: 'actions', header: '', cell: ({ row }) => renderSnippet(action, row.original) },
	];
	const table = createDataTable({ data: () => data, columns, pageSize: 2 });
</script>

{#snippet action(row: Item)}
	<button onclick={() => onAction?.(row)}>Action <strong>{row.name}</strong></button>
{/snippet}

<DataTableToolbar {table} disabled={data.length === 0} searchColumn="name" searchPlaceholder="Filter names..." />
<DataTableContent {table} {onRowClick} sortableHeaders />
<DataTablePagination {table} />
<button onclick={() => (table.column('note')!.isVisible = false)}>Hide note</button>
