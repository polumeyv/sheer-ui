<script lang="ts" generics="TData">
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import type { DataTable } from '../../internal/table/index.js';
	import * as DropdownMenu from '../dropdown-menu';
	import { buttonVariants } from '../button';
	let { table }: { table: DataTable<TData> } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline', size: 'sm', class: 'ms-auto max-lg:hidden' })}>
		<Settings2Icon />
		View
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Toggle columns</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			{#each table.allColumns.filter((col) => typeof col.accessorFn !== 'undefined' && col.canHide) as column (column)}
				<DropdownMenu.CheckboxItem bind:checked={() => column.isVisible, (v) => column.toggleVisibility(!!v)} class="capitalize">
					{column.id}
				</DropdownMenu.CheckboxItem>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
