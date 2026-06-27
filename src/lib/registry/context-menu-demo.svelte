<script lang="ts">
	import * as ContextMenu from '$lib/components/context-menu/index.js';
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger
		class='grid h-40 w-72 place-items-center rounded-md border border-dashed text-sm'>
		Right click here
	</ContextMenu.Trigger>
	<ContextMenu.Content class='w-52'>
		<ContextMenu.Item>Back</ContextMenu.Item>
		<ContextMenu.Item>Forward</ContextMenu.Item>
		<ContextMenu.Item>Reload</ContextMenu.Item>
		<ContextMenu.Separator />
		<ContextMenu.Item>Save page as…</ContextMenu.Item>
		<ContextMenu.Item>Print…</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
