export { default as Anchor } from "$lib/components/_shared/utilities/floating-layer/components/floating-layer-anchor.svelte";
export { default as Arrow } from "$lib/components/_shared/utilities/floating-layer/components/floating-layer-arrow.svelte";
export { default as Content } from "$lib/components/_shared/utilities/floating-layer/components/floating-layer-content.svelte";
export { default as ContentStatic } from "$lib/components/_shared/utilities/floating-layer/components/floating-layer-content-static.svelte";
export { default as Root } from "$lib/components/_shared/utilities/floating-layer/components/floating-layer.svelte";

export type {
	FloatingLayerContentImplProps as ContentImplProps,
	FloatingLayerContentProps as ContentProps,
	FloatingLayerAnchorProps as AnchorProps,
} from "$lib/components/_shared/utilities/floating-layer/types.js";
