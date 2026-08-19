import type { DrawerDirection } from './types.js';

type StyleValue = string | number | null | undefined;
type Style = Record<string, StyleValue>;

export const applyStyle = (element: Element | HTMLElement | null | undefined, style: Style) => {
	if (!(element instanceof HTMLElement)) return;

	for (const [key, value] of Object.entries(style)) {
		if (value != null) Object.assign(element.style, { [key]: String(value) });
	}
};

export const assignStyle = (element: HTMLElement | null | undefined, style: Style) => {
	if (!element) return () => {};

	const prevStyle = element.style.cssText;

	applyStyle(element, style);

	return () => {
		element.style.cssText = prevStyle;
	};
};

export const isVertical = (direction: DrawerDirection) => direction === 'top' || direction === 'bottom';

export const getTranslate = (element: HTMLElement, direction: DrawerDirection) => {
	const win = element.ownerDocument.defaultView ?? window;
	const transform = win.getComputedStyle(element).transform;

	if (transform === 'none') return 0;

	const matrix = new win.DOMMatrixReadOnly(transform);

	return isVertical(direction) ? matrix.m42 : matrix.m41;
};

export const dampenValue = (value: number) => 8 * (Math.log(value + 1) - 2);
