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
