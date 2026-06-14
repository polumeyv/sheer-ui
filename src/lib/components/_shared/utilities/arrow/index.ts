import type { WithChild } from "$lib/vendor/types";
import type { BitsPrimitiveSpanAttributes } from "$lib/shared/attributes";

export type ArrowPropsWithoutHTML = WithChild<{
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

export type ArrowProps = ArrowPropsWithoutHTML & BitsPrimitiveSpanAttributes;

export { default as Arrow } from "$lib/components/_shared/utilities/arrow/arrow.svelte";
