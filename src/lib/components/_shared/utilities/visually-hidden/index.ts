import type { WithChild } from "$lib/vendor/types";
import type { BitsPrimitiveSpanAttributes } from "$lib/shared/attributes";

export type VisuallyHiddenProps = WithChild<BitsPrimitiveSpanAttributes>;

export { default as VisuallyHidden } from "$lib/components/_shared/utilities/visually-hidden/visually-hidden.svelte";
