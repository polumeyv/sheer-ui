import type { Getter } from './tools/index.js';

/**
 * Resolves once the node's running animations/transitions finish (descendants included
 * unless `subtree: false`) — `frames` frames first so a transition triggered by the current
 * render has started. Environments without getAnimations (jsdom) resolve immediately
 * after the frames.
 * Infinite animations (Skeleton pulse, caret-blink, animate-spin) are excluded — their
 * `finished` never resolves and would strand the caller.
 *
 * TODO(revisit ~mid-2027): ::details-content + `content-visibility allow-discrete` lets the
 * browser hold content rendered through the close, deleting the disclosure use (83% 2026-07).
 */
export const animationsSettled = async (node: HTMLElement, { subtree = true, frames = 1 } = {}): Promise<void> => {
	for (let i = 0; i < frames; i++) await new Promise(requestAnimationFrame);
	if (typeof node.getAnimations !== 'function') return;
	await Promise.allSettled(
		node
			.getAnimations({ subtree })
			.filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
			.map((animation) => animation.finished),
	);
};

export interface SettleRunner {
	/** Runs `fn` once `node` settles, superseding any pending run. A null node cancels and drops. */
	run(node: HTMLElement | null, fn: () => void): void;
	cancel(): void;
}

/**
 * The one supersession idiom for settle-deferred work: a monotonic token, so the newest
 * `run` wins and everything older is dropped. Cancels when the owning effect is destroyed,
 * which works at component init and inside an attachment body alike.
 */
export function createSettleRunner(options?: { subtree?: boolean; frames?: number }): SettleRunner {
	let token = 0;

	const cancel = () => {
		token++;
	};

	const run = (node: HTMLElement | null, fn: () => void) => {
		const current = ++token;
		if (!node) return;
		void animationsSettled(node, options).then(() => {
			if (current === token) fn();
		});
	};

	$effect(() => cancel);

	return { run, cancel };
}

/**
 * Fires `onComplete` after an open/close flip once the surface's own animations settle.
 * Settle-based rather than transitionend so completion still fires when no transition
 * runs (duration-0 override, reduced motion, jsdom). A flip while a settle is pending
 * supersedes it; a flip while the surface has no node cancels and is dropped.
 */
export function useOpenChangeComplete(open: Getter<boolean>, ref: Getter<HTMLElement | null>, onComplete: (open: boolean) => void) {
	let prevOpen = open();
	const settle = createSettleRunner({ subtree: false });
	$effect(() => {
		const el = ref();
		const isOpen = open();
		if (isOpen === prevOpen) return;
		prevOpen = isOpen;
		settle.run(el, () => onComplete(isOpen));
	});
}
