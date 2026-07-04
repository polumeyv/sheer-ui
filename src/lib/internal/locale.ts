// https://github.com/melt-ui/melt-ui
import type { Direction } from './index.js';

/**
 * Detects the text direction in the element.
 * @returns {Direction} The text direction ('ltr' for left-to-right or 'rtl' for right-to-left).
 */
export const getElemDirection = (elem: HTMLElement): Direction =>
	(elem.ownerDocument.defaultView ?? window).getComputedStyle(elem).direction as Direction;
