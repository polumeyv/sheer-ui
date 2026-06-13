export { default as Root } from "$lib/components/tooltip/primitive/components/tooltip.svelte";
export { default as Content } from "$lib/components/tooltip/primitive/components/tooltip-content.svelte";
export { default as ContentStatic } from "$lib/components/tooltip/primitive/components/tooltip-content-static.svelte";
export { default as Trigger } from "$lib/components/tooltip/primitive/components/tooltip-trigger.svelte";
export { default as Arrow } from "$lib/components/tooltip/primitive/components/tooltip-arrow.svelte";
export { default as Provider } from "$lib/components/tooltip/primitive/components/tooltip-provider.svelte";
export { default as Portal } from "$lib/components/_shared/utilities/portal/portal.svelte";
export { createTooltipTether as createTether } from "$lib/components/tooltip/primitive/tooltip.svelte.js";

export type {
	TooltipProviderPropsWithoutHTML as ProviderProps,
	TooltipRootPropsWithoutHTML as RootProps,
	TooltipArrowProps as ArrowProps,
	TooltipContentProps as ContentProps,
	TooltipContentStaticProps as ContentStaticProps,
	TooltipTriggerProps as TriggerProps,
	TooltipTether as Tether,
	TooltipRootSnippetProps as RootSnippetProps,
} from "$lib/components/tooltip/primitive/types.js";

export type { PortalProps } from "$lib/components/_shared/utilities/portal/types.js";
