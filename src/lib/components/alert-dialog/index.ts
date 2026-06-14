import Root from './alert-dialog.svelte';
import Action from './alert-dialog-action.svelte';
import Cancel from './alert-dialog-cancel.svelte';
import Content from './alert-dialog-content.svelte';
import Description from './alert-dialog-description.svelte';
import Footer from './alert-dialog-footer.svelte';
import Header from './alert-dialog-header.svelte';
import Overlay from './alert-dialog-overlay.svelte';
import Portal from './alert-dialog-portal.svelte';
import Title from './alert-dialog-title.svelte';
import Trigger from './alert-dialog-trigger.svelte';

export {
	Root,
	Title,
	Action,
	Cancel,
	Portal,
	Footer,
	Header,
	Trigger,
	Overlay,
	Content,
	Description,
	//
	Root as AlertDialog,
	Title as AlertDialogTitle,
	Action as AlertDialogAction,
	Cancel as AlertDialogCancel,
	Portal as AlertDialogPortal,
	Footer as AlertDialogFooter,
	Header as AlertDialogHeader,
	Trigger as AlertDialogTrigger,
	Overlay as AlertDialogOverlay,
	Content as AlertDialogContent,
	Description as AlertDialogDescription,
};

import type { DialogContentProps, DialogContentPropsWithoutHTML } from '$lib/components/primitive/dialog/index';

export type {
	DialogRootPropsWithoutHTML as AlertDialogRootPropsWithoutHTML,
	DialogRootProps as AlertDialogRootProps,
	DialogClosePropsWithoutHTML as AlertDialogActionPropsWithoutHTML,
	DialogCloseProps as AlertDialogActionProps,
	DialogClosePropsWithoutHTML as AlertDialogCancelPropsWithoutHTML,
	DialogCloseProps as AlertDialogCancelProps,
	DialogPortalPropsWithoutHTML as AlertDialogPortalPropsWithoutHTML,
	DialogPortalProps as AlertDialogPortalProps,
	DialogOverlayPropsWithoutHTML as AlertDialogOverlayPropsWithoutHTML,
	DialogOverlayProps as AlertDialogOverlayProps,
	DialogTitlePropsWithoutHTML as AlertDialogTitlePropsWithoutHTML,
	DialogTitleProps as AlertDialogTitleProps,
	DialogDescriptionPropsWithoutHTML as AlertDialogDescriptionPropsWithoutHTML,
	DialogDescriptionProps as AlertDialogDescriptionProps,
	DialogTriggerPropsWithoutHTML as AlertDialogTriggerPropsWithoutHTML,
	DialogTriggerProps as AlertDialogTriggerProps,
} from '$lib/components/primitive/dialog/index';

export type AlertDialogContentPropsWithoutHTML = Omit<DialogContentPropsWithoutHTML, 'onInteractOutside'>;
export type AlertDialogContentProps = DialogContentProps;
