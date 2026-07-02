<script lang="ts">
	import { MenuSubmenuIntent } from '$lib/components/menu/menu.svelte.js';

	let { enabled: initialEnabled = true }: { enabled?: boolean } = $props();

	let enabled = $state(initialEnabled);
	let triggerNode = $state<HTMLElement | null>(null);
	let contentNode = $state<HTMLElement | null>(null);
	let exitCount = $state(0);
	let isPointerInTransit = $state(false);

	export function setEnabled(value: boolean) {
		enabled = value;
	}

	new MenuSubmenuIntent({
		enabled: () => enabled,
		triggerNode: () => triggerNode,
		contentNode: () => contentNode,
		parentContentNode: () => null,
		subContentSelector: () => '[data-testid="descendant-sub-content"]',
		onIntentExit: () => {
			exitCount += 1;
		},
		setIsPointerInTransit: (value) => {
			isPointerInTransit = value;
		},
	});
</script>

<button data-testid="trigger" bind:this={triggerNode}>trigger</button>
<div data-testid="content" bind:this={contentNode}>content</div>
<span data-testid="exit-count">{exitCount}</span>
<span data-testid="in-transit">{isPointerInTransit}</span>
