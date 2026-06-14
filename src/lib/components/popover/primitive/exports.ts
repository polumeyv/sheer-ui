export { default as Root } from "$lib/components/popover/primitive/components/popover.svelte";
export { default as Arrow } from "$lib/components/popover/primitive/components/popover-arrow.svelte";
export { default as Content } from "$lib/components/popover/primitive/components/popover-content.svelte";
export { default as ContentStatic } from "$lib/components/popover/primitive/components/popover-content-static.svelte";
export { default as Trigger } from "$lib/components/popover/primitive/components/popover-trigger.svelte";
export { default as Close } from "$lib/components/popover/primitive/components/popover-close.svelte";
export { default as Portal } from "$lib/components/_shared/utilities/portal/portal.svelte";
export { default as Overlay } from "$lib/components/popover/primitive/components/popover-overlay.svelte";

export type {
	PopoverRootProps as RootProps,
	PopoverArrowProps as ArrowProps,
	PopoverContentProps as ContentProps,
	PopoverContentStaticProps as ContentStaticProps,
	PopoverTriggerProps as TriggerProps,
	PopoverCloseProps as CloseProps,
	PopoverPortalProps as PortalProps,
	PopoverOverlayProps as OverlayProps,
} from "$lib/components/popover/primitive/index";
