export { default as Root } from "$lib/components/date-range-field/components/date-range-field.svelte";
export { default as Input } from "$lib/components/date-range-field/components/date-range-field-input.svelte";
export { default as Label } from "$lib/components/date-range-field/components/date-range-field-label.svelte";
export { default as Segment } from "$lib/components/date-field/components/date-field-segment.svelte";

export type {
	DateRangeFieldRootProps as RootProps,
	DateRangeFieldLabelProps as LabelProps,
	DateRangeFieldInputProps as InputProps,
	DateRangeFieldSegmentProps as SegmentProps,
} from "$lib/components/date-range-field/index.js";
