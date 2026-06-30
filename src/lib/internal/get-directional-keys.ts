import { kbd } from './kbd.js';
import type { Direction, Orientation } from '$lib/internal/index.js';

export const getDirectionalKeys = (dir: Direction = 'ltr', orientation: Orientation = 'horizontal') => ({
	nextKey: orientation === 'vertical' ? kbd.ARROW_DOWN : dir === 'rtl' ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
	prevKey: orientation === 'vertical' ? kbd.ARROW_UP : dir === 'rtl' ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
});
