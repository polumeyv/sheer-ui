<script lang="ts">
	import type { ContextMenuRootProps } from '../types.js';
	import Menu from '../../menu/components/menu.svelte';

	let { ...restProps }: ContextMenuRootProps = $props();
</script>

<Menu _internal_variant="context-menu" {...restProps} />
