<script lang="ts" generics="TData">
	import * as DropdownMenu from '../dropdown-menu';
	import { Button } from '../button';
	import type { Column } from '../../internal/table/index.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';

	let { column, title, class: className, ...restProps }: { column: Column<TData>; title: string } & HTMLAttributes<HTMLDivElement> = $props();
</script>

{#if !column?.canSort}
	<div class={className} {...restProps}>
		{title}
	</div>
{:else}
	<div class="flex items-center" {...restProps}>
		{#snippet item(onclick: () => void, Icon: typeof ArrowUpIcon, label: string)}
			<DropdownMenu.Item {onclick}>
				<Icon class="text-muted-foreground/70 me-2 size-3.5" />
				{label}
			</DropdownMenu.Item>
		{/snippet}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="ghost" size="sm" class="data-open:bg-accent -ms-3">
						<span>
							{title}
						</span>
						{#if column.isSorted === 'desc'}
							<ArrowDownIcon />
						{:else if column.isSorted === 'asc'}
							<ArrowUpIcon />
						{:else}
							<ChevronsUpDownIcon />
						{/if}
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="start">
				{@render item(() => column.toggleSorting(false), ArrowUpIcon, 'Asc')}
				{@render item(() => column.toggleSorting(true), ArrowDownIcon, 'Desc')}
				<DropdownMenu.Separator />
				{@render item(() => column.toggleVisibility(false), EyeOffIcon, 'Hide')}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
{/if}
