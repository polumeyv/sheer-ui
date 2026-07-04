export { default as Root } from "./components/accordion.svelte";
export { default as Item } from "./components/accordion-item.svelte";
export { default as Trigger } from "./components/accordion-trigger.svelte";
export { default as Content } from "./components/accordion-content.svelte";

export type {
	AccordionRootProps as RootProps,
	AccordionItemProps as ItemProps,
	AccordionTriggerProps as TriggerProps,
	AccordionContentProps as ContentProps,
} from "./types.js";
