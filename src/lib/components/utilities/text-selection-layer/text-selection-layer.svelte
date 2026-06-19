<script lang="ts">
	import { boxWith } from "$lib/internal/toolbelt.js";
	import type { TextSelectionLayerImplProps } from "./types.js";
	import { TextSelectionLayerState } from "./use-text-selection-layer.svelte.js";

	let {
		preventOverflowTextSelection = true,
		onPointerDown = () => {},
		onPointerUp = () => {},
		id,
		children,
		enabled,
		ref,
	}: TextSelectionLayerImplProps = $props();

	TextSelectionLayerState.create({
		id: boxWith(() => id),
		onPointerDown: boxWith(() => onPointerDown),
		onPointerUp: boxWith(() => onPointerUp),
		enabled: boxWith(() => enabled && preventOverflowTextSelection),
		ref,
	});
</script>

{@render children?.()}
