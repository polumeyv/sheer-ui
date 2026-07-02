<script lang="ts">
	import { SafePolygon } from '$lib/internal/safe-polygon.svelte.js';

	let { enabled: initialEnabled = true }: { enabled?: boolean } = $props();

	let enabled = $state(initialEnabled);
	let triggerNode = $state<HTMLElement | null>(null);
	let contentNode = $state<HTMLElement | null>(null);
	let exitCount = $state(0);

	export function setEnabled(value: boolean) {
		enabled = value;
	}

	new SafePolygon({
		enabled: () => enabled,
		triggerNode: () => triggerNode,
		contentNode: () => contentNode,
		onPointerExit: () => {
			exitCount += 1;
		},
	});
</script>

<button data-testid="trigger" bind:this={triggerNode}>trigger</button>
<div data-testid="content" bind:this={contentNode}>content</div>
<span data-testid="exit-count">{exitCount}</span>
