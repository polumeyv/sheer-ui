import { untrack } from 'svelte';
import { AnimationsComplete } from './animations-complete.svelte';
import type { TransitionState } from './attrs';
import type { Getter } from '$lib/vendor/utils';

interface PresenceOpts {
	open: Getter<boolean>;
	ref: Getter<HTMLElement | null>;
	onComplete?: () => void;
	enabled?: boolean;
	shouldSkipExitAnimation?: () => boolean;
}

/**
 * Keeps content mounted across its exit animation: `shouldRender` stays true
 * while closing until the animations on `ref` finish, then flips false and calls
 * `onComplete`. `transitionStatus` drives the `data-starting-style`/`data-ending-style`
 * hooks.
 *
 * Ported from PresenceManager. runed's non-lazy `watch(open, cb)` ran the body
 * immediately and on every change — that's just a `$effect` reading `open()`. The
 * `#hasMounted` guard skips the initial run so an already-open element doesn't
 * animate on mount. The body runs untracked (it only reads `open` at fire time).
 */
export class Presence {
	#opts: PresenceOpts;
	#enabled: boolean;
	#afterAnimations: AnimationsComplete;
	#shouldRender = $state(false);
	#transitionStatus = $state<TransitionState>(undefined);
	#hasMounted = false;
	#transitionFrame: number | null = null;

	constructor(opts: PresenceOpts) {
		this.#opts = opts;
		this.#shouldRender = opts.open();
		this.#enabled = opts.enabled ?? true;
		this.#afterAnimations = new AnimationsComplete({
			ref: {
				get current() {
					return opts.ref();
				},
			},
			afterTick: {
				get current() {
					return opts.open();
				},
			},
		});
		$effect(() => () => this.#clearTransitionFrame());

		$effect(() => {
			const isOpen = this.#opts.open();
			untrack(() => this.#sync(isOpen));
		});
	}

	#sync(isOpen: boolean): void {
		if (!this.#hasMounted) {
			this.#hasMounted = true;
			return;
		}

		this.#clearTransitionFrame();

		if (!isOpen && this.#opts.shouldSkipExitAnimation?.()) {
			this.#shouldRender = false;
			this.#transitionStatus = undefined;
			this.#opts.onComplete?.();
			return;
		}

		if (isOpen) this.#shouldRender = true;
		this.#transitionStatus = isOpen ? 'starting' : 'ending';
		if (isOpen) {
			this.#transitionFrame = window.requestAnimationFrame(() => {
				this.#transitionFrame = null;
				if (this.#opts.open()) {
					this.#transitionStatus = undefined;
				}
			});
		}

		if (!this.#enabled) {
			if (!isOpen) this.#shouldRender = false;
			this.#transitionStatus = undefined;
			this.#opts.onComplete?.();
			return;
		}

		this.#afterAnimations.run(() => {
			if (isOpen === this.#opts.open()) {
				if (!this.#opts.open()) this.#shouldRender = false;
				this.#transitionStatus = undefined;
				this.#opts.onComplete?.();
			}
		});
	}

	get shouldRender() {
		return this.#shouldRender;
	}

	get transitionStatus(): TransitionState {
		return this.#transitionStatus;
	}

	#clearTransitionFrame(): void {
		if (this.#transitionFrame === null) return;
		window.cancelAnimationFrame(this.#transitionFrame);
		this.#transitionFrame = null;
	}
}
