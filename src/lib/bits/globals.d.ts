/** Vendored from bits-ui's app.d.ts — ambient globals the layer utilities share. */
import type { ReadableBox } from "$lib/vendor/toolbelt/index.js";
import type { SvelteMap } from "svelte/reactivity";
import type { DismissibleLayerState } from "./utilities/dismissible-layer/use-dismissable-layer.svelte.js";
import type { InteractOutsideBehaviorType } from "./utilities/dismissible-layer/types.js";
import type { EscapeLayerState } from "./utilities/escape-layer/use-escape-layer.svelte.js";
import type { EscapeBehaviorType } from "./utilities/escape-layer/types.js";
import type { TextSelectionLayerState } from "./utilities/text-selection-layer/use-text-selection-layer.svelte.js";

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
