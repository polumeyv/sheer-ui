<script lang="ts">
	import { FloatingLayer, floatingAnchor } from "../../src/lib/internal/floating-layer/index.js";
	import { mergeProps } from "../../src/lib/internal/merge-props.js";

	let {
		enabled = true,
		arrowWidth = 12,
		arrowHeight = 8,
		side = "bottom",
		arrowPadding = 0,
	}: {
		enabled?: boolean;
		arrowWidth?: number;
		arrowHeight?: number;
		side?: "top" | "right" | "bottom" | "left";
		arrowPadding?: number;
	} = $props();

	let arrowRef = $state<HTMLElement | null>(null);
	let renderArrow = $state(true);

	export function setArrowSize(width: number, height: number) {
		arrowWidth = width;
		arrowHeight = height;
	}

	export function hideArrow() {
		renderArrow = false;
	}
</script>

<FloatingLayer.Root>
	{#snippet children()}
		{@const anchor = floatingAnchor()}
		<button {...mergeProps({ "data-testid": "anchor" }, anchor)}>Anchor</button>

		<FloatingLayer.Content id="floating-layer-arrow-content" {enabled} {side} sideOffset={0} {arrowPadding} avoidCollisions={false}>
			{#snippet content({ props })}
				<div {...props} data-testid="content">
					{#if renderArrow}
						<FloatingLayer.Arrow bind:ref={arrowRef} data-testid="arrow" data-test-width={arrowWidth} data-test-height={arrowHeight} />
					{/if}
				</div>
			{/snippet}
		</FloatingLayer.Content>
	{/snippet}
</FloatingLayer.Root>
