import type { WithChild, Without } from "$lib/internal/types.js";
import type { BitsPrimitiveLabelAttributes } from "$lib/internal/attributes.js";

export type LabelRootPropsWithoutHTML = WithChild;

export type LabelRootProps = LabelRootPropsWithoutHTML &
	Without<BitsPrimitiveLabelAttributes, LabelRootPropsWithoutHTML>;
