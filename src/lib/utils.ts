import { join } from 'overrule';

export type ClassValue = Parameters<typeof join>[number];

/**
 * Plain class join — conflict resolution is an authoring-time invariant, not a
 * runtime feature. Base/variant/caller classes must never set the same property
 * for the same modifier prefix (use a trailing `!` for deliberate overrides).
 * variants.test.ts guards the library; the runtime conflict warning is disabled.
 * Ships zero tailwind-merge bytes in production.
 */
export const cn = join;

// Snippet/ref prop helpers used across the styled bits-ui components (the
// shadcn-svelte convention). The reactive accessor/box types live in
// `$lib/internal/tools` and `$lib/internal/types` — these are only the surface props.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
