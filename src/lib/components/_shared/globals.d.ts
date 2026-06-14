/** Vendored from bits-ui's app.d.ts — ambient globals the layer utilities share. */
import type { ReadableProp } from '$lib/vendor/index';
import type { SvelteMap } from 'svelte/reactivity';
import type { DismissibleLayerState } from '$lib/components/_shared/utilities/dismissible-layer/use-dismissable-layer.svelte';
import type { InteractOutsideBehaviorType } from '$lib/components/_shared/utilities/dismissible-layer/index';
import type { EscapeLayerState } from '$lib/components/_shared/utilities/escape-layer/use-escape-layer.svelte';
import type { EscapeBehaviorType } from '$lib/components/_shared/utilities/escape-layer/index';
import type { TextSelectionLayerState } from '$lib/components/_shared/utilities/text-selection-layer/use-text-selection-layer.svelte';

declare global {
	var bitsDismissableLayers: Map<DismissibleLayerState, ReadableProp<InteractOutsideBehaviorType>>;
	var bitsEscapeLayers: Map<EscapeLayerState, ReadableProp<EscapeBehaviorType>>;
	var bitsTextSelectionLayers: Map<TextSelectionLayerState, ReadableProp<boolean>>;
	var bitsIdCounter: { current: number };
	var bitsBodyLockStackCount: {
		readonly map: SvelteMap<string, boolean>;
		resetBodyStyle: () => void;
	};
	var bitsAnimationsDisabled: boolean;
}
