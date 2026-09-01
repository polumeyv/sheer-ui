<script lang="ts">
	import { Menubar } from '#lib/components/menubar/index.js';

	let { onOpenChangeComplete }: { onOpenChangeComplete: (menu: string, open: boolean) => void } = $props();

	let value = $state('file');
</script>

<Menubar.Root bind:value>
	<Menubar.Menu value="file" onOpenChangeComplete={(open) => onOpenChangeComplete('file', open)}>
		<Menubar.Trigger data-testid="file-trigger">File</Menubar.Trigger>
		<Menubar.Content data-testid="file-content">
			<Menubar.Item>New</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu value="edit" onOpenChangeComplete={(open) => onOpenChangeComplete('edit', open)}>
		<Menubar.Trigger data-testid="edit-trigger">Edit</Menubar.Trigger>
		<Menubar.Content data-testid="edit-content">
			<Menubar.Item>Undo</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>
