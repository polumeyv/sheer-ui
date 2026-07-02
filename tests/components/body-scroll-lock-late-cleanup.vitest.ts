import { flushSync, mount, tick, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import ScrollLock from '../../src/lib/components/utilities/scroll-lock/scroll-lock.svelte';

afterEach(() => {
	vi.unstubAllGlobals();
	vi.useRealTimers();
	document.body.innerHTML = '';
	document.body.removeAttribute('style');
});

describe('BodyScrollLock delayed cleanup', () => {
	test('does not depend on global document after unmount', async () => {
		vi.useFakeTimers();
		const originalDocument = document;
		const target = originalDocument.createElement('div');
		originalDocument.body.append(target);
		const component = mount(ScrollLock, { target });
		flushSync();

		unmount(component);
		vi.stubGlobal('document', undefined);

		await tick();
		expect(() => vi.advanceTimersByTime(30)).not.toThrow();

		vi.unstubAllGlobals();
		expect(originalDocument.body.style.overflow).toBe('');
	});
});
