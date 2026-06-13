/** Vendored from bits-ui's app.d.ts — ambient globals the layer utilities share. */
import type { ReadableBox } from '$lib/vendor/index.js';
import type { SvelteMap } from 'svelte/reactivity';
import type { DismissibleLayerState } from '$lib/components/_shared/utilities/dismissible-layer/use-dismissable-layer.svelte.js';
import type { InteractOutsideBehaviorType } from '$lib/components/_shared/utilities/dismissible-layer/index.js';
import type { EscapeLayerState } from '$lib/components/_shared/utilities/escape-layer/use-escape-layer.svelte.js';
import type { EscapeBehaviorType } from '$lib/components/_shared/utilities/escape-layer/index.js';
import type { TextSelectionLayerState } from '$lib/components/_shared/utilities/text-selection-layer/use-text-selection-layer.svelte.js';

declare global {
	var bitsDismissableLayers: Map<DismissibleLayerState, ReadableBox<InteractOutsideBehaviorType>>;
	var bitsEscapeLayers: Map<EscapeLayerState, ReadableBox<EscapeBehaviorType>>;
	var bitsTextSelectionLayers: Map<TextSelectionLayerState, ReadableBox<boolean>>;
	var bitsIdCounter: { current: number };
	var bitsBodyLockStackCount: {
		readonly map: SvelteMap<string, boolean>;
		resetBodyStyle: () => void;
	};
	var bitsAnimationsDisabled: boolean;
}
