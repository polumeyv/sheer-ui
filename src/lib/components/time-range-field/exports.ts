export { default as Root } from "$lib/components/time-range-field/components/time-range-field.svelte";
export { default as Input } from "$lib/components/time-range-field/components/time-range-field-input.svelte";
export { default as Label } from "$lib/components/time-range-field/components/time-range-field-label.svelte";
export { default as Segment } from "$lib/components/time-field/components/time-field-segment.svelte";

export type {
	TimeRangeFieldRootProps as RootProps,
	TimeRangeFieldLabelProps as LabelProps,
	TimeRangeFieldInputProps as InputProps,
	TimeRangeFieldSegmentProps as SegmentProps,
} from "$lib/components/time-range-field/index";
