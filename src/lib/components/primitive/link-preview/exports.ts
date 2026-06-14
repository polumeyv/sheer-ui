export { default as Arrow } from '$lib/components/_shared/utilities/floating-layer/components/floating-layer-arrow.svelte';
export { default as Root } from './link-preview.svelte';
export { default as Content } from './link-preview-content.svelte';
export { default as Trigger } from './link-preview-trigger.svelte';
export { default as Portal } from '$lib/components/_shared/utilities/portal/portal.svelte';
export { default as ContentStatic } from './link-preview-content-static.svelte';

export type {
	LinkPreviewRootProps as RootProps,
	LinkPreviewArrowProps as ArrowProps,
	LinkPreviewContentProps as ContentProps,
	LinkPreviewContentStaticProps as ContentStaticProps,
	LinkPreviewTriggerProps as TriggerProps,
	LinkPreviewPortalProps as PortalProps,
} from '$lib/components/primitive/link-preview/index';
