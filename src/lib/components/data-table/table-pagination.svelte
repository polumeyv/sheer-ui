<script lang="ts" generics="TData">
	import type { Table } from '@tanstack/table-core';
	import * as Select from '../select/index';
	import { Button } from '../button';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronsLeftIcon from '@lucide/svelte/icons/chevrons-left';
	import ChevronsRightIcon from '@lucide/svelte/icons/chevrons-right';

	let {
		table,
	}: {
		table: Table<TData>;
		showSelected?: boolean;
	} = $props();
</script>

<div class="flex items-center justify-between px-2">
	<div class="text-muted-foreground flex-1 text-sm">
		{table.getFilteredSelectedRowModel().rows.length} of
		{table.getFilteredRowModel().rows.length} row(s) selected.
	</div>
	{#if table.getFilteredRowModel().rows.length > table.getState().pagination.pageSize}
		<div class="flex items-center space-x-6 lg:space-x-8">
			<div class="flex items-center space-x-2">
				<p class="text-sm font-medium">Rows per page</p>
				<Select.Root
					class="w-17.5!"
					side="top"
					value={`${table.getState().pagination.pageSize}`}
					onchange={(e) => table.setPageSize(Number(e.currentTarget.value))}>
					{#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
						<Select.Option value={`${pageSize}`}>{pageSize}</Select.Option>
					{/each}
				</Select.Root>
			</div>
			<div class="grid w-25 place-items-center text-sm font-medium">
				Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
			</div>
			{#snippet navBtn(onclick: () => void, disabled: boolean, label: string, Icon: typeof ChevronLeftIcon, lgOnly = false)}
				<Button variant="outline" size="icon-sm" class={lgOnly ? 'max-lg:hidden' : undefined} {onclick} {disabled}>
					<span class="sr-only">{label}</span>
					<Icon />
				</Button>
			{/snippet}
			<div class="flex items-center space-x-2">
				{@render navBtn(() => table.setPageIndex(0), !table.getCanPreviousPage(), 'Go to first page', ChevronsLeftIcon, true)}
				{@render navBtn(() => table.previousPage(), !table.getCanPreviousPage(), 'Go to previous page', ChevronLeftIcon)}
				{@render navBtn(() => table.nextPage(), !table.getCanNextPage(), 'Go to next page', ChevronRightIcon)}
				{@render navBtn(() => table.setPageIndex(table.getPageCount() - 1), !table.getCanNextPage(), 'Go to last page', ChevronsRightIcon, true)}
			</div>
		</div>
	{/if}
</div>
