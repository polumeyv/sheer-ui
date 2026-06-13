export { default as Root } from "$lib/components/collapsible/primitive/components/collapsible.svelte";
export { default as Content } from "$lib/components/collapsible/primitive/components/collapsible-content.svelte";
export { default as Trigger } from "$lib/components/collapsible/primitive/components/collapsible-trigger.svelte";

export type {
	CollapsibleRootProps as RootProps,
	CollapsibleContentProps as ContentProps,
	CollapsibleTriggerProps as TriggerProps,
} from "$lib/components/collapsible/primitive/types.js";
