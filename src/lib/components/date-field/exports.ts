export { default as Root } from "$lib/components/date-field/components/date-field.svelte";
export { default as Input } from "$lib/components/date-field/components/date-field-input.svelte";
export { default as Label } from "$lib/components/date-field/components/date-field-label.svelte";
export { default as Segment } from "$lib/components/date-field/components/date-field-segment.svelte";

export type {
	DateFieldRootProps as RootProps,
	DateFieldInputProps as InputProps,
	DateFieldLabelProps as LabelProps,
	DateFieldSegmentProps as SegmentProps,
	// DateFieldDescriptionProps as DescriptionProps,
} from "$lib/components/date-field/types.js";
