import { SvelteMap } from 'svelte/reactivity';
import { type Getter, type ReadableBox, boxWith } from '../internal/tools/index.js';
import type { Fn } from './types.js';
import { isIOS } from '@polumeyv/utilities/dom';
import { BROWSER } from '@polumeyv/utilities/env';
import { useId } from './use-id.js';
import { SharedState } from './shared-state.svelte.js';
import { on } from 'svelte/events';
import { onMount, tick, untrack } from 'svelte';

export interface ScrollBodyOption {
	padding?: boolean | number;
	margin?: boolean | number;
}
/** A map of lock ids to their `locked` state. */
const lockMap = new SvelteMap<string, boolean>();

let initialBodyStyle: string | null = $state<string | null>(null);
let stopTouchMoveListener: Fn | null = null;
let cleanupTimeoutId: number | null = null;
let isInCleanupTransition = false;

function cleanupTouchMoveListener() {
	stopTouchMoveListener?.();
	stopTouchMoveListener = null;
}

const anyLocked = boxWith(() => {
	for (const value of lockMap.values()) {
		if (value) return true;
	}
	return false;
});

/**
 * We track the time we scheduled the cleanup to prevent race conditions
 * when multiple locks are created/destroyed in the same tick, ensuring
 * only the last one to schedule the cleanup will run.
 *
 * reference: https://github.com/huntabyte/bits-ui/issues/1639
 */
let cleanupScheduledAt: number | null = null;

const bodyLockStackCount = new SharedState(() => {
	const doc = BROWSER && typeof document !== 'undefined' ? document : null;
	const win = doc?.defaultView ?? (BROWSER && typeof window !== 'undefined' ? window : null);
	let disposed = false;

	function getDOM() {
		if (!doc?.body || !doc.documentElement || !win) return null;
		return {
			body: doc.body,
			documentElement: doc.documentElement,
			doc,
			win,
		};
	}

	function resetBodyStyle() {
		const dom = getDOM();
		if (!dom) {
			initialBodyStyle = null;
			return;
		}
		dom.body.setAttribute('style', initialBodyStyle ?? '');
		dom.body.style.removeProperty('--scrollbar-width');
		if (isIOS) {
			cleanupTouchMoveListener();
		}
		// reset initialBodyStyle so next locker captures the correct styles
		initialBodyStyle = null;
	}

	function cancelPendingCleanup() {
		if (cleanupTimeoutId === null) return;
		win?.clearTimeout(cleanupTimeoutId);
		cleanupTimeoutId = null;
	}

	function scheduleCleanupIfNoNewLocks(delay: number | null, callback: () => void) {
		cancelPendingCleanup();
		if (!win) {
			isInCleanupTransition = false;
			return;
		}
		isInCleanupTransition = true;

		cleanupScheduledAt = Date.now();
		const currentCleanupId = cleanupScheduledAt;

		/**
		 * We schedule the cleanup to run after a delay to allow new locks to register
		 * that might have been added in the same tick as the current cleanup.
		 *
		 * If a new lock is added in the same tick, the cleanup will be cancelled and
		 * a new cleanup will be scheduled.
		 *
		 * This is to prevent the cleanup from running too early and resetting the body
		 * style before the new lock has had a chance to apply its styles.
		 */
		const cleanupFn = () => {
			cleanupTimeoutId = null;

			// check if this cleanup is still valid (no newer cleanups scheduled)
			if (cleanupScheduledAt !== currentCleanupId) return;

			// ensure no new locks were added during the delay
			if (!isAnyLocked(lockMap)) {
				isInCleanupTransition = false;
				callback();
			} else {
				isInCleanupTransition = false;
			}
		};

		const actualDelay = delay === null ? 24 : delay;
		cleanupTimeoutId = win.setTimeout(cleanupFn, actualDelay);
	}

	function ensureInitialStyleCaptured() {
		const dom = getDOM();
		if (!dom) return;
		// only capture initial style once, when no locks exist and no cleanup is in progress
		if (initialBodyStyle === null && lockMap.size === 0 && !isInCleanupTransition) {
			initialBodyStyle = dom.body.getAttribute('style');
		}
	}

	$effect(() => {
		anyLocked.current;
		untrack(() => {
			if (!anyLocked.current) return;
			const dom = getDOM();
			if (!dom) return;

			// ensure we've captured the initial style before applying any lock styles
			ensureInitialStyleCaptured();

			// if we're applying lock styles, we're no longer in a cleanup transition
			isInCleanupTransition = false;

			const htmlStyle = dom.win.getComputedStyle(dom.documentElement);
			const bodyStyle = dom.win.getComputedStyle(dom.body);

			// check if scrollbar-gutter: stable is already handling scrollbar space
			const hasStableGutter = htmlStyle.scrollbarGutter?.includes('stable') || bodyStyle.scrollbarGutter?.includes('stable');

			// TODO: account for RTL direction, etc.
			const verticalScrollbarWidth = dom.win.innerWidth - dom.documentElement.clientWidth;
			const paddingRight = Number.parseInt(bodyStyle.paddingRight ?? '0', 10);

			const config = {
				padding: paddingRight + verticalScrollbarWidth,
				margin: Number.parseInt(bodyStyle.marginRight ?? '0', 10),
			};

			// only add padding compensation if stable gutter isn't handling it
			if (verticalScrollbarWidth > 0 && !hasStableGutter) {
				dom.body.style.paddingRight = `${config.padding}px`;
				dom.body.style.marginRight = `${config.margin}px`;
				dom.body.style.setProperty('--scrollbar-width', `${verticalScrollbarWidth}px`);
			}
			dom.body.style.overflow = 'hidden';

			if (isIOS && !stopTouchMoveListener) {
				// IOS devices are special and require a touchmove listener to prevent scrolling.
				// Guard against duplicate listeners when concurrent locks mutate lockMap.
				stopTouchMoveListener = on(
					dom.doc,
					'touchmove',
					(e) => {
						if (e.target !== dom.documentElement) return;

						if (e.touches.length > 1) return;
						e.preventDefault();
					},
					{ passive: false },
				);
			}

			/**
			 * We ensure pointer-events: none is applied _after_ DOM updates, so that any focus/
			 * interaction changes from opening overlays/menus complete _before_ we block pointer
			 * events.
			 *
			 * this avoids race conditions where pointer-events could be set too early and break
			 * focus/interaction.
			 */
			tick().then(() => {
				const latestDOM = getDOM();
				if (disposed || !latestDOM || !isAnyLocked(lockMap)) return;
				latestDOM.body.style.pointerEvents = 'none';
				latestDOM.body.style.overflow = 'hidden';
			});
		});
	});

	$effect(() => {
		return () => {
			disposed = true;
			cleanupTouchMoveListener();
		};
	});

	return {
		get lockMap() {
			return lockMap;
		},
		resetBodyStyle,
		scheduleCleanupIfNoNewLocks,
		cancelPendingCleanup,
		ensureInitialStyleCaptured,
	};
});

export class BodyScrollLock {
	readonly #id = useId();
	readonly #initialState: boolean | undefined;
	readonly #restoreScrollDelay: Getter<number | null> = () => null;
	readonly #countState: ReturnType<typeof bodyLockStackCount.get>;
	readonly locked: ReadableBox<boolean> | undefined;

	constructor(initialState?: boolean | undefined, restoreScrollDelay: Getter<number | null> = () => null) {
		this.#initialState = initialState;
		this.#restoreScrollDelay = restoreScrollDelay;
		this.#countState = bodyLockStackCount.get();

		if (!this.#countState) return;

		/**
		 * Since a new lock is being created, we cancel any pending cleanup to
		 * prevent the cleanup from running too early and resetting the body style
		 * before the new lock has had a chance to apply its styles.
		 *
		 * reference: https://github.com/huntabyte/bits-ui/issues/1639
		 */
		this.#countState.cancelPendingCleanup();

		// capture initial style before this lock is registered
		this.#countState.ensureInitialStyleCaptured();

		this.#countState.lockMap.set(this.#id, this.#initialState ?? false);

		this.locked = boxWith(
			() => this.#countState.lockMap.get(this.#id) ?? false,
			(v) => this.#countState.lockMap.set(this.#id, v),
		);

		onMount(() => () => {
			this.#countState.lockMap.delete(this.#id);

			// if not the last lock, we don't need to do anything
			if (isAnyLocked(this.#countState.lockMap)) return;

			const restoreScrollDelay = this.#restoreScrollDelay();

			/**
			 * We schedule the cleanup to run after a delay to handle same-tick
			 * destroy/create scenarios.
			 *
			 * reference: https://github.com/huntabyte/bits-ui/issues/1639
			 */
			this.#countState.scheduleCleanupIfNoNewLocks(restoreScrollDelay, () => {
				this.#countState.resetBodyStyle();
			});
		});
	}
}

function isAnyLocked(map: Map<string, boolean>) {
	for (const [_, value] of map) {
		if (value) return true;
	}
	return false;
}
