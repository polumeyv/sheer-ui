export { default as Root, default as Sheet } from '../dialog/components/dialog.svelte';
export { default as Close, default as SheetClose } from './components/sheet-close.svelte';
export { default as Trigger, default as SheetTrigger } from './components/sheet-trigger.svelte';
export { default as Portal, default as SheetPortal } from '../../internal/portal/portal.svelte';
export { default as Overlay, default as SheetOverlay } from './components/sheet-overlay.svelte';
export { default as Content, default as SheetContent } from './components/sheet-content.svelte';
export { default as Header, default as SheetHeader } from './components/sheet-header.svelte';
export { default as Footer, default as SheetFooter } from './components/sheet-footer.svelte';
export { default as Title, default as SheetTitle } from './components/sheet-title.svelte';
export { default as Description, default as SheetDescription } from './components/sheet-description.svelte';

export { sheetVariants, type Side } from './variants.js';

export type {
	DialogRootProps as SheetProps,
	DialogCloseProps as SheetCloseProps,
	DialogTitleProps as SheetTitleProps,
	DialogPortalProps as SheetPortalProps,
	DialogTriggerProps as SheetTriggerProps,
	DialogOverlayProps as SheetOverlayProps,
	DialogContentProps as SheetContentProps,
	DialogDescriptionProps as SheetDescriptionProps,
} from '../dialog/types.js';
