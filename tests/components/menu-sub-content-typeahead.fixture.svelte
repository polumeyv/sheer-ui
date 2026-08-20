<script lang="ts">
	import * as DropdownMenu from '#lib/components/dropdown-menu/index.js';

	let { isStatic = false }: { isStatic?: boolean } = $props();
</script>

<DropdownMenu.Root open>
	{#snippet children()}
		<DropdownMenu.Trigger data-testid="trigger">Open</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Item>other</DropdownMenu.Item>
			<DropdownMenu.Sub open>
				<DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
				{#if isStatic}
					<DropdownMenu.SubContentStatic data-testid="subcontent">
						<DropdownMenu.Item data-testid="alpha">alpha</DropdownMenu.Item>
						<DropdownMenu.Item data-testid="apple">apple</DropdownMenu.Item>
					</DropdownMenu.SubContentStatic>
				{:else}
					<DropdownMenu.SubContent data-testid="subcontent">
						<DropdownMenu.Item data-testid="alpha">alpha</DropdownMenu.Item>
						<DropdownMenu.Item data-testid="apple">apple</DropdownMenu.Item>
					</DropdownMenu.SubContent>
				{/if}
			</DropdownMenu.Sub>
		</DropdownMenu.Content>
	{/snippet}
</DropdownMenu.Root>
