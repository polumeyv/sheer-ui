import { createAttachmentKey, type Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';
import { createBitsAttrs } from '$lib/vendor/attrs';

export const CONTEXT_MENU_TRIGGER_ATTR = 'data-context-menu-trigger';
export const CONTEXT_MENU_CONTENT_ATTR = 'data-context-menu-content';

export const BITS_MENU_OPEN = 'bitsmenuopen';

export type MenuVariant = 'context-menu' | 'dropdown-menu' | 'menubar';

export type BitsMenuOpenEvent = CustomEvent<void>;
export type BitsMenuOpenHandler = (event: BitsMenuOpenEvent) => void;
export type MenuOpenAttachment = { [key: symbol]: Attachment<HTMLElement> };

export function dispatchMenuOpen(node: EventTarget) {
	return node.dispatchEvent(
		new CustomEvent<void>(BITS_MENU_OPEN, {
			bubbles: false,
			cancelable: true,
		}),
	);
}

export function attachMenuOpen(handler: BitsMenuOpenHandler, options?: AddEventListenerOptions): MenuOpenAttachment {
	return {
		[createAttachmentKey()]: (node) => on(node, BITS_MENU_OPEN, (event) => handler(event as BitsMenuOpenEvent), options),
	};
}

export const menuAttrs = createBitsAttrs({
	component: 'menu',
	parts: [
		'trigger',
		'content',
		'sub-trigger',
		'item',
		'group',
		'group-heading',
		'checkbox-group',
		'checkbox-item',
		'radio-group',
		'radio-item',
		'separator',
		'sub-content',
		'arrow',
	],
});
