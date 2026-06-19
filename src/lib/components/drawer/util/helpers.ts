/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DrawerDirection } from './types.js';

interface Style {
	[key: string]: string;
}

const cache = new WeakMap();

export function isInView(el: HTMLElement): boolean {
	const rect = el.getBoundingClientRect();

	if (!window.visualViewport) return false;

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		// Need + 40 for safari detection
		rect.bottom <= window.visualViewport.height - 40 &&
		rect.right <= window.visualViewport.width
	);
}

export function set(el: Element | HTMLElement | null | undefined, styles: Style, ignoreCache = false) {
	if (!el || !(el instanceof HTMLElement)) return;
	let originalStyles: Style = {};

	Object.entries(styles).forEach(([key, value]: [string, string]) => {
		if (key.startsWith('--')) {
			el.style.setProperty(key, value);
			return;
		}

		originalStyles[key] = (el.style as any)[key];
		(el.style as any)[key] = value;
	});

	if (ignoreCache) return;

	cache.set(el, originalStyles);
}

export const reset = (el: Element | HTMLElement | null, prop?: string) => {
	if (!el || !(el instanceof HTMLElement)) return;
	const originalStyles = cache.get(el);
	if (!originalStyles) return;
	prop
		? ((el.style as any)[prop] = originalStyles[prop])
		: Object.entries(originalStyles).forEach(([key, value]) => ((el.style as any)[key] = value));
};

export const isVertical = (direction: DrawerDirection) => direction === 'top' || direction === 'bottom';

export const getTranslate = (element: HTMLElement, direction: DrawerDirection): number | null => {
	if (!element) return null;
	const transform = window.getComputedStyle(element).transform;
	const mat3d = transform.match(/^matrix3d\((.+)\)$/);
	if (mat3d) return parseFloat(mat3d[1].split(', ')[isVertical(direction) ? 13 : 12]);
	const mat = transform.match(/^matrix\((.+)\)$/);
	return mat ? parseFloat(mat[1].split(', ')[isVertical(direction) ? 5 : 4]) : null;
};
export const dampenValue = (v: number) => 8 * (Math.log(v + 1) - 2);

export const assignStyle = (element: HTMLElement | null | undefined, style: Partial<CSSStyleDeclaration>) => {
	if (!element) return () => {};
	const prevStyle = element.style.cssText;
	Object.assign(element.style, style);
	return () => (element.style.cssText = prevStyle);
};
