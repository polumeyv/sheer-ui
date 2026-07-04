import { untrack } from 'svelte';
import { type ReadableBoxedValues } from './tools/index.js';
import { AnimationsComplete } from './animations-complete.js';
import type { TransitionState } from './attrs.js';

/**
 * Defers a callback until the element's exit animations have finished. The real
 * implementation is {@link AnimationsComplete}; tests inject a fake to drive the
 * timing deterministically (this is the only async seam in PresenceManager).
 */
export interface AfterAnimationsRunner {
	run(fn: () => void | Promise<void>): void;
}

interface PresenceManagerOpts extends ReadableBoxedValues<{
	open: boolean;
	ref: HTMLElement | null;
}> {
	onComplete?: () => void;
	enabled?: boolean;
	shouldSkipExitAnimation?: () => boolean;
	/** Seam for tests; defaults to {@link AnimationsComplete} bound to `ref`/`open`. */
	afterAnimations?: AfterAnimationsRunner;
}

export class PresenceManager {
	#opts: PresenceManagerOpts;
	#enabled: boolean;
	#afterAnimations: AfterAnimationsRunner;
	shouldRender = $state(false);
	transitionStatus = $state<TransitionState>(undefined);
	#hasMounted = false;
	#transitionFrame: number | null = null;

	constructor(opts: PresenceManagerOpts) {
		this.#opts = opts;
		this.shouldRender = opts.open.current;
		this.#enabled = opts.enabled ?? true;
		this.#afterAnimations =
			opts.afterAnimations ??
			new AnimationsComplete({
				ref: this.#opts.ref,
				deferToTick: this.#opts.open,
			});
		$effect(() => () => this.#clearTransitionFrame());

		$effect(() => {
			const isOpen = this.#opts.open.current;
			untrack(() => {
				if (!this.#hasMounted) {
					this.#hasMounted = true;
					return;
				}

				this.#clearTransitionFrame();

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

				this.#afterAnimations.run(() => {
					if (isOpen === this.#opts.open.current) {
						if (!this.#opts.open.current) {
							this.shouldRender = false;
						}
						this.transitionStatus = undefined;
						this.#opts.onComplete?.();
					}
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
