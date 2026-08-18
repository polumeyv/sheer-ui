import type { Getter } from './tools/index.js';

/**
 * Resolves once the node's running animations/transitions finish (descendants included
 * unless `subtree: false`) — one frame first so a transition triggered by the current
 * render has started. Environments without getAnimations (jsdom) resolve immediately
 * after the frame.
 * Infinite animations (Skeleton pulse, caret-blink, animate-spin) are excluded — their
 * `finished` never resolves and would strand the caller.
 *
 * TODO(revisit ~mid-2027): ::details-content + `content-visibility allow-discrete` lets the
 * browser hold content rendered through the close, deleting the disclosure use (83% 2026-07).
 */
export const animationsSettled = async (node: HTMLElement, { subtree = true } = {}): Promise<void> => {
	await new Promise(requestAnimationFrame);
	if (typeof node.getAnimations !== 'function') return;
	await Promise.allSettled(
		node
			.getAnimations({ subtree })
			.filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
			.map((animation) => animation.finished),
	);
};

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
