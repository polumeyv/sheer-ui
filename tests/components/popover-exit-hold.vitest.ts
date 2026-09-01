import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import PopoverFixture from './popover-exit-hold.fixture.svelte';

// jsdom has no popover API; stub just enough of it that useNativePopoverLifecycle runs:
// showPopover/hidePopover track an `__open` flag, matches(':popover-open') reads it, and
// getAnimations returns [] so animationsSettled resolves after its frame waits.
let rafQueue: FrameRequestCallback[] = [];
const flushRaf = async (passes = 4) => {
	for (let i = 0; i < passes; i++) {
		const queue = rafQueue;
		rafQueue = [];
		for (const cb of queue) cb(performance.now());
		await Promise.resolve();
		await Promise.resolve();
	}
};

beforeEach(() => {
	rafQueue = [];
	vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => (rafQueue.push(cb), rafQueue.length));
	vi.stubGlobal('cancelAnimationFrame', () => {});
	Object.defineProperty(HTMLElement.prototype, 'showPopover', {
		configurable: true,
		value: vi.fn(function (this: HTMLElement) {
			(this as unknown as { __open: boolean }).__open = true;
		}),
	});
	Object.defineProperty(HTMLElement.prototype, 'hidePopover', {
		configurable: true,
		value: vi.fn(function (this: HTMLElement) {
			(this as unknown as { __open: boolean }).__open = false;
		}),
	});
	Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
		configurable: true,
		value: () => [],
	});
	const nativeMatches = Element.prototype.matches;
	vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, sel: string) {
		if (sel === ':popover-open') return (this as unknown as { __open?: boolean }).__open === true;
		return nativeMatches.call(this, sel);
	});
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	delete (HTMLElement.prototype as Partial<HTMLElement>).showPopover;
	delete (HTMLElement.prototype as Partial<HTMLElement>).hidePopover;
	delete (HTMLElement.prototype as Partial<HTMLElement>).getAnimations;
	document.body.innerHTML = '';
});

const content = () => {
	const el = document.querySelector<HTMLElement>('[data-slot="popover-content"]');
	if (!el) throw new Error('no popover content');
	return el;
};

const render = () => {
	const target = document.createElement('div');
	document.body.append(target);
	return mount(PopoverFixture, { target });
};

describe('native popover exit hold', () => {
	test('open shows the popover; close defers hidePopover until the exit settles', async () => {
		const component = render();
		try {
			component.setOpen(true);
			flushSync();
			await flushRaf();
			const el = content();
			expect(el.showPopover).toHaveBeenCalledTimes(1);
			expect(el.dataset.state).toBe('open');

			component.setOpen(false);
			flushSync();
			// still shown: the [data-state=closed] exit owns this window
			expect(el.dataset.state).toBe('closed');
			expect(el.hidePopover).not.toHaveBeenCalled();
			expect(el.matches(':popover-open')).toBe(true);

			await flushRaf();
			expect(el.hidePopover).toHaveBeenCalledTimes(1);
			expect(el.matches(':popover-open')).toBe(false);
		} finally {
			unmount(component);
		}
	});

	test('a reopen mid-exit supersedes the pending hide', async () => {
		const component = render();
		try {
			component.setOpen(true);
			flushSync();
			await flushRaf();
			const el = content();

			component.setOpen(false);
			flushSync();
			component.setOpen(true);
			flushSync();
			await flushRaf();

			expect(el.hidePopover).not.toHaveBeenCalled();
			expect(el.matches(':popover-open')).toBe(true);
			expect(el.dataset.state).toBe('open');
		} finally {
			unmount(component);
		}
	});

	test('a UA-hidden popover (light dismiss) is not re-hidden', async () => {
		const component = render();
		try {
			component.setOpen(true);
			flushSync();
			await flushRaf();
			const el = content();

			// the UA hides it out from under the state (light dismiss), then state catches up
			(el as unknown as { __open: boolean }).__open = false;
			component.setOpen(false);
			flushSync();
			await flushRaf();

			expect(el.hidePopover).not.toHaveBeenCalled();
		} finally {
			unmount(component);
		}
	});
});
