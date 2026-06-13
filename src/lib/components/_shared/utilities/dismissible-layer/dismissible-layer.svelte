<script lang="ts">
	import { boxWith } from "$lib/vendor/index.js";
	import type { DismissibleLayerImplProps } from "$lib/components/_shared/utilities/dismissible-layer/index.js";
	import { DismissibleLayerState } from "$lib/components/_shared/utilities/dismissible-layer/use-dismissable-layer.svelte.js";

	let {
		interactOutsideBehavior = "close",
		onInteractOutside = (() => {}),
		onFocusOutside = (() => {}),
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
