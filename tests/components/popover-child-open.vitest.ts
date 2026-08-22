import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Fixture from './popover-child-open.fixture.svelte';

// Same contract for the native popover lifecycle: the consumer owns `{#if open}`, so the element
// appears after the open flip and the lifecycle effect must call showPopover() on that late
// element. That half is shared by Popover, Tooltip and LinkPreview. The second test covers the
// `toggle → closed` sync, which only Popover's `mode: 'auto'` uses; Tooltip and LinkPreview run the
// manual-mode dismissal (document keydown / pointerdown) that is not exercised here.

const shown = new WeakSet<Element>();
const nativeMatches = Element.prototype.matches;

function render() {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(Fixture, { target });
	flushSync();
	const setOpen = (value: boolean) => {
		component.setOpen(value);
		flushSync();
	};
	return {
		component,
		setOpen,
		content: () => document.querySelector<HTMLElement>('[data-testid="content"]'),
		readout: () => document.querySelector('[data-testid="open"]')!.textContent,
	};
}

beforeEach(() => {
	Object.defineProperty(HTMLElement.prototype, 'showPopover', {
		configurable: true,
		value: vi.fn(function (this: HTMLElement) {
			shown.add(this);
		}),
	});
	Object.defineProperty(HTMLElement.prototype, 'hidePopover', {
		configurable: true,
		value: vi.fn(function (this: HTMLElement) {
			shown.delete(this);
		}),
	});
	Element.prototype.matches = function (this: Element, selector: string) {
		if (selector === ':popover-open') return shown.has(this);
		return nativeMatches.call(this, selector);
	} as typeof nativeMatches;
});

afterEach(() => {
	Element.prototype.matches = nativeMatches;
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

describe('Popover child snippet with a consumer-owned {#if open}', () => {
	test('showPopover runs on each late element; closing removes it', () => {
		const { component, setOpen, content } = render();
		try {
			expect(content()).toBeNull();

			setOpen(true);
			const first = content()!;
			expect(first).not.toBeNull();
			expect(first.getAttribute('popover')).not.toBeNull();
			expect(vi.mocked(first.showPopover).mock.contexts).toEqual([first]);

			setOpen(false);
			expect(content()).toBeNull();

			setOpen(true);
			const second = content()!;
			expect(second).not.toBe(first);
			expect(vi.mocked(second.showPopover).mock.contexts).toEqual([first, second]);
		} finally {
			unmount(component);
		}
	});

	test('a UA close (toggle → closed) flows back into open so the block unmounts', () => {
		const { component, setOpen, content, readout } = render();
		try {
			setOpen(true);
			expect(readout()).toBe('open');

			content()!.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'closed', oldState: 'open' }));
			flushSync();
			expect(readout()).toBe('closed');
			expect(content()).toBeNull();
		} finally {
			unmount(component);
		}
	});
});
