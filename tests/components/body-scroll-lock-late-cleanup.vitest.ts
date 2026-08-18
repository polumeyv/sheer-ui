import { tick } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { render } from '../harness.js';
import ScrollLockFixture from './body-scroll-lock-late-cleanup.fixture.svelte';

afterEach(() => {
	vi.unstubAllGlobals();
	vi.useRealTimers();
	document.body.removeAttribute('style');
});

describe('BodyScrollLock delayed cleanup', () => {
	test('does not depend on global document after unmount', async () => {
		vi.useFakeTimers();
		const originalDocument = document;
		const { unmount } = render(ScrollLockFixture);

		unmount();
		vi.stubGlobal('document', undefined);

		await tick();
		expect(() => vi.advanceTimersByTime(30)).not.toThrow();

		vi.unstubAllGlobals();
		expect(originalDocument.body.style.overflow).toBe('');
	});
});
