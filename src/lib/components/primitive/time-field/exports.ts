export { default as Root } from "$lib/components/primitive/time-field/components/time-field.svelte";
export { default as Input } from "$lib/components/primitive/time-field/components/time-field-input.svelte";
export { default as Label } from "$lib/components/primitive/time-field/components/time-field-label.svelte";
export { default as Segment } from "$lib/components/primitive/time-field/components/time-field-segment.svelte";

export type {
	TimeFieldRootProps as RootProps,
	TimeFieldInputProps as InputProps,
	TimeFieldLabelProps as LabelProps,
	TimeFieldSegmentProps as SegmentProps,
	// DateFieldDescriptionProps as DescriptionProps,
} from "$lib/components/primitive/time-field/index";
