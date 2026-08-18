import { flushSync } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, text } from '../harness.js';
import PresenceManagerFixture from './presence-manager.fixture.svelte';

const rendered = () => text('render');
const status = () => text('status');
const complete = () => text('complete');

afterEach(() => {
	vi.useRealTimers();
});

describe('PresenceManager', () => {
	test('mount does not transition (hasMounted guard)', () => {
		render(PresenceManagerFixture, { open: true });
		expect(rendered()).toBe('true');
		expect(status()).toBe('none');
	});

	test('open: enters "starting", then the RAF clears it while still open', () => {
		vi.useFakeTimers();
		const { component: c } = render(PresenceManagerFixture, { open: false });
		expect(rendered()).toBe('false');

		c.setOpen(true);
		flushSync();
		expect(rendered()).toBe('true');
		expect(status()).toBe('starting');

		vi.advanceTimersByTime(16); // fire the queued requestAnimationFrame
		flushSync();
		expect(status()).toBe('none');
	});

	test('close: enters "ending", stays rendered until animations finish, then unmounts + onComplete', () => {
		const { component: c } = render(PresenceManagerFixture, { open: true });
		c.setOpen(false);
		flushSync();
		expect(status()).toBe('ending');
		expect(rendered()).toBe('true'); // still present during the exit animation
		expect(c.pendingCount()).toBe(1);
		expect(complete()).toBe('0');

		c.firePending(); // exit animations complete
		flushSync();
		expect(rendered()).toBe('false');
		expect(status()).toBe('none');
		expect(complete()).toBe('1');
	});

	test('shouldSkipExitAnimation: tears down immediately, no animation wait', () => {
		const { component: c } = render(PresenceManagerFixture, { open: true, skipExit: true });
		c.setOpen(false);
		flushSync();
		expect(rendered()).toBe('false');
		expect(status()).toBe('none');
		expect(complete()).toBe('1');
		expect(c.pendingCount()).toBe(0); // never scheduled an animation wait
	});

	test('enabled=false: closes without waiting for animations', () => {
		const { component: c } = render(PresenceManagerFixture, { open: true, enabled: false });
		c.setOpen(false);
		flushSync();
		expect(rendered()).toBe('false');
		expect(status()).toBe('none');
		expect(complete()).toBe('1');
		expect(c.pendingCount()).toBe(0);
	});

	test('reopen before exit completes: a stale completion is ignored (re-check guard)', () => {
		const { component: c } = render(PresenceManagerFixture, { open: true });
		c.setOpen(false);
		flushSync();
		expect(status()).toBe('ending');
		expect(c.pendingCount()).toBe(1); // stale "close" callback queued

		c.setOpen(true);
		flushSync();
		expect(rendered()).toBe('true');
		expect(c.pendingCount()).toBe(2); // "open" callback now also queued

		c.firePending(0); // fire the STALE close callback
		flushSync();
		expect(rendered()).toBe('true'); // guard held — not torn down
		expect(complete()).toBe('0');
	});
});
