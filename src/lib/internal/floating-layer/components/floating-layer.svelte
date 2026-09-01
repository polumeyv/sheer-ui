<script lang="ts">
	import type { Snippet } from 'svelte';
	import { FloatingRootState } from '../use-floating-layer.svelte.js';

	let { children, tooltip = false }: { children?: Snippet; tooltip?: boolean } = $props();
	const uid = $props.id();

	// The anchor name is per root: one trigger/content pair positions against it.
	FloatingRootState.create(`--bits-anchor-${uid}`, tooltip);
</script>

{@render children?.()}
