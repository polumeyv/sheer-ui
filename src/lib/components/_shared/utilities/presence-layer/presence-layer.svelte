<script lang="ts">
	import { boxWith } from "$lib/vendor/index.js";
	import type { PresenceLayerImplProps } from "$lib/components/_shared/utilities/presence-layer/index.js";
	import { Presence } from "$lib/components/_shared/utilities/presence-layer/presence.svelte.js";

	let { open, forceMount, presence, ref }: PresenceLayerImplProps = $props();

	const presenceState = new Presence({
		open: boxWith(() => open),
		ref,
	});
</script>

{#if forceMount || open || presenceState.isPresent}
	{@render presence?.({
		present: presenceState.isPresent,
		transitionStatus: presenceState.transitionStatus,
	})}
{/if}
