<script lang="ts">
	import { boxWith } from "$lib/internal/toolbelt.js";
	import type { DismissibleLayerImplProps } from "./types.js";
	import { DismissibleLayerState } from "./use-dismissable-layer.svelte.js";

	let {
		interactOutsideBehavior = "close",
		onInteractOutside = () => {},
		onFocusOutside = () => {},
		id,
		children,
		enabled,
		isValidEvent = () => false,
		ref,
	}: DismissibleLayerImplProps = $props();

	const dismissibleLayerState = DismissibleLayerState.create({
		id: boxWith(() => id),
		interactOutsideBehavior: boxWith(() => interactOutsideBehavior),
		onInteractOutside: boxWith(() => onInteractOutside),
		enabled: boxWith(() => enabled),
		onFocusOutside: boxWith(() => onFocusOutside),
		isValidEvent: boxWith(() => isValidEvent),
		ref,
	});
</script>

{@render children?.({ props: dismissibleLayerState.props })}
