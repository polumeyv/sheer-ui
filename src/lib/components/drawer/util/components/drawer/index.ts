import * as DrawerPrimitive from "$lib/components/dialog/index.js";
export { default as Root } from "./drawer.svelte";
export { default as Content } from "./drawer-content.svelte";
export { default as Overlay } from "./drawer-overlay.svelte";
export { default as NestedRoot } from "./drawer-nested.svelte";
export { default as Portal } from "./drawer-portal.svelte";

export const Trigger: typeof DrawerPrimitive.Trigger = DrawerPrimitive.Trigger;
export const Title: typeof DrawerPrimitive.Title = DrawerPrimitive.Title;
export const Description: typeof DrawerPrimitive.Description = DrawerPrimitive.Description;
export const Close: typeof DrawerPrimitive.Close = DrawerPrimitive.Close;

export type {
	DrawerRootProps as RootProps,
	DrawerContentProps as ContentProps,
	DrawerOverlayProps as OverlayProps,
	DrawerRootProps as NestedRootProps,
	DrawerTitleProps as TitleProps,
	DrawerDescriptionProps as DescriptionProps,
	DrawerCloseProps as CloseProps,
	DrawerPortalProps as PortalProps,
	DrawerTriggerProps as TriggerProps,
} from "./types.js";
