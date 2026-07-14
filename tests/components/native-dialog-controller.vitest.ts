import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import NativeDialogControllerFixture from './native-dialog-controller.fixture.svelte';

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

describe('native dialog controller', () => {
	test('synchronizes declarative open state with showModal and close', () => {
		const { component, dialog } = render();
		open(component);
		expect(dialog.open).toBe(true);
		expect(dialog.showModal).toHaveBeenCalledOnce();

		component.setOpen(false);
		flushSync();
		expect(dialog.open).toBe(false);
		expect(dialog.close).toHaveBeenCalledOnce();
		unmount(component);
	});

	test.each(['pointerdown', 'click'] as const)('supports the %s backdrop policy', (outsideEvent) => {
		const { component, dialog } = render(outsideEvent);
		open(component);
		dialog.dispatchEvent(new PointerEvent(outsideEvent, { bubbles: true }));
		flushSync();
		expect(dialog.open).toBe(false);
		expect(component.getCloseCount()).toBe(1);
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
