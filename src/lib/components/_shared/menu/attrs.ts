import { CustomEventDispatcher } from '$lib/vendor/events';
import { createBitsAttrs } from '$lib/vendor/attrs';

export const CONTEXT_MENU_TRIGGER_ATTR = 'data-context-menu-trigger';
export const CONTEXT_MENU_CONTENT_ATTR = 'data-context-menu-content';

export type MenuVariant = 'context-menu' | 'dropdown-menu' | 'menubar';

export const MenuOpenEvent = new CustomEventDispatcher('bitsmenuopen', {
	bubbles: false,
	cancelable: true,
});

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
