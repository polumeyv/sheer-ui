import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Fixture from './popover-child-open.fixture.svelte';

// Same contract for the native popover lifecycle (shared by Popover, Tooltip and LinkPreview):
// the consumer owns `{#if open}`, so the element appears after the open flip and the lifecycle
// effect must call showPopover() on that late element; a UA-initiated close (toggle → closed)
// must flow back into `open`.

type Fixture = { setOpen: (value: boolean) => void };

const shown = new WeakSet<Element>();
const nativeMatches = Element.prototype.matches;

function render() {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(Fixture, { target }) as unknown as Fixture;
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
	Element.prototype.matches = function (selector: string) {
		if (selector === ':popover-open') return shown.has(this);
		return nativeMatches.call(this, selector);
	};
});

afterEach(() => {
	Element.prototype.matches = nativeMatches;
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

describe('Popover child snippet with a consumer-owned {#if open}', () => {
	test('showPopover runs on the late element; closing removes it', () => {
		const { component, setOpen, content } = render();
		expect(content()).toBeNull();

		setOpen(true);
		const el = content()!;
		expect(el).not.toBeNull();
		expect(el.showPopover).toHaveBeenCalledOnce();
		expect(el.getAttribute('popover')).not.toBeNull();

		setOpen(false);
		expect(content()).toBeNull();
		unmount(component as unknown as ReturnType<typeof mount>);
	});

	test('a UA close (toggle → closed) flows back into open so the block unmounts', () => {
		const { component, setOpen, content, readout } = render();
		setOpen(true);
		expect(readout()).toBe('open');

		content()!.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'closed', oldState: 'open' }));
		flushSync();
		expect(readout()).toBe('closed');
		expect(content()).toBeNull();
		unmount(component as unknown as ReturnType<typeof mount>);
	});
});
