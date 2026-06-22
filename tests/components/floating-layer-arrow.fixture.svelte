<script lang="ts">
	import { boxWith } from "../../src/lib/internal/toolbelt.js";
	import { FloatingLayer } from "../../src/lib/components/utilities/floating-layer/index.js";

	let {
		enabled = true,
		arrowWidth = 12,
		arrowHeight = 8,
	}: {
		enabled?: boolean;
		arrowWidth?: number;
		arrowHeight?: number;
	} = $props();

	let anchorRef = $state<HTMLElement | null>(null);
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
	<FloatingLayer.Anchor id="floating-layer-arrow-anchor" ref={boxWith(() => anchorRef)}>
		<button bind:this={anchorRef} data-testid="anchor">Anchor</button>
	</FloatingLayer.Anchor>

	<FloatingLayer.Content
		id="floating-layer-arrow-content"
		wrapperId="floating-layer-arrow-wrapper"
		{enabled}
		side="bottom"
		sideOffset={0}
		avoidCollisions={false}
	>
		{#snippet content({ props, wrapperProps })}
			<div {...wrapperProps} data-testid="wrapper">
				<div {...props} data-testid="content">
					{#if renderArrow}
						<FloatingLayer.Arrow
							bind:ref={arrowRef}
							data-testid="arrow"
							data-test-width={arrowWidth}
							data-test-height={arrowHeight}
						/>
					{/if}
				</div>
			</div>
		{/snippet}
	</FloatingLayer.Content>
</FloatingLayer.Root>
