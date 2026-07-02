// Ambient globals the bits-ui layer registers once per realm (layer stacks, id
// counter, body-scroll-lock bookkeeping). Mirrors upstream bits-ui's app.d.ts.
import type { ReadableBox } from '$lib/internal/tools/index.js';
import type { SvelteMap } from 'svelte/reactivity';
import type { LayerStack } from '$lib/internal/layer-stack.js';
import type { DismissibleLayerState } from '$lib/components/utilities/dismissible-layer/use-dismissable-layer.svelte.js';
import type { InteractOutsideBehaviorType } from '$lib/components/utilities/dismissible-layer/types.js';
import type { EscapeLayerState } from '$lib/components/utilities/escape-layer/use-escape-layer.svelte.js';
import type { EscapeBehaviorType } from '$lib/components/utilities/escape-layer/types.js';
import type { TextSelectionLayerState } from '$lib/components/utilities/text-selection-layer/use-text-selection-layer.svelte.js';

declare global {
	// oxlint-disable no-var
	var bitsDismissableLayers: LayerStack<DismissibleLayerState, ReadableBox<InteractOutsideBehaviorType>>;
	var bitsEscapeLayers: LayerStack<EscapeLayerState, ReadableBox<EscapeBehaviorType>>;
	var bitsTextSelectionLayers: LayerStack<TextSelectionLayerState, ReadableBox<boolean>>;
	var bitsIdCounter: { current: number };
	var bitsBodyLockStackCount: {
		readonly map: SvelteMap<string, boolean>;
		resetBodyStyle: () => void;
	};
	var bitsAnimationsDisabled: boolean;
}
