<script lang="ts" generics="TData">
	import type { Row } from '../../internal/table/index.js';
	import type { Snippet } from 'svelte';
	import * as DropdownMenu from '../dropdown-menu';
	import { Button } from '../button';
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';

	let {
		row,
		children,
	}: {
		row: Row<TData>;
		children: Snippet<[{ row: Row<TData>; original: TData }]>;
	} = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon-sm" class="data-open:bg-muted">
				<EllipsisIcon />
				<span class="sr-only">Open Menu</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-40" align="end">
		{@render children({ row, original: row.original })}
	</DropdownMenu.Content>
</DropdownMenu.Root>
