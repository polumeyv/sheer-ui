<script lang="ts">
	import type { Snippet } from "svelte";
	import { FloatingRootState } from "$lib/components/_shared/utilities/floating-layer/use-floating-layer.svelte";

	let { children, tooltip = false }: { children?: Snippet; tooltip?: boolean } = $props();

	FloatingRootState.create(tooltip);
</script>

{@render children?.()}
