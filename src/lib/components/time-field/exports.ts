export { default as Root } from "$lib/components/time-field/components/time-field.svelte";
export { default as Input } from "$lib/components/time-field/components/time-field-input.svelte";
export { default as Label } from "$lib/components/time-field/components/time-field-label.svelte";
export { default as Segment } from "$lib/components/time-field/components/time-field-segment.svelte";

export type {
	TimeFieldRootProps as RootProps,
	TimeFieldInputProps as InputProps,
	TimeFieldLabelProps as LabelProps,
	TimeFieldSegmentProps as SegmentProps,
	// DateFieldDescriptionProps as DescriptionProps,
} from "$lib/components/time-field/index";
