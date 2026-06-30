export { default as Root } from "./components/tooltip.svelte";
export { default as Content } from "./components/tooltip-content.svelte";
export { default as Trigger } from "./components/tooltip-trigger.svelte";
export { default as Provider } from "./components/tooltip-provider.svelte";
export { default as Portal } from "$lib/components/utilities/portal/portal.svelte";
export { createTooltipTether as createTether } from "./tooltip.svelte.js";

export type {
	TooltipProviderPropsWithoutHTML as ProviderProps,
	TooltipRootPropsWithoutHTML as RootProps,
	TooltipContentProps as ContentProps,
	TooltipTriggerProps as TriggerProps,
	TooltipTether as Tether,
	TooltipRootSnippetProps as RootSnippetProps,
} from "./types.js";

export type { PortalProps } from "$lib/components/utilities/portal/index.js";
