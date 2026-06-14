import { untrack } from "svelte";
import { type ReadableProps } from '$lib/vendor/index';
import { AnimationsComplete } from './animations-complete.svelte';
import type { TransitionState } from './attrs';

interface PresenceManagerOpts extends ReadableProps<{
	open: boolean;
	ref: HTMLElement | null;
}> {
	onComplete?: () => void;
	enabled?: boolean;
	shouldSkipExitAnimation?: () => boolean;
}

export class PresenceManager {
	#opts: PresenceManagerOpts;
	#enabled: boolean;
	#afterAnimations: AnimationsComplete;
	#shouldRender = $state(false);
	#transitionStatus = $state<TransitionState>(undefined);
	#hasMounted = false;
	#transitionFrame: number | null = null;

	constructor(opts: PresenceManagerOpts) {
		this.#opts = opts;
		this.#shouldRender = opts.open.current;
		this.#enabled = opts.enabled ?? true;
		this.#afterAnimations = new AnimationsComplete({
			ref: this.#opts.ref,
			afterTick: this.#opts.open,
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
						if (this.#opts.open.current) {
							this.#transitionStatus = undefined;
						}
					});
				}

				if (!this.#enabled) {
					if (!isOpen) {
						this.#shouldRender = false;
					}
					this.#transitionStatus = undefined;
					this.#opts.onComplete?.();
					return;
				}

				this.#afterAnimations.run(() => {
					if (isOpen === this.#opts.open.current) {
						if (!this.#opts.open.current) {
							this.#shouldRender = false;
						}
						this.#transitionStatus = undefined;
						this.#opts.onComplete?.();
					}
				});
			});
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
