export { default as Root } from "$lib/components/alert-dialog/primitive/components/alert-dialog.svelte";
export { default as Title } from "$lib/components/dialog/primitive/components/dialog-title.svelte";
export { default as Action } from "$lib/components/alert-dialog/primitive/components/alert-dialog-action.svelte";
export { default as Cancel } from "$lib/components/alert-dialog/primitive/components/alert-dialog-cancel.svelte";
export { default as Portal } from "$lib/components/_shared/utilities/portal/portal.svelte";
export { default as Content } from "$lib/components/alert-dialog/primitive/components/alert-dialog-content.svelte";
export { default as Overlay } from "$lib/components/dialog/primitive/components/dialog-overlay.svelte";
export { default as Trigger } from "$lib/components/dialog/primitive/components/dialog-trigger.svelte";
export { default as Description } from "$lib/components/dialog/primitive/components/dialog-description.svelte";

export type {
	AlertDialogRootProps as RootProps,
	AlertDialogTitleProps as TitleProps,
	AlertDialogActionProps as ActionProps,
	AlertDialogCancelProps as CancelProps,
	AlertDialogPortalProps as PortalProps,
	AlertDialogContentProps as ContentProps,
	AlertDialogOverlayProps as OverlayProps,
	AlertDialogTriggerProps as TriggerProps,
	AlertDialogDescriptionProps as DescriptionProps,
} from "$lib/components/alert-dialog/primitive/types.js";
