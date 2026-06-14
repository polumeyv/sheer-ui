import type { WithChild, Without } from "$lib/vendor/types";
import type { Orientation } from "$lib/shared/index";
import type { BitsPrimitiveDivAttributes } from "$lib/shared/attributes";

export type SeparatorRootPropsWithoutHTML = WithChild<{
	/**
	 * The orientation of the separator.
	 *
	 * @defaultValue "horizontal"
	 */
	orientation?: Orientation;

	/**
	 * Whether the separator is decorative and should be hidden from assistive technologies.
	 *
	 * @defaultValue false
	 */
	decorative?: boolean;
}>;

export type SeparatorRootProps = SeparatorRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SeparatorRootPropsWithoutHTML>;

export * as Separator from "$lib/components/separator/primitive/exports";
