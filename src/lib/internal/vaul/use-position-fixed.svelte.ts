import type { Box, Getter } from '../tools/index.js';
import { needsIOSFixedBodyScrollLock } from './browser.js';
import { untrack } from 'svelte';
import { scrollY } from 'svelte/reactivity/window';

let previousBodyPosition: Record<string, string> | null = null;

/**
 * This hook is necessary to prevent buggy behavior on iOS devices (need to test on Android).
 * I won't get into too much detail about what bugs it solves, but so far I've found that setting the body to `position: fixed` is the most reliable way to prevent those bugs.
 * Issues that this hook solves:
 * https://github.com/emilkowalski/vaul/issues/435
 * https://github.com/emilkowalski/vaul/issues/433
 * And more that I discovered, but were just not reported.
 */
export function usePositionFixed({
	open,
	modal,
	nested,
	hasBeenOpened,
	preventScrollRestoration,
	noBodyStyles,
}: {
	open: Box<boolean>;
	modal: Box<boolean>;
	nested: Box<boolean>;
	preventScrollRestoration: Box<boolean>;
	noBodyStyles: Box<boolean>;
} & {
	hasBeenOpened: Getter<boolean>;
}) {
	let activeUrl = $state(typeof window !== 'undefined' ? window.location.href : '');

	function setPositionFixed() {
		// All browsers on iOS will return true here.
		if (!needsIOSFixedBodyScrollLock()) return;

		// If previousBodyPosition is already set, don't set it again.
		if (previousBodyPosition === null && open.current && !noBodyStyles.current) {
			previousBodyPosition = {
				position: document.body.style.position,
				top: document.body.style.top,
				left: document.body.style.left,
				height: document.body.style.height,
				right: 'unset',
			};

			// Update the dom inside an animation frame
			const { scrollX, innerHeight } = window;
			const scrollPos = scrollY.current ?? 0;

			document.body.style.setProperty('position', 'fixed', 'important');
			Object.assign(document.body.style, {
				top: `${-scrollPos}px`,
				left: `${-scrollX}px`,
				right: '0px',
				height: 'auto',
			});

			window.setTimeout(
				() =>
					window.requestAnimationFrame(() => {
						// Attempt to check if the bottom bar appeared due to the position change
						const bottomBarHeight = innerHeight - window.innerHeight;
						if (bottomBarHeight && scrollPos >= innerHeight) {
							// Move the content further up so that the bottom bar doesn't hide it
							document.body.style.top = `${-(scrollPos + bottomBarHeight)}px`;
						}
					}),
				300,
			);
		}
	}

	function restorePositionSetting() {
		// All browsers on iOS will return true here.
		if (!needsIOSFixedBodyScrollLock()) return;

		if (previousBodyPosition !== null && !noBodyStyles.current) {
			// Convert the position from "px" to Int
			const y = -parseInt(document.body.style.top, 10);
			const x = -parseInt(document.body.style.left, 10);

			// Restore styles
			Object.assign(document.body.style, previousBodyPosition);

			window.requestAnimationFrame(() => {
				if (preventScrollRestoration.current && activeUrl !== window.location.href) {
					activeUrl = window.location.href;
					return;
				}

				window.scrollTo(x, y);
			});

			previousBodyPosition = null;
		}
	}

	$effect(() => {
		const _modal = modal.current;
		const _activeUrl = activeUrl;
		return untrack(() => {
			if (!modal.current) return;
			return () => {
				if (typeof document === 'undefined') return;
				// Another drawer is opened, safe to ignore the execution
				const hasDrawerOpened = !!document.querySelector('[data-vaul-drawer]');
				if (hasDrawerOpened) return;

				restorePositionSetting();
			};
		});
	});

	$effect(() => {
		const _open = open.current;
		const _hasBeenOpened = hasBeenOpened();
		const _activeUrl = activeUrl;
		const _modal = modal.current;
		const _nested = nested.current;
		untrack(() => {
			if (nested.current || !hasBeenOpened()) return;
			// This is needed to force Safari toolbar to show **before** the drawer starts animating to prevent a gnarly shift from happening
			if (open.current) {
				// avoid for standalone mode (PWA)
				const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
				!isStandalone && setPositionFixed();

				if (!modal.current) {
					window.setTimeout(() => {
						restorePositionSetting();
					}, 500);
				}
			} else {
				restorePositionSetting();
			}
		});
	});

	return { restorePositionSetting };
}
