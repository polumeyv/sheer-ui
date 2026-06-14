import type { WithChild, Without } from "$lib/vendor/types";
import type { BitsPrimitiveDivAttributes } from "$lib/shared/attributes";

export type AspectRatioRootPropsWithoutHTML = WithChild<{
	/**
	 * The aspect ratio of the image.
	 *
	 * @defaultValue 1
	 */
	ratio?: number;
}>;

export type AspectRatioRootProps = AspectRatioRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, AspectRatioRootPropsWithoutHTML>;
