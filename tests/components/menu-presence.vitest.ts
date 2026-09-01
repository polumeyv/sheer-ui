import { flushSync, mount, tick, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import MenuPresenceFixture from './menu-presence.fixture.svelte';
import MenuPresenceMenubarFixture from './menu-presence-menubar.fixture.svelte';

// Menu content stays mounted through its exit: the closed state is inline (visibility for
// floating content, display for static), the exit motion is CSS, and completion is settle-based.

function render(props: { isStatic?: boolean; onOpenChangeComplete?: (open: boolean) => void } = {}) {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(MenuPresenceFixture, { props, target });
	flushSync();
	return component;
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

afterEach(() => {
	document.body.innerHTML = '';
});

describe('menu presence', () => {
	test('closed floating content is mounted and visibility:hidden; opening clears it', () => {
		const c = render();
		try {
			const content = byTestId('content');
			expect(content.dataset.state).toBe('closed');
			expect(content.style.visibility).toBe('hidden');
			expect(content.style.display).toBe('');

			c.setOpen(true);
			flushSync();
			expect(content.dataset.state).toBe('open');
			expect(content.style.visibility).toBe('');
		} finally {
			unmount(c);
		}
	});

	test('closed static content is display:none (it must leave the flow)', () => {
		const c = render({ isStatic: true });
		try {
			expect(byTestId('content').style.display).toBe('none');
			c.setOpen(true);
			flushSync();
			expect(byTestId('content').style.display).toBe('');
		} finally {
			unmount(c);
		}
	});

	test('items of a closed sub-content are not arrow-key candidates of the parent', () => {
		const c = render();
		try {
			c.setOpen(true);
			flushSync();
			expect(byTestId('sub-content').dataset.state).toBe('closed'); // mounted, hidden
			byTestId('sub-trigger').focus();
			arrowDown(byTestId('sub-trigger'));
			expect(document.activeElement).toBe(byTestId('item-2'));
		} finally {
			unmount(c);
		}
	});

	test('close: completes after the exit settles, and the page stays locked until then', async () => {
		const onOpenChangeComplete = vi.fn();
		const c = render({ onOpenChangeComplete });
		try {
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
		} finally {
			unmount(c);
		}
	});
});

describe('menubar swap', () => {
	test('the outgoing menu skips its exit: zero duration inline, completion synchronous', async () => {
		const onOpenChangeComplete = vi.fn();
		const target = document.createElement('div');
		document.body.append(target);
		const c = mount(MenuPresenceMenubarFixture, { props: { onOpenChangeComplete }, target });
		flushSync();
		try {
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
		} finally {
			unmount(c);
		}
	});
});
