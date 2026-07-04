// oxlint-disable no-explicit-any

export type Selected<Value> = {
	value: Value;
	label?: string;
};

export type FocusTarget = string | HTMLElement | SVGElement | null;
export type FocusProp = FocusTarget | ((defaultEl?: HTMLElement | null) => FocusTarget);

export type Orientation = 'horizontal' | 'vertical';
export type Direction = 'ltr' | 'rtl';

/**
 * Controls positioning of the slider thumb.
 *
 * - `exact`: The thumb is centered exactly at the value of the slider.
 * - `contain`: The thumb is centered exactly at the value of the slider, but will be contained within the slider track at the ends.
 */
export type SliderThumbPositioning = 'exact' | 'contain';

export type { StyleProperties } from './tools/types.js';
export type { WithoutChild, WithoutChildren, WithoutChildrenOrChild, WithElementRef } from './utils.js';
export type { WithChild, Without, WithChildren, FloatingContentSnippetProps, StaticContentSnippetProps } from './types.js';
export type {
	SegmentPart,
	EditableSegmentPart,
	EditableTimeSegmentPart,
	Month,
	DateMatcher,
	DateOnInvalid,
	DateRangeValidator,
	DateValidator,
	DateRange,
	TimeValue,
	TimeSegmentPart,
	TimeEndpoints,
	TimeValidator,
	TimeRangeValidator,
	TimeOnInvalid,
} from './date-time/types.js';

export { mergeProps } from './merge-props.js';
export { useId } from './use-id.js';
export * from './attribute-types.js';
