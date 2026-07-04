import type { WithChild, Without } from "../../internal/types.js";
import type { BitsPrimitiveLabelAttributes } from "../../internal/attribute-types.js";

export type LabelRootPropsWithoutHTML = WithChild;

export type LabelRootProps = LabelRootPropsWithoutHTML &
	Without<BitsPrimitiveLabelAttributes, LabelRootPropsWithoutHTML>;
