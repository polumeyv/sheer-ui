import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// isIOS is a module-level const computed from navigator.userAgent at import time (not a function),
// so the only reliable way to force the iOS branch in a test is to replace the whole module —
// vi.mock calls are hoisted above imports, which sidesteps import-order/caching issues.
// (isWebKit needs no forcing: jsdom's default UA carries AppleWebKit.)
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
// preventScrollMobileWebKit (Drawer-specific), one from BodyScrollLock's own, simpler iOS
// touchmove guard (shared with Dialog/Sheet/Select/Popover). touchstart and blur are
// preventScrollMobileWebKit-only.
const SOLO_IOS_EVENTS = ['touchstart', 'blur'] as const;

function documentCalls(spy: ReturnType<typeof vi.spyOn>, type: string) {
	return spy.mock.calls.filter((call) => call[0] === type);
}

beforeEach(() => {
	// BodyScrollLock's own release schedules resetBodyStyle via a real setTimeout
	// (scheduleCleanupIfNoNewLocks, default 24ms) — fake timers make that deterministic instead of
	// leaking a still-pending cleanup (and a stale stopTouchMoveListener reference) into the next test.
	vi.useFakeTimers();
});

afterEach(async () => {
	// flush SharedState's microtask-deferred release from any unmount above so the focus-prototype
	// patch and injected style never leak into the next test
	await Promise.resolve();
	vi.advanceTimersByTime(50);
	document.body.innerHTML = '';
	vi.useRealTimers();
	vi.restoreAllMocks();
});

describe('usePreventScroll (iOS)', () => {
	test('a single active consumer attaches the iOS touch/scroll workaround exactly once', () => {
		const addDocSpy = vi.spyOn(document, 'addEventListener');
		const { component } = render();

		try {
			for (const type of SOLO_IOS_EVENTS) {
				expect(documentCalls(addDocSpy, type)).toHaveLength(1);
			}
			expect(documentCalls(addDocSpy, 'touchmove')).toHaveLength(2);
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

	test('the workaround tears down only after the last active consumer disables/unmounts, not before', async () => {
		const addDocSpy = vi.spyOn(document, 'addEventListener');
		const removeDocSpy = vi.spyOn(document, 'removeEventListener');
		const nativeFocus = HTMLElement.prototype.focus;
		const first = render();
		const second = render();

		try {
			expect(documentCalls(addDocSpy, 'touchstart')).toHaveLength(1);

			// preventScrollMobileWebKit's listeners ride the shared root effect's AbortSignal —
			// teardown is that signal aborting, so collect the signals its registrations carried:
			// touchstart + blur + its one touchmove (BodyScrollLock's touchmove guard carries no
			// signal, it has a mid-life manual disposer).
			const signals = [...SOLO_IOS_EVENTS.flatMap((type) => documentCalls(addDocSpy, type)), ...documentCalls(addDocSpy, 'touchmove')]
				.map((call) => (call[2] as AddEventListenerOptions | undefined)?.signal)
				.filter((signal): signal is AbortSignal => signal instanceof AbortSignal);
			expect(signals).toHaveLength(3);

			// while attached, programmatic focus is patched and the overscroll-behavior style is injected
			const hasOverscrollStyle = () =>
				[...document.head.querySelectorAll('style')].some((s) => s.textContent?.includes('overscroll-behavior: contain'));
			expect(HTMLElement.prototype.focus).not.toBe(nativeFocus);
			expect(hasOverscrollStyle()).toBe(true);

			// first consumer becomes disabled — second is still active, must stay attached
			first.component.setDisabled(true);
			flushSync();
			await Promise.resolve(); // let SharedState's deferred release run
			vi.advanceTimersByTime(30); // let BodyScrollLock's delayed cleanup have its chance
			flushSync();
			expect(signals.some((signal) => signal.aborted)).toBe(false);
			expect(documentCalls(removeDocSpy, 'touchmove')).toHaveLength(0);

			// now the last active consumer disables too — the shared workaround must tear down, exactly once
			second.component.setDisabled(true);
			flushSync();
			await Promise.resolve(); // teardown is microtask-deferred by SharedState
			vi.advanceTimersByTime(30);
			flushSync();
			expect(signals.every((signal) => signal.aborted)).toBe(true);
			// teardown must also undo the two non-listener pieces of the workaround
			expect(HTMLElement.prototype.focus).toBe(nativeFocus);
			expect(hasOverscrollStyle()).toBe(false);
			// BodyScrollLock has two independent teardown paths that can both call
			// stopTouchMoveListener (the SharedState root's own disposal, and the domain-level
			// "no locks left" scheduled reset) — both null the reference after calling it, so
			// only the one that fires first actually calls removeEventListener: 1 total
			// (preventScrollMobileWebKit's own touchmove now detaches via its signal instead).
			expect(documentCalls(removeDocSpy, 'touchmove')).toHaveLength(1);
		} finally {
			unmount(first.component);
			unmount(second.component);
		}
	});
});
