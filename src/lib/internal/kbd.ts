export const kbd = {
	ALT: 'Alt',
	ARROW_DOWN: 'ArrowDown',
	ARROW_LEFT: 'ArrowLeft',
	ARROW_RIGHT: 'ArrowRight',
	ARROW_UP: 'ArrowUp',
	BACKSPACE: 'Backspace',
	CAPS_LOCK: 'CapsLock',
	CONTROL: 'Control',
	DELETE: 'Delete',
	END: 'End',
	ENTER: 'Enter',
	ESCAPE: 'Escape',
	F1: 'F1',
	F2: 'F2',
	F3: 'F3',
	F4: 'F4',
	F5: 'F5',
	F6: 'F6',
	F7: 'F7',
	F8: 'F8',
	F9: 'F9',
	F10: 'F10',
	F11: 'F11',
	F12: 'F12',
	HOME: 'Home',
	META: 'Meta',
	PAGE_DOWN: 'PageDown',
	PAGE_UP: 'PageUp',
	SHIFT: 'Shift',
	SPACE: ' ',
	TAB: 'Tab',
	CTRL: 'Control',
	ASTERISK: '*',
	a: 'a',
	A: 'A',
	p: 'p',
	P: 'P',
	n: 'n',
	j: 'j',
	k: 'k',
	h: 'h',
	l: 'l',
} as const;

/**
 * Keyboard key-sets shared across menu, select, and roving-focus navigation.
 * Membership is tested with `.includes()`, so element order is irrelevant.
 */
export const FIRST_KEYS: string[] = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
export const LAST_KEYS: string[] = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
export const FIRST_LAST_KEYS: string[] = [...FIRST_KEYS, ...LAST_KEYS];
export const SELECTION_KEYS: string[] = [kbd.ENTER, kbd.SPACE];
