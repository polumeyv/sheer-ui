// Seam for the bits-ui layer: route local overrides here while passing the
// rest of @polumeyv/tools through unchanged. Named re-exports override names
// from `export *`, so importers can migrate gradually without call-site churn.
export { mergeProps } from '$lib/merge-props.js';
export * from '@polumeyv/tools';
