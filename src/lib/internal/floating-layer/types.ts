import type { Snippet } from 'svelte';
import type { Align, Measurable, Side } from './use-floating-layer.svelte.js';
import type { WithChild } from '../types.js';
import type { Direction, StyleProperties } from '../index.js';
import type { BitsPrimitiveSpanAttributes } from '../attribute-types.js';

export type FloatingLayerContentProps = {
	/**
	 * The preferred side of the anchor to render against when open.
	 * Flipped when it would overflow the viewport.
	 */
	side?: Side;

	/**
	 * The distance in pixels from the anchor to the floating element.
	 */
	sideOffset?: number;

	/**
	 * The preferred alignment of the anchor to render against when open.
	 * Flipped when it would overflow the viewport.
	 */
	align?: Align;

	/**
	 * An offset in pixels from the "start" or "end" alignment options.
	 */
	alignOffset?: number | undefined;

	/**
	 * This describes the padding between the arrow and the edges of the floating element.
	 * If your floating element has border-radius, this will prevent it from overflowing
	 * the corners.
	 */
	arrowPadding?: number;

	/**
	 * When `true`, the `side` and `align` flip to keep the content inside the viewport.
	 *
	 * @default true
	 */
	avoidCollisions?: boolean | undefined;

	/**
	 * The amount in pixels of virtual padding around the viewport edges the content keeps
	 * clear of.
	 *
	 * @default 0
	 */
	collisionPadding?: number | Partial<Record<Side, number>>;

	/**
	 * Hides the content while its anchor is scrolled out of view (`position-visibility`).
	 *
	 * @default false
	 */
	hideWhenDetached?: boolean;

	content?: Snippet<[{ props: Record<string, unknown> }]>;

	/**
	 * The text direction of the content.
	 */
	dir?: Direction;

	/**
	 * Whether to prevent scrolling the body when the content is open.
	 */
	preventScroll?: boolean;

	/**
	 * Use an element other than the trigger to anchor the content to. If provided,
	 * the content will be anchored to the provided element instead of the trigger.
	 *
	 * You can pass a selector string or an HTMLElement.
	 */
	customAnchor?: string | HTMLElement | Measurable | null;
};

export type FloatingLayerContentImplProps = {
	id: string;

	/**
	 * The style properties to apply to the content.
	 */
	style?: StyleProperties | string | null;

	/**
	 * Callback that is called when the floating element is placed.
	 */
	onPlaced?: () => void;
	enabled: boolean;
	/**
	 * Open, or closed with the exit transition still running. A closed-at-rest surface
	 * drops its anchored position style so it costs anchor layout nothing.
	 * @default enabled
	 */
	present?: boolean;
	/**
	 * Tooltips are special in that they are commonly composed
	 * with other floating components, where the same trigger is
	 * used for both the tooltip and the popover.
	 *
	 * For situations like this, we need to use a different context
	 * symbol so that conflicts don't occur.
	 */
	tooltip?: boolean;
} & FloatingLayerContentProps;

export type FloatingLayerArrowPropsWithoutHTML = WithChild<{
	/**
	 * The width of the arrow in pixels.
	 *
	 * @defaultValue 10
	 */
	width?: number;

	/**
	 * The height of the arrow in pixels.
	 *
	 * @defaultValue 5
	 */
	height?: number;
}>;

export type FloatingLayerArrowProps = FloatingLayerArrowPropsWithoutHTML & BitsPrimitiveSpanAttributes;
