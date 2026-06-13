import type { WithChild, Without } from "$lib/internal/types.js";
import type { BitsPrimitiveLabelAttributes } from "$lib/shared/attributes.js";

export type LabelRootPropsWithoutHTML = WithChild;

export type LabelRootProps = LabelRootPropsWithoutHTML &
	Without<BitsPrimitiveLabelAttributes, LabelRootPropsWithoutHTML>;

export * as Label from "$lib/components/label/primitive/exports.js";
