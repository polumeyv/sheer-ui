<script lang="ts">
	import { boxWith } from '../tools/index.js';
	import { PresenceManager } from '../presence-manager.svelte.js';
	import type { PresenceLayerImplProps } from './types.js';

	let { open, forceMount, presence, ref }: PresenceLayerImplProps = $props();

	const presenceManager = new PresenceManager({
		open: boxWith(() => open),
		ref: boxWith(() => ref.current),
	});
</script>

{#if forceMount || open || presenceManager.shouldRender}
	{@render presence?.({
		present: presenceManager.shouldRender,
		transitionStatus: presenceManager.transitionStatus,
	})}
{/if}
