<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { PresenceManager } from '../../../internal/presence-manager.svelte.js';
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
