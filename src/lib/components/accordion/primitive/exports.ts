export { default as Root } from "$lib/components/accordion/primitive/components/accordion.svelte";
export { default as Item } from "$lib/components/accordion/primitive/components/accordion-item.svelte";
export { default as Header } from "$lib/components/accordion/primitive/components/accordion-header.svelte";
export { default as Trigger } from "$lib/components/accordion/primitive/components/accordion-trigger.svelte";
export { default as Content } from "$lib/components/accordion/primitive/components/accordion-content.svelte";

export type {
	AccordionRootProps as RootProps,
	AccordionItemProps as ItemProps,
	AccordionHeaderProps as HeaderProps,
	AccordionTriggerProps as TriggerProps,
	AccordionContentProps as ContentProps,
} from "$lib/components/accordion/primitive/index.js";
