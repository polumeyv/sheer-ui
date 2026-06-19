import Root from '$lib/components/sheet/components/sheet.svelte';
import Close from '$lib/components/sheet/components/sheet-close.svelte';
import Content from '$lib/components/sheet/components/sheet-content.svelte';
import Description from '$lib/components/sheet/components/sheet-description.svelte';
import Overlay from '$lib/components/sheet/components/sheet-overlay.svelte';
import Title from '$lib/components/sheet/components/sheet-title.svelte';
import Trigger from '$lib/components/sheet/components/sheet-trigger.svelte';
import Portal from '$lib/components/utilities/portal/portal.svelte';
import Footer from './components/sheet-footer.svelte';
import Header from './components/sheet-header.svelte';

export {
	Root,
	Close,
	Trigger,
	Portal,
	Overlay,
	Content,
	Header,
	Footer,
	Title,
	Description,
	//
	Root as Sheet,
	Close as SheetClose,
	Trigger as SheetTrigger,
	Portal as SheetPortal,
	Overlay as SheetOverlay,
	Content as SheetContent,
	Header as SheetHeader,
	Footer as SheetFooter,
	Title as SheetTitle,
	Description as SheetDescription,
};

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
} from '$lib/components/dialog/types.js';
