<script lang="ts">
	import { createSettleRunner } from '#lib/internal/animations-settled.svelte.js';

	let node = $state<HTMLElement | null>(null);
	const settle = createSettleRunner({ subtree: false });

	export function getNode() {
		return node!;
	}
	export function run(fn: () => void) {
		settle.run(node, fn);
	}
	export function runWithoutNode(fn: () => void) {
		settle.run(null, fn);
	}
</script>

<div data-testid="node" bind:this={node}></div>
