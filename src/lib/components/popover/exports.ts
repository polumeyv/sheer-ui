export { default as Root } from "./components/popover.svelte";
export { default as Content } from "./components/popover-content.svelte";
export { default as Trigger } from "./components/popover-trigger.svelte";
export { default as Close } from "./components/popover-close.svelte";
export { default as Portal } from "../../internal/portal/portal.svelte";

export type {
	PopoverRootProps as RootProps,
	PopoverContentProps as ContentProps,
	PopoverTriggerProps as TriggerProps,
	PopoverCloseProps as CloseProps,
	PopoverPortalProps as PortalProps,
} from "./types.js";
