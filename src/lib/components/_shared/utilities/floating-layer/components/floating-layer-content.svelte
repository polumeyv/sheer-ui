<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { FloatingContentState } from "$lib/components/_shared/utilities/floating-layer/use-floating-layer.svelte";
	import type { ContentImplProps } from "$lib/components/_shared/utilities/floating-layer/components/index";
	import { useId } from "$lib/vendor/use-id";

	let {
		content,
		side = "bottom",
		sideOffset = 0,
		align = "center",
		alignOffset = 0,
		id,
		arrowPadding = 0,
		avoidCollisions = true,
		collisionBoundary = [],
		collisionPadding = 0,
		hideWhenDetached = false,
		onPlaced = () => {},
		sticky = "partial",
		updatePositionStrategy = "optimized",
		strategy = "fixed",
		dir = "ltr",
		style = {},
		wrapperId = useId(),
		customAnchor = null,
		enabled,
		tooltip = false,
	}: ContentImplProps = $props();

	const contentState = FloatingContentState.create(
		{
			side: { get current() { return side; } },
			sideOffset: { get current() { return sideOffset; } },
			align: { get current() { return align; } },
			alignOffset: { get current() { return alignOffset; } },
			id: { get current() { return id; } },
			arrowPadding: { get current() { return arrowPadding; } },
			avoidCollisions: { get current() { return avoidCollisions; } },
			collisionBoundary: { get current() { return collisionBoundary; } },
			collisionPadding: { get current() { return collisionPadding; } },
			hideWhenDetached: { get current() { return hideWhenDetached; } },
			onPlaced: { get current() { return onPlaced; } },
			sticky: { get current() { return sticky; } },
			updatePositionStrategy: { get current() { return updatePositionStrategy; } },
			strategy: { get current() { return strategy; } },
			dir: { get current() { return dir; } },
			style: { get current() { return style; } },
			enabled: { get current() { return enabled; } },
			wrapperId: { get current() { return wrapperId; } },
			customAnchor: { get current() { return customAnchor; } },
		},
		tooltip
	);

	const mergedProps = $derived(
		mergeProps(contentState.wrapperProps, {
			style: {
				pointerEvents: "auto",
			},
		})
	);
</script>

{@render content?.({ props: contentState.props, wrapperProps: mergedProps })}
