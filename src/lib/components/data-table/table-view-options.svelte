<script lang="ts" generics="TData">
	import { join } from 'overrule';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import type { Table } from '@tanstack/table-core';
	import * as DropdownMenu from '../dropdown-menu';
	import { buttonVariants } from '../button';
	let { table }: { table: Table<TData> } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={join(buttonVariants({ variant: 'outline', size: 'sm' }), 'ms-auto max-lg:hidden')}>
		<Settings2Icon />
		View
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Toggle columns</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			{#each table.getAllColumns().filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide()) as column (column)}
				<DropdownMenu.CheckboxItem bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)} class="capitalize">
					{column.id}
				</DropdownMenu.CheckboxItem>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
