import type { Getter } from './tools/index.js';
import { animationsSettled } from './disclosure-close.js';

/**
 * Fires `onComplete` after an open/close flip once the surface's own animations settle.
 * Settle-based rather than transitionend so completion still fires when no transition
 * runs (duration-0 override, reduced motion, jsdom). A flip while a settle is pending
 * supersedes it; a flip while the surface has no node is dropped.
 */
export function useOpenChangeComplete(open: Getter<boolean>, ref: Getter<HTMLElement | null>, onComplete: (open: boolean) => void) {
	let prevOpen = open();
	let completeToken = 0;
	$effect(() => {
		const el = ref();
		const isOpen = open();
		if (isOpen === prevOpen) return;
		prevOpen = isOpen;
		if (!el) return;
		const token = ++completeToken;
		void animationsSettled(el, { subtree: false }).then(() => {
			if (token === completeToken) onComplete(isOpen);
		});
	});
}
