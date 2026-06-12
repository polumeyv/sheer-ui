<script lang="ts" generics="TData">
	import type { Component } from 'svelte';
	import XIcon from '@lucide/svelte/icons/x';
	import type { Table } from '@tanstack/table-core';
	import { Button } from '@polumeyv/ui/button';
	import { Input } from '@polumeyv/ui/input';
	import { DataTableFacetedFilter } from './index.js';

	let {
		table,
		searchColumn,
		searchPlaceholder,
		filters,
		disabled,
	}: {
		table: Table<TData>;
		searchColumn?: string;
		searchPlaceholder?: string;
		filters?: Array<{
			column: string;
			title: string;
			options: Array<{ value: string; label: string; icon?: Component }>;
		}>;
		disabled?: boolean;
	} = $props();

	const isFiltered = $derived(table.getState().columnFilters.length > 0);
</script>

<div class="flex items-center justify-between">
	{#if searchColumn}
		<Input
			{disabled}
			placeholder={searchPlaceholder ?? 'Filter...'}
			value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
			oninput={(e) => table.getColumn(searchColumn)?.setFilterValue(e.currentTarget.value)}
			onchange={(e) => table.getColumn(searchColumn)?.setFilterValue(e.currentTarget.value)}
			class="h-8 w-37.5 lg:w-62.5" />
	{/if}
	<div class="flex items-center space-x-2">
		{#each filters as filter (filter.column)}
			{const col = table.getColumn(filter.column)}
			{#if col}
				<DataTableFacetedFilter {disabled} column={col} title={filter.title} options={filter.options} />
			{/if}
		{/each}

		{#if isFiltered}
			<Button variant="ghost" {disabled} onclick={() => table.resetColumnFilters()} class="h-8! px-2! lg:px-3!">
				Reset
				<XIcon />
			</Button>
		{/if}
	</div>
</div>
