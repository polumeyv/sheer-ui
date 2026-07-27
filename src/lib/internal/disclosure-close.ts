/**
 * Resolves once the subtree's running animations/transitions finish — one frame first so a
 * transition triggered by the current render has started. Environments without
 * getAnimations (jsdom) resolve immediately after the frame.
 */
export const animationsSettled = async (node: HTMLElement): Promise<void> => {
	await new Promise(requestAnimationFrame);
	if (typeof node.getAnimations !== 'function') return;
	await Promise.allSettled(node.getAnimations({ subtree: true }).map((animation) => animation.finished));
};
