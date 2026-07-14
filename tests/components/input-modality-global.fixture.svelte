<script lang="ts">
	import MenuRoot from '$lib/components/menu/components/menu.svelte';
	import ContextMenuRoot from '$lib/components/context-menu/components/context-menu.svelte';

	let {
		menuRoots = 1,
		contextMenuRoots = 0,
	}: { menuRoots?: number; contextMenuRoots?: number } = $props();
</script>

{#each Array(menuRoots) as _, index (index)}
	<MenuRoot />
{/each}

{#each Array(contextMenuRoots) as _, index (index)}
	<ContextMenuRoot />
{/each}
