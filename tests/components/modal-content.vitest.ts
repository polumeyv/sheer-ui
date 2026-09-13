import { flushSync, mount, unmount, type ComponentProps } from 'svelte';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import type ModalContentFixture from './modal-content.fixture.svelte';

let component: ReturnType<typeof mount> | undefined;

async function render(props: ComponentProps<typeof ModalContentFixture>) {
	const { default: Fixture } = await import('./modal-content.fixture.svelte');
	const target = document.createElement('div');
	document.body.append(target);
	const mounted = mount(Fixture, { target, props });
	component = mounted;
	flushSync();
	document.querySelector<HTMLButtonElement>('[data-testid="before"]')!.focus();
	mounted.setOpen(true);
	flushSync();
	return mounted;
}

beforeEach(() => {
	Object.defineProperty(window, 'matchMedia', {
		configurable: true,
		value: (query: string) => Object.assign(new EventTarget(), { matches: false, media: query, onchange: null }),
	});
	Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
		configurable: true,
		value: vi.fn(function (this: HTMLDialogElement) {
			this.open = true;
		}),
	});
	Object.defineProperty(HTMLDialogElement.prototype, 'close', {
		configurable: true,
		value: vi.fn(function (this: HTMLDialogElement) {
			this.open = false;
			this.dispatchEvent(new Event('close'));
		}),
	});
});

afterEach(async () => {
	if (component) await unmount(component);
	component = undefined;
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

test.each(['dialog', 'sheet'] as const)('%s preserves native dismissal vetoes, focus wrapping and scroll locking', async (variant) => {
	const onEscapeKeydown = vi.fn((event: KeyboardEvent) => event.preventDefault());
	const onInteractOutside = vi.fn((event: PointerEvent) => event.preventDefault());
	const fixture = await render({ variant, onEscapeKeydown, onInteractOutside });
	const dialog = document.querySelector('dialog')!;
	expect(dialog.open).toBe(true);
	await vi.waitFor(() => expect(document.body.style.overflow).toBe('hidden'));

	dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
	dialog.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
	flushSync();
	expect(onEscapeKeydown).toHaveBeenCalledOnce();
	expect(onInteractOutside).toHaveBeenCalledOnce();
	expect(dialog.open).toBe(true);

	const buttons = dialog.querySelectorAll<HTMLButtonElement>('button');
	buttons[buttons.length - 1]!.focus();
	const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
	dialog.dispatchEvent(tab);
	expect(tab.defaultPrevented).toBe(true);
	expect(document.activeElement).toBe(buttons[0]);

	fixture.setOpen(false);
	flushSync();
	await vi.waitFor(() => expect(dialog.open).toBe(false));
	await vi.waitFor(() => expect(document.body.style.overflow).not.toBe('hidden'));
});

test('drawer retains cancellable autofocus callbacks through its headless content', async () => {
	const onOpenAutoFocus = vi.fn((event: Event) => event.preventDefault());
	const onCloseAutoFocus = vi.fn((event: Event) => event.preventDefault());
	const fixture = await render({ variant: 'drawer', onOpenAutoFocus, onCloseAutoFocus });
	await vi.waitFor(() => expect(onOpenAutoFocus).toHaveBeenCalledOnce());
	expect(document.querySelector('dialog')).toBeNull();
	expect(document.querySelector('[data-slot="drawer-content"]')).not.toBeNull();
	expect(document.activeElement?.getAttribute('data-testid')).toBe('before');
	fixture.setOpen(false);
	flushSync();
	await vi.waitFor(() => expect(onCloseAutoFocus).toHaveBeenCalledOnce());
});
