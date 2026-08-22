import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import NativeDialogControllerFixture from './native-dialog-controller.fixture.svelte';
import { installNativeDialogPolyfill } from './native-dialog-polyfill.js';

type Fixture = ReturnType<typeof render>['component'];

function render(outsideEvent: 'pointerdown' | 'click' = 'pointerdown') {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(NativeDialogControllerFixture, { props: { outsideEvent }, target });
	flushSync();
	const dialog = target.querySelector<HTMLDialogElement>('[data-testid="dialog"]')!;
	return { component, dialog, target };
}

const open = (component: Fixture) => {
	component.setOpen(true);
	flushSync();
};

beforeEach(() => {
	if (!globalThis.PointerEvent) Object.defineProperty(globalThis, 'PointerEvent', { configurable: true, value: MouseEvent });
	installNativeDialogPolyfill();
});

afterEach(() => {
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

describe('native dialog controller', () => {
	test('synchronizes declarative open state with showModal and a settle-deferred close', async () => {
		const { component, dialog } = render();
		open(component);
		expect(dialog.open).toBe(true);
		expect(dialog.showModal).toHaveBeenCalledOnce();

		component.setOpen(false);
		flushSync();
		// close() waits for the data-[state=closed] exit animation to settle — the dialog must
		// stay open this frame so the exit can render at all
		expect(dialog.open).toBe(true);
		await vi.waitFor(() => expect(dialog.open).toBe(false));
		expect(dialog.close).toHaveBeenCalledOnce();
		unmount(component);
	});

	test('reopening before the exit settles supersedes the pending native close', async () => {
		const { component, dialog } = render();
		open(component);

		component.setOpen(false);
		flushSync();
		component.setOpen(true);
		flushSync();

		await new Promise(requestAnimationFrame);
		await new Promise(requestAnimationFrame);
		expect(dialog.open).toBe(true);
		expect(dialog.close).not.toHaveBeenCalled();
		unmount(component);
	});

	test.each(['pointerdown', 'click'] as const)('supports the %s backdrop policy', async (outsideEvent) => {
		const { component, dialog } = render(outsideEvent);
		open(component);
		dialog.dispatchEvent(new PointerEvent(outsideEvent, { bubbles: true }));
		flushSync();
		// dismissal routes through state immediately; the native close follows after settle
		expect(component.getCloseCount()).toBe(1);
		await vi.waitFor(() => expect(dialog.open).toBe(false));
		unmount(component);
	});

	test('a permitted cancel suppresses the native instant close and closes through state', async () => {
		const { component, dialog } = render();
		open(component);
		const cancel = new Event('cancel', { cancelable: true });
		dialog.dispatchEvent(cancel);
		// always prevented: Escape must never native-close before the exit animation runs
		expect(cancel.defaultPrevented).toBe(true);
		flushSync();
		expect(component.getCloseCount()).toBe(1);
		await vi.waitFor(() => expect(dialog.open).toBe(false));
		unmount(component);
	});

	test('preserves callback vetoes and ignore policies', () => {
		const { component, dialog } = render();
		open(component);
		component.setVetoOutside(true);
		dialog.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
		expect(dialog.open).toBe(true);

		component.setVetoOutside(false);
		component.setIgnoreOutside(true);
		dialog.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
		expect(dialog.open).toBe(true);

		component.setVetoEscape(true);
		const vetoed = new Event('cancel', { cancelable: true });
		dialog.dispatchEvent(vetoed);
		expect(vetoed.defaultPrevented).toBe(true);

		component.setVetoEscape(false);
		component.setIgnoreEscape(true);
		const ignored = new Event('cancel', { cancelable: true });
		dialog.dispatchEvent(ignored);
		expect(ignored.defaultPrevented).toBe(true);
		unmount(component);
	});

	test('wraps sequential focus only while trapping is enabled', () => {
		const { component, dialog, target } = render();
		open(component);
		const first = target.querySelector<HTMLButtonElement>('[data-testid="first"]')!;
		const last = target.querySelector<HTMLButtonElement>('[data-testid="last"]')!;

		last.focus();
		const forward = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
		dialog.dispatchEvent(forward);
		expect(forward.defaultPrevented).toBe(true);
		expect(document.activeElement).toBe(first);

		component.setTrapFocus(false);
		last.focus();
		const untrapped = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
		dialog.dispatchEvent(untrapped);
		expect(untrapped.defaultPrevented).toBe(false);
		expect(document.activeElement).toBe(last);
		unmount(component);
	});

	test('removes event listeners when the attachment is destroyed', () => {
		const { component, dialog } = render();
		open(component);
		unmount(component);
		dialog.dispatchEvent(new Event('close'));
		expect(component.getCloseCount()).toBe(0);
	});
});
