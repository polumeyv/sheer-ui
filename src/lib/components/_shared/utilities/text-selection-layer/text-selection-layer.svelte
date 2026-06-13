<script lang="ts">
		import type { TextSelectionLayerImplProps } from "$lib/components/_shared/utilities/text-selection-layer/index.js";
	import { TextSelectionLayerState } from "$lib/components/_shared/utilities/text-selection-layer/use-text-selection-layer.svelte.js";

	let {
		preventOverflowTextSelection = true,
		onPointerDown = (() => {}),
		onPointerUp = (() => {}),
		id,
		children,
		enabled,
		ref,
	}: TextSelectionLayerImplProps = $props();

	TextSelectionLayerState.create({
		id: { get current() { return id; } },
		onPointerDown: { get current() { return onPointerDown; } },
		onPointerUp: { get current() { return onPointerUp; } },
		enabled: { get current() { return enabled && preventOverflowTextSelection; } },
		ref,
	});
</script>

{@render children?.()}
