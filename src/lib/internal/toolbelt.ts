// Seam for the bits-ui layer: route `mergeProps` to our overrule-based merger
// (class-join + dev twMerge tripwire, no clsx) while passing every other
// svelte-toolbelt export through unchanged. A local named re-export overrides
// the same name from `export *` per ES module rules, so importers that pull
// `mergeProps` alongside `boxWith`/`attachRef`/etc. on one line resolve
// `mergeProps` to ours and the rest to svelte-toolbelt.
export { mergeProps } from '$lib/merge-props.js';
export * from 'svelte-toolbelt';
