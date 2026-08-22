import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Fixture from './dialog-child-open.fixture.svelte';
import { installNativeDialogPolyfill } from './native-dialog-polyfill.js';

// The bring-your-own-transition contract on the native modal surface: the consumer owns the
// `{#if open}` around the <dialog>, so the element appears after the open flip and leaves before
// the controller's settle-deferred close. The controller must still showModal() the late element,
// close() it on teardown (top layer + native focus restore), and native dismissal must flow back
// into `open` so the consumer's block unmounts. The polyfilled showModal/close are prototype-wide
// mocks, so their call counts span every <dialog> in the test.

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
		dialog: () => document.querySelector<HTMLDialogElement>('[data-testid="dialog"]'),
		readout: () => document.querySelector('[data-testid="open"]')!.textContent,
	};
}

beforeEach(installNativeDialogPolyfill);

afterEach(() => {
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

describe('Dialog child snippet with a consumer-owned {#if open}', () => {
	test('showModal runs on the late element; the block teardown closes it', () => {
		const { component, setOpen, dialog } = render();
		try {
			expect(dialog()).toBeNull();

			setOpen(true);
			const el = dialog()!;
			expect(el).not.toBeNull();
			expect(el.showModal).toHaveBeenCalledOnce();
			expect(el.open).toBe(true);
			expect(el.dataset.state).toBe('open');

			setOpen(false);
			expect(dialog()).toBeNull();
			expect(HTMLDialogElement.prototype.close).toHaveBeenCalledOnce();
			expect(el.open).toBe(false);

			setOpen(true);
			expect(dialog()!.showModal).toHaveBeenCalledTimes(2);
		} finally {
			unmount(component);
		}
	});

	test('native dismissal flows back into open so the block unmounts', () => {
		const { component, setOpen, dialog, readout } = render();
		try {
			setOpen(true);
			expect(readout()).toBe('open');

			dialog()!.dispatchEvent(new Event('close'));
			flushSync();
			expect(readout()).toBe('closed');
			expect(dialog()).toBeNull();
		} finally {
			unmount(component);
		}
	});
});
