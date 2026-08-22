import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Fixture from './dialog-child-open.fixture.svelte';

// The bring-your-own-transition contract on the native modal surface: the consumer owns the
// `{#if open}` around the <dialog>, so the element appears after the open flip. The controller
// attachment must still call showModal() on that late element, and native dismissal must flow
// back into `open` so the consumer's block unmounts.

type Fixture = { setOpen: (value: boolean) => void };

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
		dialog: () => document.querySelector<HTMLDialogElement>('[data-testid="dialog"]'),
		readout: () => document.querySelector('[data-testid="open"]')!.textContent,
	};
}

beforeEach(() => {
	Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
		configurable: true,
		value: vi.fn(function (this: HTMLDialogElement) {
			this.open = true;
		}),
	});
	Object.defineProperty(HTMLDialogElement.prototype, 'close', {
		configurable: true,
		value: vi.fn(function (this: HTMLDialogElement) {
			if (!this.open) return;
			this.open = false;
			this.dispatchEvent(new Event('close'));
		}),
	});
});

afterEach(() => {
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

describe('Dialog child snippet with a consumer-owned {#if open}', () => {
	test('showModal runs on the late element; closing removes it', () => {
		const { component, setOpen, dialog } = render();
		expect(dialog()).toBeNull();

		setOpen(true);
		const el = dialog()!;
		expect(el).not.toBeNull();
		expect(el.showModal).toHaveBeenCalledOnce();
		expect(el.open).toBe(true);
		expect(el.dataset.state).toBe('open');

		setOpen(false);
		expect(dialog()).toBeNull();

		setOpen(true);
		expect(dialog()!.showModal).toHaveBeenCalledTimes(2);
		unmount(component as unknown as ReturnType<typeof mount>);
	});

	test('native dismissal flows back into open so the block unmounts', () => {
		const { component, setOpen, dialog, readout } = render();
		setOpen(true);
		expect(readout()).toBe('open');

		dialog()!.dispatchEvent(new Event('close'));
		flushSync();
		expect(readout()).toBe('closed');
		expect(dialog()).toBeNull();
		unmount(component as unknown as ReturnType<typeof mount>);
	});
});
