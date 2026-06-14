export { default as Root } from "./root.svelte";
export { default as Title } from "./title.svelte";
export { default as Close } from "./close.svelte";
export { default as Portal } from "$lib/components/_shared/utilities/portal/portal.svelte";
export { default as Content } from "./content.svelte";
export { default as Overlay } from "./overlay.svelte";
export { default as Trigger } from "./trigger.svelte";
export { default as Description } from "./description.svelte";

export type {
	DialogRootProps as RootProps,
	DialogTitleProps as TitleProps,
	DialogCloseProps as CloseProps,
	DialogPortalProps as PortalProps,
	DialogContentProps as ContentProps,
	DialogOverlayProps as OverlayProps,
	DialogTriggerProps as TriggerProps,
	DialogDescriptionProps as DescriptionProps,
} from "$lib/components/primitive/dialog/index";
