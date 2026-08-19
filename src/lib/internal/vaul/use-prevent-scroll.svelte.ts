// This code comes from https://github.com/adobe/react-spectrum/blob/main/packages/react-aria/src/overlays/usePreventScroll.ts

import { isIOS } from '../tools/utils/dom.js';
import { BROWSER } from 'esm-env';
import { isWebKit } from './browser.js';
import { SharedState } from '../shared-state.svelte.js';
import { BodyScrollLock } from '../body-scroll-lock.svelte.js';
import { on } from 'svelte/events';
import { getAbortSignal, untrack } from 'svelte';

interface PreventScrollOptions {
	/** Whether the scroll lock is disabled. */
	isDisabled: () => boolean;
}

const visualViewport = BROWSER && window.visualViewport;

const isScrollable = (node: Element | null, checkForOverflow?: boolean): boolean => {
	if (!node) return false;

	const style = window.getComputedStyle(node);
	const root = document.scrollingElement || document.documentElement;
	let scrollable = /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);

	// Root element has `visible` overflow by default, but is scrollable nonetheless.
	if (node === root && style.overflow !== 'hidden') {
		scrollable = true;
	}

	if (scrollable && checkForOverflow) {
		scrollable = node.scrollHeight !== node.clientHeight || node.scrollWidth !== node.clientWidth;
	}

	return scrollable;
};

const getScrollParent = (node: Element, checkForOverflow?: boolean): Element => {
	let scrollableNode: Element | null = isScrollable(node, checkForOverflow) ? node.parentElement : node;

	while (scrollableNode && !isScrollable(scrollableNode, checkForOverflow)) {
		scrollableNode = scrollableNode.parentElement;
	}

	return scrollableNode || document.scrollingElement || document.documentElement;
};

// HTML input types that do not cause the software keyboard to appear.
const nonTextInputTypes = new Set(['checkbox', 'radio', 'range', 'color', 'file', 'image', 'button', 'submit', 'reset']);

// Shared across every usePreventScroll consumer: the iOS WebKit touch/focus/scroll workaround
// attaches on the first active caller and tears down when the last one releases. This is separate
// from body-lock coordination below — it's Drawer-specific (dragging a sheet on iOS), not
// something Dialog/Popover/Select need.
const preventScroll = new SharedState(() => {
	// Setup runs inside the effect (matching upstream react-spectrum's useEffect timing) so the
	// workaround can ride the effect's abort signal; the signal aborts when the shared root is
	// disposed, i.e. when the last consumer releases.
	$effect(() => {
		// Upstream gates on isIOS() && isWebKit(): iOS 17.4+ allows non-WebKit engines in the EU,
		// and those don't have WebKit's scroll-lock quirks.
		if (!isIOS || !isWebKit()) return;
		preventScrollMobileWebKit(getAbortSignal());
	});
});

/**
 * Prevents scrolling on the document body on mount, and
 * restores it on unmount. Also ensures that content does not
 * shift due to the scrollbars disappearing.
 *
 * The actual body-style lock (overflow/scrollbar-compensation/pointer-events) is delegated to
 * `BodyScrollLock` — the same shared, refcounted lock Dialog/Sheet/Select/Popover use — so a
 * Drawer opened over (or under) one of those doesn't run two uncoordinated scroll-lock strategies
 * at once. `onMount` (which `BodyScrollLock`'s constructor uses) is just `$effect` under the hood
 * in runes mode, so constructing it fresh inside this effect ties its register/unregister to
 * *this* effect's re-run/teardown, not to the whole component's mount/unmount — exactly "acquire
 * while enabled, release the moment it's disabled" without needing to expose a settable lock.
 * The iOS touch/focus/scroll workaround above stays Drawer-specific.
 *
 * Both are constructed inside `untrack` — their own internal reads/writes (lockMap bookkeeping,
 * refcounting) must not become dependencies of *this* effect, or a write during construction can
 * retrigger the very effect that's constructing it.
 */
export const usePreventScroll = (opts: PreventScrollOptions) => {
	$effect(() => {
		if (opts.isDisabled()) return;
		untrack(() => {
			new BodyScrollLock(true);
			preventScroll.get();
		});
	});
};

// Mobile Safari is a whole different beast. Even with overflow: hidden,
// it still scrolls the page in many situations:
//
// 1. When the bottom toolbar and address bar are collapsed, page scrolling is always allowed.
// 2. When the keyboard is visible, the viewport does not resize. Instead, the keyboard covers part of
//    it, so it becomes scrollable.
// 3. When tapping on an input, the page always scrolls so that the input is centered in the visual viewport.
//    This may cause even fixed position elements to scroll off the screen.
// 4. When using the next/previous buttons in the keyboard to navigate between inputs, the whole page always
//    scrolls, even if the input is inside a nested scrollable element that could be scrolled instead.
//
// In order to work around these cases, and prevent scrolling without jankiness, we do a few things:
//
// 1. Prevent default on `touchmove` events that are not in a scrollable element. This prevents touch scrolling
//    on the window.
// 2. Set `overscroll-behavior: contain` on nested scrollable regions so they do not scroll the page when at
//    the top or bottom. Work around a bug where this does not work when the element does not actually overflow
//    by preventing default in a `touchmove` event. This is best effort: we can't prevent default when pinch
//    zooming or when an element contains text selection, which may allow scrolling in some cases.
// 3. Override focus to prevent WebKit's native page scroll toward the focused input, then scroll it into
//    view ourselves within its scroll parents.
function preventScrollMobileWebKit(signal: AbortSignal) {
	let scrollable: Element;
	let allowTouchMove = false;

	const onTouchStart = (e: TouchEvent) => {
		// Store the nearest scrollable parent element from the element that the user touched.
		const target = e.target as Element;
		scrollable = isScrollable(target) ? target : getScrollParent(target, true);
		allowTouchMove = false;

		// If the target is selected, don't preventDefault in touchmove to allow the user to adjust the selection.
		const selection = target.ownerDocument.defaultView?.getSelection();
		if (selection && !selection.isCollapsed && selection.containsNode(target, true)) {
			allowTouchMove = true;
		}

		// If this is a range input, allow touch move to allow the user to adjust the slider value.
		if (e.composedPath().some((el) => el instanceof HTMLInputElement && el.type === 'range')) {
			allowTouchMove = true;
		}

		// If this is a focused input element with a selected range, allow the user to drag the selection handles.
		if (
			'selectionStart' in target &&
			'selectionEnd' in target &&
			(target.selectionStart as number) < (target.selectionEnd as number) &&
			target.ownerDocument.activeElement === target
		) {
			allowTouchMove = true;
		}
	};

	// Prevent scrolling up when at the top and scrolling down when at the bottom
	// of a nested scrollable area, otherwise mobile Safari will start scrolling
	// the window instead.
	// This must be applied before the touchstart event as of iOS 26, so inject it as a <style> element.
	const style = document.createElement('style');
	style.textContent = '@layer { * { overscroll-behavior: contain; } }';
	document.head.prepend(style);

	const onTouchMove = (e: TouchEvent) => {
		// Allow pinch-zooming.
		if (e.touches.length === 2 || allowTouchMove) {
			return;
		}

		// Prevent scrolling the window.
		if (!scrollable || scrollable === document.documentElement || scrollable === document.body) {
			e.preventDefault();
			return;
		}

		// overscroll-behavior should prevent scroll chaining, but currently does not
		// if the element doesn't actually overflow. https://bugs.webkit.org/show_bug.cgi?id=243452
		// This checks that both the width and height do not overflow, otherwise we might
		// block horizontal scrolling too. In that case, adding `touch-action: pan-x` to
		// the element will prevent vertical page scrolling. We can't add that automatically
		// because it must be set before the touchstart event.
		if (scrollable.scrollHeight === scrollable.clientHeight && scrollable.scrollWidth === scrollable.clientWidth) {
			e.preventDefault();
		}
	};

	const onBlur = (e: FocusEvent) => {
		const target = e.target as HTMLElement;
		const relatedTarget = e.relatedTarget as HTMLElement | null;
		if (relatedTarget && isInput(relatedTarget)) {
			// Focus without scrolling the whole page, and then scroll into view manually.
			relatedTarget.focus({ preventScroll: true });
			scrollIntoViewWhenReady(relatedTarget, isInput(target));
		} else if (!relatedTarget) {
			// When tapping the Done button on the keyboard, focus moves to the body.
			// FocusScope will then restore focus back to the input. Later when tapping
			// the same input again, it is already focused, so no blur event will fire,
			// resulting in the flow above never running and Safari's native scrolling occurring.
			// Instead, move focus to the parent focusable element (e.g. the dialog).
			const focusable = target.parentElement?.closest<HTMLElement>('[tabindex]');
			focusable?.focus({ preventScroll: true });
		}
	};

	// Override programmatic focus to scroll into view without scrolling the whole page.
	const focus = HTMLElement.prototype.focus;
	HTMLElement.prototype.focus = function (options?: FocusOptions) {
		// Track whether the keyboard was already visible before.
		const activeElement = document.activeElement;
		const wasKeyboardVisible = activeElement != null && isInput(activeElement);

		// Focus the element without scrolling the page.
		focus.call(this, { ...options, preventScroll: true });

		if (!options || !options.preventScroll) {
			scrollIntoViewWhenReady(this, wasKeyboardVisible);
		}
	};

	on(document, 'touchstart', onTouchStart, { passive: false, capture: true, signal });
	on(document, 'touchmove', onTouchMove, { passive: false, capture: true, signal });
	on(document, 'blur', onBlur, { capture: true, signal });

	signal.addEventListener('abort', () => {
		style.remove();
		HTMLElement.prototype.focus = focus;
	});
}

function scrollIntoViewWhenReady(target: Element, wasKeyboardVisible: boolean) {
	if (wasKeyboardVisible || !visualViewport) {
		// If the keyboard was already visible, scroll the target into view immediately.
		scrollIntoView(target);
	} else {
		// Otherwise, wait for the visual viewport to resize before scrolling so we can
		// measure the correct position to scroll to.
		visualViewport.addEventListener('resize', () => scrollIntoView(target), { once: true });
	}
}

function scrollIntoView(target: Element) {
	const root = document.scrollingElement || document.documentElement;
	let nextTarget: Element | null = target;
	while (nextTarget && nextTarget !== root) {
		// Find the parent scrollable element and adjust the scroll position if the target is not already in view.
		const scrollable = getScrollParent(nextTarget);
		if (scrollable !== document.documentElement && scrollable !== document.body && scrollable !== nextTarget) {
			const scrollableRect = scrollable.getBoundingClientRect();
			const targetRect = nextTarget.getBoundingClientRect();
			if (targetRect.top < scrollableRect.top || targetRect.bottom > scrollableRect.top + nextTarget.clientHeight) {
				let bottom = scrollableRect.bottom;
				if (visualViewport) {
					bottom = Math.min(bottom, visualViewport.offsetTop + visualViewport.height);
				}

				// Center within the viewport.
				const adjustment = targetRect.top - scrollableRect.top - ((bottom - scrollableRect.top) / 2 - targetRect.height / 2);
				scrollable.scrollTo({
					// Clamp to the valid range to prevent over-scrolling.
					top: Math.max(0, Math.min(scrollable.scrollHeight - scrollable.clientHeight, scrollable.scrollTop + adjustment)),
					behavior: 'smooth',
				});
			}
		}

		nextTarget = scrollable.parentElement;
	}
}

export function isInput(target: Element) {
	return (
		(target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type)) ||
		target instanceof HTMLTextAreaElement ||
		(target instanceof HTMLElement && target.isContentEditable)
	);
}
