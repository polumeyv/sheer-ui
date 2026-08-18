<script lang="ts">
	import * as ContextMenu from '#lib/components/context-menu/index.js';
	import * as DropdownMenu from '#lib/components/dropdown-menu/index.js';
	import { Menubar } from '#lib/components/menubar/index.js';

	let { family, isStatic = false }: { family: 'context-menu' | 'dropdown-menu' | 'menubar'; isStatic?: boolean } = $props();

	let menubarValue = $state('file');
</script>

{#if family === 'dropdown-menu'}
	<DropdownMenu.Root open>
		{#snippet children(menu)}
			<output data-testid="open">{String(menu.open)}</output>
			<DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
			{#if isStatic}
				<DropdownMenu.ContentStatic forceMount>
					<DropdownMenu.Item>One</DropdownMenu.Item>
				</DropdownMenu.ContentStatic>
			{:else}
				<DropdownMenu.Content>
					<DropdownMenu.Item>One</DropdownMenu.Item>
				</DropdownMenu.Content>
			{/if}
		{/snippet}
	</DropdownMenu.Root>
{:else if family === 'context-menu'}
	<ContextMenu.Root open>
		{#snippet children(menu)}
			<output data-testid="open">{String(menu.open)}</output>
			<ContextMenu.Trigger>Right click</ContextMenu.Trigger>
			{#if isStatic}
				<ContextMenu.ContentStatic forceMount>
					<ContextMenu.Item>One</ContextMenu.Item>
				</ContextMenu.ContentStatic>
			{:else}
				<ContextMenu.Content>
					<ContextMenu.Item>One</ContextMenu.Item>
				</ContextMenu.Content>
			{/if}
		{/snippet}
	</ContextMenu.Root>
{:else}
	<Menubar.Root bind:value={menubarValue}>
		<output data-testid="open">{String(menubarValue !== '')}</output>
		<Menubar.Menu value="file">
			<Menubar.Trigger>File</Menubar.Trigger>
			{#if isStatic}
				<Menubar.ContentStatic forceMount>
					<Menubar.Item>One</Menubar.Item>
				</Menubar.ContentStatic>
			{:else}
				<Menubar.Content>
					<Menubar.Item>One</Menubar.Item>
				</Menubar.Content>
			{/if}
		</Menubar.Menu>
	</Menubar.Root>
{/if}
