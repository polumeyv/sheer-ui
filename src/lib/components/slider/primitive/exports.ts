export { default as Root } from "$lib/components/slider/primitive/components/slider.svelte";
export { default as Range } from "$lib/components/slider/primitive/components/slider-range.svelte";
export { default as Thumb } from "$lib/components/slider/primitive/components/slider-thumb.svelte";
export { default as Tick } from "$lib/components/slider/primitive/components/slider-tick.svelte";
export { default as TickLabel } from "$lib/components/slider/primitive/components/slider-tick-label.svelte";
export { default as ThumbLabel } from "$lib/components/slider/primitive/components/slider-thumb-label.svelte";

export type {
	SliderRootProps as RootProps,
	SliderRangeProps as RangeProps,
	SliderThumbProps as ThumbProps,
	SliderTickProps as TickProps,
	SliderTickLabelProps as TickLabelProps,
	SliderThumbLabelProps as ThumbLabelProps,
} from "$lib/components/slider/primitive/types.js";
