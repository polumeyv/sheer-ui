import { untrack } from 'svelte';
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

	// A close during an enter retargets the transition: the browser cancels the enter (its
	// `finished` rejects) and starts the exit, so re-query — one pass per frame. Bounded: a
	// descendant whose transition is continuously retargeted (live progress bar, hover colour
	// under a moving pointer) rejects every pass and must not hold the settle open forever.
	for (let pass = 0; ; pass++) {
		const running = node
			.getAnimations({ subtree })
			.filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity && isInFlight(animation));
		if (running.length === 0) return;

		const results = await Promise.allSettled(running.map((animation) => animation.finished));
		if (pass === MAX_RETARGET_PASSES || !results.some((result) => result.status === 'rejected')) return;
		await new Promise(requestAnimationFrame);
	}
};

const MAX_RETARGET_PASSES = 3;

// `finished` only ever resolves for an animation that is running (or about to be, `pending`);
// paused/idle finite animations (animation-play-state: paused, a reduced-motion override) would
// strand the caller exactly like an infinite one.
const isInFlight = (animation: Animation) => animation.pending || animation.playState === 'running';

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
 * `skipSettle` answers per flip: true completes synchronously and drops any pending settle
 * (a menubar swap, where the outgoing menu's exit is zeroed).
 * `pending` is true from a flip until its completion fires — an always-mounted surface is still
 * rendered while a close is pending, which is what its locks key on.
 */
export function useOpenChangeComplete(
	open: Getter<boolean>,
	ref: Getter<HTMLElement | null>,
	onComplete: (open: boolean) => void,
	skipSettle: (open: boolean) => boolean = () => false,
): { readonly pending: boolean } {
	let prevOpen = open();
	let pending = $state(false);
	const settle = createSettleRunner({ subtree: false });
	$effect(() => {
		const el = ref();
		const isOpen = open();
		if (isOpen === prevOpen) return;
		prevOpen = isOpen;
		untrack(() => {
			if (!el || skipSettle(isOpen)) {
				settle.cancel();
				pending = false;
				if (el) onComplete(isOpen);
				return;
			}
			pending = true;
			settle.run(el, () => {
				pending = false;
				onComplete(isOpen);
			});
		});
	});
	return {
		get pending() {
			return pending;
		},
	};
}
