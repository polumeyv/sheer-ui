import { untrack } from 'svelte';
import { type ReadableBoxedValues } from './tools/index.js';
import { createSettleRunner, type SettleRunner } from './animations-settled.svelte.js';
import type { TransitionState } from './attrs.js';

// TODO(backlog): this module exists to keep elements mounted through their exit transition.
// Its remaining consumer is the drawer path (dialog-overlay + dialog-content-headless); the
// menu family, select/combobox and navigation-menu are on the always-mounted recipe. Copy the menu, not the tooltip/nav-menu one: Firefox never transitions
// `display` (BCD css.properties.display.is_transitionable), so a `transition-discrete` display
// exit snaps there; the menu keeps the closed state visibility:hidden (`popup-surface` in ui.css)
// and completes through useOpenChangeComplete. The drawer path (dialog-content-headless +
// dialog-overlay) cannot migrate: vaul's exit is keyframes on [data-state=closed].

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

/** The presence-driven surfaces' shared prop: keep the element mounted while closed. */
export type PresenceProps = {
	/**
	 * Whether to force mount the component, regardless of the open state — for a consumer
	 * driving its own transition.
	 */
	forceMount?: boolean;
};

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
