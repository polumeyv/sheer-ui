<script lang="ts">
		import { FloatingAnchorState } from "$lib/components/_shared/utilities/floating-layer/use-floating-layer.svelte.js";
	import type { AnchorProps } from "$lib/components/_shared/utilities/floating-layer/components/index.js";
	import type { Measurable } from "$lib/internal/floating-svelte/types.js";

	let { id, children, virtualEl, ref, tooltip = false }: AnchorProps = $props();

	FloatingAnchorState.create(
		{
			id: { get current() { return id; } },
			virtualEl: { get current() { return virtualEl as unknown as Measurable | null; } },
			ref,
		},
		tooltip
	);
</script>

{@render children?.()}
