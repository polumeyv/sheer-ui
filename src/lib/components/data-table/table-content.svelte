<script lang="ts" generics="TData">
	import type { ClassValue } from 'svelte/elements';
	import type { DataTable } from '../../internal/table/index.js';
	import * as Table from '../table/index.js';
	import FlexRender from './flex-render.svelte';
	import SortButton from './data-table-sort-button.svelte';

	let {
		table,
		class: className,
		sortableHeaders = false,
		emptyMessage = 'No results.',
		onRowClick,
	}: {
		table: DataTable<TData>;
		class?: ClassValue;
		sortableHeaders?: boolean;
		emptyMessage?: string;
		onRowClick?: (row: TData) => void;
	} = $props();
</script>

<Table.Root class={className}>
	<Table.Header>
		{#each table.headerGroups as headerGroup (headerGroup.id)}
			<Table.Row>
				{#each headerGroup.headers as header (header.id)}
					<Table.Head colspan={header.colSpan} class="has-[[role=checkbox]]:ps-3 {header.column.columnDef.meta?.class ?? ''}">
						{#if !header.isPlaceholder}
							{#if sortableHeaders && typeof header.column.columnDef.header === 'string' && header.column.canSort}
								<SortButton label={header.column.columnDef.header} onclick={header.column.sortHandler} />
							{:else}
								<FlexRender content={header.column.columnDef.header} context={header.context} />
							{/if}
						{/if}
					</Table.Head>
				{/each}
			</Table.Row>
		{/each}
	</Table.Header>
	<Table.Body>
		{#each table.rows as row (row.id)}
			<Table.Row
				data-state={row.isSelected && 'selected'}
				class={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
				onclick={(event: MouseEvent) => {
					if ((event.target as HTMLElement).closest('[role="checkbox"], button, a, input, select, textarea')) return;
					onRowClick?.(row.original);
				}}>
				{#each row.visibleCells as cell (cell.id)}
					<Table.Cell class="has-[[role=checkbox]]:ps-3 {cell.column.columnDef.meta?.class ?? ''}">
						<FlexRender content={cell.column.columnDef.cell} context={cell.context} />
					</Table.Cell>
				{/each}
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={table.visibleColumns.length} class="h-24 text-center">{emptyMessage}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
