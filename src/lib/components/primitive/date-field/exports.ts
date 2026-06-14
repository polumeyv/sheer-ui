export { default as Root } from "./date-field.svelte";
export { default as Input } from "./date-field-input.svelte";
export { default as Label } from "./date-field-label.svelte";
export { default as Segment } from "./date-field-segment.svelte";

export type {
	DateFieldRootProps as RootProps,
	DateFieldInputProps as InputProps,
	DateFieldLabelProps as LabelProps,
	DateFieldSegmentProps as SegmentProps,
	// DateFieldDescriptionProps as DescriptionProps,
} from "$lib/components/primitive/date-field/index";
