<script lang="ts">
		import type { DismissibleLayerImplProps } from "$lib/components/_shared/utilities/dismissible-layer/index";
	import { DismissibleLayerState } from "$lib/components/_shared/utilities/dismissible-layer/use-dismissable-layer.svelte";

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
		id: { get current() { return id; } },
		interactOutsideBehavior: { get current() { return interactOutsideBehavior; } },
		onInteractOutside: { get current() { return onInteractOutside; } },
		enabled: { get current() { return enabled; } },
		onFocusOutside: { get current() { return onFocusOutside; } },
		isValidEvent: { get current() { return isValidEvent; } },
		ref,
	});
</script>

{@render children?.({ props: dismissibleLayerState.props })}
