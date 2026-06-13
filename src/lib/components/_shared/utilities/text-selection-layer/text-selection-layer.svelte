<script lang="ts">
	import { boxWith } from "$lib/vendor/toolbelt/index.js";
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
		id: boxWith(() => id),
		onPointerDown: boxWith(() => onPointerDown),
		onPointerUp: boxWith(() => onPointerUp),
		enabled: boxWith(() => enabled && preventOverflowTextSelection),
		ref,
	});
</script>

{@render children?.()}
