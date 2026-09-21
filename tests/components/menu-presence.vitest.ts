import { flushSync, tick } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import { mountInBody } from '../mount';
import MenuPresenceFixture from './menu-presence.fixture.svelte';
import MenuPresenceMenubarFixture from './menu-presence-menubar.fixture.svelte';

// Menu content stays mounted through its exit: the closed state is inline (visibility for
// floating content, display for static), the exit motion is CSS, and completion is settle-based.

function render(props: { isStatic?: boolean; onOpenChangeComplete?: (open: boolean) => void } = {}) {
	return mountInBody(MenuPresenceFixture, props).component;
}

function byTestId(id: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`);
	if (!node) throw new Error(`missing testid: ${id}`);
	return node;
}

// jsdom has no getAnimations; a settleable fake stands in for the exit transition.
function fakeExit(node: HTMLElement) {
	let settle: () => void = () => {};
	const finished = new Promise<void>((resolve) => (settle = resolve));
	const animation = { effect: { getComputedTiming: () => ({ iterations: 1 }) }, playState: 'running', pending: false, finished };
	node.getAnimations = () => [animation as unknown as Animation];
	return { settle, stop: () => (node.getAnimations = () => []) };
}

const frames = async (count = 3) => {
	for (let i = 0; i < count; i++) await new Promise(requestAnimationFrame);
};

const arrowDown = (node: HTMLElement) => node.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));

describe('menu presence', () => {
	test('closed floating content is mounted and visibility:hidden; opening clears it', () => {
		const c = render();
		const content = byTestId('content');
		expect(content.dataset.state).toBe('closed');
		expect(content.style.visibility).toBe('hidden');
		expect(content.style.display).toBe('');

		c.setOpen(true);
		flushSync();
		expect(content.dataset.state).toBe('open');
		expect(content.style.visibility).toBe('');
	});

	test('closed static content is display:none (it must leave the flow)', () => {
		const c = render({ isStatic: true });
		expect(byTestId('content').style.display).toBe('none');
		c.setOpen(true);
		flushSync();
		expect(byTestId('content').style.display).toBe('');
	});

	test('items of a closed sub-content are not arrow-key candidates of the parent', () => {
		const c = render();
		c.setOpen(true);
		flushSync();
		expect(byTestId('sub-content').dataset.state).toBe('closed'); // mounted, hidden
		byTestId('sub-trigger').focus();
		arrowDown(byTestId('sub-trigger'));
		expect(document.activeElement).toBe(byTestId('item-2'));
	});

	test('close: completes after the exit settles, and the page stays locked until then', async () => {
		const onOpenChangeComplete = vi.fn();
		const c = render({ onOpenChangeComplete });
		c.setOpen(true);
		flushSync();
		await tick(); // the scroll lock applies its body styles a tick after opening
		expect(document.body.style.pointerEvents).toBe('none');

		const exit = fakeExit(byTestId('content'));
		c.setOpen(false);
		flushSync();
		expect(byTestId('content').dataset.state).toBe('closed');
		await frames();
		expect(onOpenChangeComplete).not.toHaveBeenCalled();
		expect(document.body.style.pointerEvents).toBe('none'); // still exiting: present

		exit.settle();
		exit.stop();
		await frames();
		expect(onOpenChangeComplete).toHaveBeenCalledExactlyOnceWith(false);
	});
});

describe('menubar swap', () => {
	test('the outgoing menu skips its exit: zero duration inline, completion synchronous', async () => {
		const onOpenChangeComplete = vi.fn();
		mountInBody(MenuPresenceMenubarFixture, { onOpenChangeComplete });
		expect(byTestId('file-content').dataset.state).toBe('open');

		byTestId('edit-trigger').dispatchEvent(new Event('pointerenter')); // hover swap while open
		flushSync();
		const file = byTestId('file-content');
		expect(file.dataset.state).toBe('closed');
		expect(file.style.visibility).toBe('hidden');
		expect(file.style.transitionDuration).toBe('0s');
		expect(onOpenChangeComplete).toHaveBeenCalledExactlyOnceWith('file', false);
		expect(byTestId('edit-content').dataset.state).toBe('open');

		await tick(); // the swap flag resets a tick later; the surface stays hidden without the override
		await tick();
		expect(file.style.transitionDuration).toBe('');
		expect(file.style.visibility).toBe('hidden');
	});
});
