<script lang="ts" generics="TData">
	import * as DropdownMenu from '$lib/components/dropdown-menu';
	import { Button } from '$lib/components/button';
	import type { Column } from '@tanstack/table-core';
	import type { HTMLAttributes } from 'svelte/elements';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';

	let { column, title, class: className, ...restProps }: { column: Column<TData>; title: string } & HTMLAttributes<HTMLDivElement> = $props();
</script>

{#if !column?.getCanSort()}
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
					<Button {...props} variant="ghost" size="sm" class="data-[state=open]:bg-accent -ms-3">
						<span>
							{title}
						</span>
						{#if column.getIsSorted() === 'desc'}
							<ArrowDownIcon />
						{:else if column.getIsSorted() === 'asc'}
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
