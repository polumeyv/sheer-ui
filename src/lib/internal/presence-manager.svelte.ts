import { untrack } from 'svelte';
import { type ReadableBoxedValues } from './tools/index.js';
import { createSettleRunner, type SettleRunner } from './animations-settled.svelte.js';
import type { TransitionState } from './attrs.js';

// TODO(backlog): this module + presence-layer/ + animations-settled.svelte.ts + the
// --tw-enter/exit keyframe system exist to keep elements mounted through exit keyframes.
// Migrating the remaining consumers (menu, select/combobox popup, navigation-menu,
// scroll-area) to the dialog/popover recipe — always-mounted + transition-[…,display]
// transition-discrete + @starting-style (88.9% 2026-07, same bar dialog/sheet already
// shipped on) — deletes most of it (~230 LoC JS + ~330 lines ui.css). The drawer path
// (dialog-content-headless + dialog-overlay) cannot migrate: vaul's exit is keyframes
// on [data-state=closed], which display transitions can't hold open.

interface PresenceManagerOpts extends ReadableBoxedValues<{
	open: boolean;
	ref: HTMLElement | null;
}> {
	onComplete?: () => void;
	enabled?: boolean;
	shouldSkipExitAnimation?: () => boolean;
	/** The only async seam in PresenceManager; tests inject a fake to drive the timing deterministically. */
	afterAnimations?: SettleRunner;
}

export class PresenceManager {
	#opts: PresenceManagerOpts;
	#enabled: boolean;
	#afterAnimations: SettleRunner;
	shouldRender = $state(false);
	transitionStatus = $state<TransitionState>(undefined);
	#hasMounted = false;
	#transitionFrame: number | null = null;

	constructor(opts: PresenceManagerOpts) {
		this.#opts = opts;
		this.shouldRender = opts.open.current;
		this.#enabled = opts.enabled ?? true;
		this.#afterAnimations = opts.afterAnimations ?? createSettleRunner({ subtree: false });
		$effect(() => () => this.#clearTransitionFrame());

		$effect(() => {
			const isOpen = this.#opts.open.current;
			untrack(() => {
				if (!this.#hasMounted) {
					this.#hasMounted = true;
					return;
				}

				this.#clearTransitionFrame();
				this.#afterAnimations.cancel();

				if (!isOpen && this.#opts.shouldSkipExitAnimation?.()) {
					this.shouldRender = false;
					this.transitionStatus = undefined;
					this.#opts.onComplete?.();
					return;
				}

				if (isOpen) this.shouldRender = true;
				this.transitionStatus = isOpen ? 'starting' : 'ending';
				if (isOpen) {
					this.#transitionFrame = window.requestAnimationFrame(() => {
						this.#transitionFrame = null;
						if (this.#opts.open.current) {
							this.transitionStatus = undefined;
						}
					});
				}

				if (!this.#enabled) {
					if (!isOpen) {
						this.shouldRender = false;
					}
					this.transitionStatus = undefined;
					this.#opts.onComplete?.();
					return;
				}

				// The runner supersedes: a flip before settle cancels this run (above), so the
				// callback always sees the open state it was scheduled for.
				this.#afterAnimations.run(this.#opts.ref.current, () => {
					if (!isOpen) this.shouldRender = false;
					this.transitionStatus = undefined;
					this.#opts.onComplete?.();
				});
			});
		});
	}

	#clearTransitionFrame(): void {
		if (this.#transitionFrame === null) return;
		window.cancelAnimationFrame(this.#transitionFrame);
		this.#transitionFrame = null;
	}
}
