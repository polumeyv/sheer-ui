import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// isIOS is a module-level const computed from navigator.userAgent at import time (not a function),
// so the only reliable way to force the iOS branch in a test is to replace the whole module —
// vi.mock calls are hoisted above imports, which sidesteps import-order/caching issues.
vi.mock('@polumeyv/utilities/dom', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@polumeyv/utilities/dom')>();
	return { ...actual, isIOS: true };
});

const { default: UsePreventScrollIosFixture } = await import('./use-prevent-scroll-ios.fixture.svelte');

function render(props: { disabled?: boolean } = {}) {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(UsePreventScrollIosFixture, { props, target });
	flushSync();
	return { component, target };
}

// touchmove gets TWO listeners once BodyScrollLock is in the mix: one from
// preventScrollMobileSafari (Drawer-specific), one from BodyScrollLock's own, simpler iOS
// touchmove guard (shared with Dialog/Sheet/Select/Popover). The other three are
// preventScrollMobileSafari-only.
const SOLO_IOS_TOUCH_EVENTS = ['touchstart', 'touchend', 'focus'] as const;

function documentCalls(spy: ReturnType<typeof vi.spyOn>, type: string) {
	return spy.mock.calls.filter((call) => call[0] === type);
}

beforeEach(() => {
	// jsdom doesn't implement scrollTo; preventScrollMobileSafari calls it on setup/teardown.
	vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
	// BodyScrollLock's own release schedules resetBodyStyle via a real setTimeout
	// (scheduleCleanupIfNoNewLocks, default 24ms) — fake timers make that deterministic instead of
	// leaking a still-pending cleanup (and a stale stopTouchMoveListener reference) into the next test.
	vi.useFakeTimers();
});

afterEach(() => {
	vi.advanceTimersByTime(50);
	document.body.innerHTML = '';
	vi.useRealTimers();
	vi.restoreAllMocks();
});

describe('usePreventScroll (iOS)', () => {
	test('a single active consumer attaches the iOS touch/scroll workaround exactly once', () => {
		const addDocSpy = vi.spyOn(document, 'addEventListener');
		const addWinSpy = vi.spyOn(window, 'addEventListener');
		const { component } = render();

		try {
			for (const type of SOLO_IOS_TOUCH_EVENTS) {
				expect(documentCalls(addDocSpy, type)).toHaveLength(1);
			}
			expect(documentCalls(addDocSpy, 'touchmove')).toHaveLength(2);
			expect(documentCalls(addWinSpy, 'scroll')).toHaveLength(1);
		} finally {
			unmount(component);
		}
	});

	test('a second concurrently-active consumer shares the workaround instead of re-attaching it', () => {
		const addDocSpy = vi.spyOn(document, 'addEventListener');
		const first = render();

		try {
			expect(documentCalls(addDocSpy, 'touchstart')).toHaveLength(1);

			const second = render();
			try {
				// still exactly one/two attachment(s) — the second consumer reused the shared subscriptions
				expect(documentCalls(addDocSpy, 'touchstart')).toHaveLength(1);
				expect(documentCalls(addDocSpy, 'touchmove')).toHaveLength(2);
			} finally {
				unmount(second.component);
			}
		} finally {
			unmount(first.component);
		}
	});

	test('the workaround tears down only after the last active consumer disables/unmounts, not before', () => {
		const addDocSpy = vi.spyOn(document, 'addEventListener');
		const removeDocSpy = vi.spyOn(document, 'removeEventListener');
		const removeWinSpy = vi.spyOn(window, 'removeEventListener');
		const first = render();
		const second = render();

		try {
			expect(documentCalls(addDocSpy, 'touchstart')).toHaveLength(1);

			// first consumer becomes disabled — second is still active, must stay attached
			first.component.setDisabled(true);
			flushSync();
			vi.advanceTimersByTime(30); // let BodyScrollLock's delayed cleanup have its chance
			flushSync();
			for (const type of SOLO_IOS_TOUCH_EVENTS) {
				expect(documentCalls(removeDocSpy, type)).toHaveLength(0);
			}
			expect(documentCalls(removeDocSpy, 'touchmove')).toHaveLength(0);
			expect(documentCalls(removeWinSpy, 'scroll')).toHaveLength(0);

			// now the last active consumer disables too — the shared workaround must tear down, exactly once
			second.component.setDisabled(true);
			flushSync();
			vi.advanceTimersByTime(30);
			flushSync();
			for (const type of SOLO_IOS_TOUCH_EVENTS) {
				expect(documentCalls(removeDocSpy, type)).toHaveLength(1);
			}
			// BodyScrollLock has two independent teardown paths that can both call
			// stopTouchMoveListener (the SharedState root's own disposal, and the domain-level
			// "no locks left" scheduled reset) — both null the reference after calling it, so
			// only the one that fires first actually removes the listener. Combined with
			// preventScrollMobileSafari's own removal, that's 2 total, not 3.
			expect(documentCalls(removeDocSpy, 'touchmove')).toHaveLength(2);
			expect(documentCalls(removeWinSpy, 'scroll')).toHaveLength(1);
		} finally {
			unmount(first.component);
			unmount(second.component);
		}
	});
});
