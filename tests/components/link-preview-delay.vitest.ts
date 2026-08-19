import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import LinkPreviewDelayFixture from './link-preview-delay.fixture.svelte';

function render(props: { openDelay?: number; closeDelay?: number } = {}) {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(LinkPreviewDelayFixture, { props, target });
	flushSync();
	return component;
}

function readOpen() {
	const node = document.body.querySelector('[data-testid="open"]');
	if (!node) throw new Error('Expected open readout to render');
	return node.textContent;
}

function getTrigger() {
	const node = document.body.querySelector<HTMLElement>('[data-testid="trigger"]');
	if (!node) throw new Error('Expected trigger to render');
	return node;
}

// jsdom has no PointerEvent; the handlers only read pointerType.
function pointerEnter() {
	const event = new MouseEvent('pointerenter', { bubbles: true, cancelable: true });
	Object.defineProperty(event, 'pointerType', { configurable: true, value: 'mouse' });
	getTrigger().dispatchEvent(event);
	flushSync();
}

function blurTrigger() {
	getTrigger().dispatchEvent(new FocusEvent('blur'));
	flushSync();
}

function advance(ms: number) {
	vi.advanceTimersByTime(ms);
	flushSync();
}

afterEach(() => {
	vi.useRealTimers();
	document.body.innerHTML = '';
});

describe('LinkPreview delays', () => {
	test('hover opens only after openDelay', () => {
		vi.useFakeTimers();
		const c = render({ openDelay: 200 });
		try {
			pointerEnter();
			advance(199);
			expect(readOpen()).toBe('closed');

			advance(1);
			expect(readOpen()).toBe('open');
		} finally {
			unmount(c);
		}
	});

	test('blur closes only after closeDelay', () => {
		vi.useFakeTimers();
		const c = render({ openDelay: 0, closeDelay: 200 });
		try {
			pointerEnter();
			advance(0);
			expect(readOpen()).toBe('open');

			blurTrigger();
			advance(199);
			expect(readOpen()).toBe('open');

			advance(1);
			expect(readOpen()).toBe('closed');
		} finally {
			unmount(c);
		}
	});

	test('re-hovering before openDelay elapses restarts the open timer', () => {
		vi.useFakeTimers();
		const c = render({ openDelay: 200 });
		try {
			pointerEnter();
			advance(150);
			pointerEnter();

			advance(50); // the first timer's deadline
			expect(readOpen()).toBe('closed');

			advance(150);
			expect(readOpen()).toBe('open');
		} finally {
			unmount(c);
		}
	});
});
