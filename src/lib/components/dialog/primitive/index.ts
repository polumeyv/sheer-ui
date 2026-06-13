export { default as Root } from './root.svelte';
export { default as Content } from './content.svelte';
export { default as Overlay } from './overlay.svelte';
export { default as Trigger } from './trigger.svelte';
export { default as Close } from './close.svelte';
export { default as Title } from './title.svelte';
export { default as Description } from './description.svelte';
export { default as Portal } from '$lib/bits/utilities/portal/portal.svelte';

export type {
	DialogRootProps as RootProps,
	DialogContentProps as ContentProps,
	DialogOverlayProps as OverlayProps,
	DialogTriggerProps as TriggerProps,
	DialogCloseProps as CloseProps,
	DialogTitleProps as TitleProps,
	DialogDescriptionProps as DescriptionProps,
	DialogPortalProps as PortalProps,
} from '$lib/bits/dialog/types.js';
