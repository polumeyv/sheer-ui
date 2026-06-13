import type { WithChild } from "$lib/internal/types.js";
import type { BitsPrimitiveSpanAttributes } from "$lib/shared/attributes.js";

export type VisuallyHiddenProps = WithChild<BitsPrimitiveSpanAttributes>;

export { default as VisuallyHidden } from "$lib/components/_shared/utilities/visually-hidden/visually-hidden.svelte";
