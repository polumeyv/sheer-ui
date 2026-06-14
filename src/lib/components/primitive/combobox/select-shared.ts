import { createBitsAttrs } from '$lib/vendor/attrs';
import { kbd } from '$lib/vendor/kbd';

// prettier-ignore
export const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];

export const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
export const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
export const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];

export const CONTENT_MARGIN = 10;

export const selectAttrs = createBitsAttrs({
	component: 'select',
	parts: [
		'trigger',
		'content',
		'item',
		'viewport',
		'scroll-up-button',
		'scroll-down-button',
		'group',
		'group-label',
		'separator',
		'arrow',
		'input',
		'content-wrapper',
		'item-text',
		'value',
	],
});
