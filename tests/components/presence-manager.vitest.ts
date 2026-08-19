import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import PresenceManagerFixture from './presence-manager.fixture.svelte';

function render(props: { open?: boolean; enabled?: boolean; skipExit?: boolean } = {}) {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(PresenceManagerFixture, { props, target });
	flushSync();
	return component;
}

function read(testid: string): string | null {
	const node = document.body.querySelector(`[data-testid="${testid}"]`);
	if (!node) throw new Error(`missing testid: ${testid}`);
	return node.textContent;
}
const rendered = () => read('render');
const status = () => read('status');
const complete = () => read('complete');

afterEach(() => {
	vi.useRealTimers();
	document.body.innerHTML = '';
});

describe('PresenceManager', () => {
	test('mount does not transition (hasMounted guard)', () => {
		const c = render({ open: true });
		try {
			expect(rendered()).toBe('true');
			expect(status()).toBe('none');
		} finally {
			unmount(c);
		}
	});

	test('open: enters "starting", then the RAF clears it while still open', () => {
		vi.useFakeTimers();
		const c = render({ open: false });
		try {
			expect(rendered()).toBe('false');

			c.setOpen(true);
			flushSync();
			expect(rendered()).toBe('true');
			expect(status()).toBe('starting');

			vi.advanceTimersByTime(16); // fire the queued requestAnimationFrame
			flushSync();
			expect(status()).toBe('none');
		} finally {
			unmount(c);
		}
	});

	test('close: enters "ending", stays rendered until animations finish, then unmounts + onComplete', () => {
		const c = render({ open: true });
		try {
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
		} finally {
			unmount(c);
		}
	});

	test('shouldSkipExitAnimation: tears down immediately, no animation wait', () => {
		const c = render({ open: true, skipExit: true });
		try {
			c.setOpen(false);
			flushSync();
			expect(rendered()).toBe('false');
			expect(status()).toBe('none');
			expect(complete()).toBe('1');
			expect(c.pendingCount()).toBe(0); // never scheduled an animation wait
		} finally {
			unmount(c);
		}
	});

	test('shouldSkipExitAnimation: a pending open completion is cancelled, not fired late', () => {
		const c = render({ open: false, skipExit: true });
		try {
			c.setOpen(true);
			flushSync();
			expect(c.pendingCount()).toBe(1); // open completion queued on the runner

			c.setOpen(false); // skip-exit path: no run(), but must cancel the queued open
			flushSync();
			expect(rendered()).toBe('false');
			expect(complete()).toBe('1');

			c.firePending(0); // the stale open completion
			flushSync();
			expect(complete()).toBe('1'); // not counted twice
		} finally {
			unmount(c);
		}
	});

	test('enabled=false: closes without waiting for animations', () => {
		const c = render({ open: true, enabled: false });
		try {
			c.setOpen(false);
			flushSync();
			expect(rendered()).toBe('false');
			expect(status()).toBe('none');
			expect(complete()).toBe('1');
			expect(c.pendingCount()).toBe(0);
		} finally {
			unmount(c);
		}
	});

	test('reopen before exit completes: the stale completion is superseded by the runner', () => {
		const c = render({ open: true });
		try {
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
			expect(rendered()).toBe('true'); // superseded — not torn down
			expect(complete()).toBe('0');
		} finally {
			unmount(c);
		}
	});
});
