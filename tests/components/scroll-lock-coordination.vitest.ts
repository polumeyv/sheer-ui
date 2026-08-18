import { flushSync } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { render } from '../harness.js';
import ScrollLockCoordinationFixture from './scroll-lock-coordination.fixture.svelte';

// Proves the fix for the scroll-lock unification: Drawer's usePreventScroll and Dialog/Sheet's
// BodyScrollLock now share the same lockMap, so one releasing while the other is still active
// doesn't prematurely unlock the body. Before this change, these were two fully independent
// systems that could each release the body scroll while the other still needed it locked.

function isBodyLocked() {
	return document.body.style.overflow === 'hidden';
}

afterEach(() => {
	document.body.removeAttribute('style');
	vi.useRealTimers();
});

describe('scroll-lock coordination (Drawer + Dialog-family)', () => {
	test('either lock alone locks the body', () => {
		const dialogOnly = render(ScrollLockCoordinationFixture, { dialogLocked: true });
		expect(isBodyLocked()).toBe(true);
		dialogOnly.unmount();
		document.body.removeAttribute('style');

		const drawerOnly = render(ScrollLockCoordinationFixture, { drawerEnabled: true });
		expect(isBodyLocked()).toBe(true);
		drawerOnly.unmount();
	});

	test('the drawer releasing does not unlock the body while the dialog-family lock is still active', () => {
		vi.useFakeTimers();
		const { component } = render(ScrollLockCoordinationFixture, { dialogLocked: true, drawerEnabled: true });
		expect(isBodyLocked()).toBe(true);

		// Drawer closes/disables its lock -- the shared lockMap still has the dialog's entry
		component.setDrawerEnabled(false);
		flushSync();
		vi.advanceTimersByTime(50); // past BodyScrollLock's cleanup-scheduling delay
		flushSync();

		expect(isBodyLocked()).toBe(true);
	});

	test('the body only unlocks once both the drawer and the dialog-family lock release', () => {
		vi.useFakeTimers();
		const { component } = render(ScrollLockCoordinationFixture, { dialogLocked: true, drawerEnabled: true });
		component.setDrawerEnabled(false);
		flushSync();
		vi.advanceTimersByTime(50);
		flushSync();
		expect(isBodyLocked()).toBe(true); // dialog still holds it

		component.setDialogLocked(false);
		flushSync();
		vi.advanceTimersByTime(50);
		flushSync();
		expect(isBodyLocked()).toBe(false); // last lock released
	});
});
