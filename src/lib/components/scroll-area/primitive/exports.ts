export { default as Root } from "$lib/components/scroll-area/primitive/components/scroll-area.svelte";
export { default as Viewport } from "$lib/components/scroll-area/primitive/components/scroll-area-viewport.svelte";
export { default as Scrollbar } from "$lib/components/scroll-area/primitive/components/scroll-area-scrollbar.svelte";
export { default as Thumb } from "$lib/components/scroll-area/primitive/components/scroll-area-thumb.svelte";
export { default as Corner } from "$lib/components/scroll-area/primitive/components/scroll-area-corner.svelte";

export type {
	ScrollAreaRootProps as RootProps,
	ScrollAreaViewportProps as ViewportProps,
	ScrollAreaScrollbarProps as ScrollbarProps,
	ScrollAreaThumbProps as ThumbProps,
	ScrollAreaCornerProps as CornerProps,
} from "$lib/components/scroll-area/primitive/types.js";
