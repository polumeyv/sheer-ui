<script lang="ts">
		import type { PresenceLayerImplProps } from "$lib/components/_shared/utilities/presence-layer/index";
	import { Presence } from "$lib/components/_shared/utilities/presence-layer/presence.svelte";

	let { open, forceMount, presence, ref }: PresenceLayerImplProps = $props();

	const presenceState = new Presence({
		open: { get current() { return open; } },
		ref,
	});
</script>

{#if forceMount || open || presenceState.isPresent}
	{@render presence?.({
		present: presenceState.isPresent,
		transitionStatus: presenceState.transitionStatus,
	})}
{/if}
