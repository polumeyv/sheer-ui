import type { WithChild, Without } from "$lib/vendor/types";
import type { BitsPrimitiveLabelAttributes } from "$lib/shared/attributes";

export type LabelRootPropsWithoutHTML = WithChild;

export type LabelRootProps = LabelRootPropsWithoutHTML &
	Without<BitsPrimitiveLabelAttributes, LabelRootPropsWithoutHTML>;
