<script lang="ts">
	import * as DropdownMenu from '#lib/components/dropdown-menu/index.js';

	let {
		isStatic = false,
		onOpenChangeComplete = () => {},
	}: { isStatic?: boolean; onOpenChangeComplete?: (open: boolean) => void } = $props();

	let open = $state(false);
	export const setOpen = (value: boolean) => (open = value);
</script>

<DropdownMenu.Root bind:open {onOpenChangeComplete}>
	<DropdownMenu.Trigger data-testid="trigger">Open</DropdownMenu.Trigger>
	{#if isStatic}
		<DropdownMenu.ContentStatic data-testid="content">
			<DropdownMenu.Item data-testid="item-1">One</DropdownMenu.Item>
		</DropdownMenu.ContentStatic>
	{:else}
		<DropdownMenu.Content data-testid="content">
			<DropdownMenu.Item data-testid="item-1">One</DropdownMenu.Item>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger data-testid="sub-trigger">More</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent data-testid="sub-content">
					<DropdownMenu.Item data-testid="sub-item">Sub</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Item data-testid="item-2">Two</DropdownMenu.Item>
		</DropdownMenu.Content>
	{/if}
</DropdownMenu.Root>
