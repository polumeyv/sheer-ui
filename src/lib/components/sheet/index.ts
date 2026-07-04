import Root from './components/sheet.svelte';
import Close from './components/sheet-close.svelte';
import Content from './components/sheet-content.svelte';
import Description from './components/sheet-description.svelte';
import Overlay from './components/sheet-overlay.svelte';
import Title from './components/sheet-title.svelte';
import Trigger from './components/sheet-trigger.svelte';
import Portal from '../../internal/portal/portal.svelte';
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
} from '../dialog/types.js';
