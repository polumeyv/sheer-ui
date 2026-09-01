import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import ComboboxPresenceFixture from './combobox-presence.fixture.svelte';

// The select/combobox content follows the menu: mounted while closed, visibility:hidden inline,
// completion settle-based (see menu-presence.vitest.ts for the shared machinery's cases).

const frames = async (count = 3) => {
	for (let i = 0; i < count; i++) await new Promise(requestAnimationFrame);
};

afterEach(() => {
	document.body.innerHTML = '';
});

describe('combobox presence', () => {
	test('closed content is mounted and visibility:hidden; open clears it; close completes after settle', async () => {
		const onOpenChangeComplete = vi.fn();
		const target = document.createElement('div');
		document.body.append(target);
		const c = mount(ComboboxPresenceFixture, { props: { onOpenChangeComplete }, target });
		flushSync();
		try {
			const content = document.body.querySelector<HTMLElement>('[data-testid="content"]')!;
			expect(content.dataset.state).toBe('closed');
			expect(content.style.visibility).toBe('hidden');

			c.setOpen(true);
			flushSync();
			expect(content.style.visibility).toBe('');

			content.getAnimations = () => [];
			c.setOpen(false);
			flushSync();
			expect(content.style.visibility).toBe('hidden');
			expect(onOpenChangeComplete).not.toHaveBeenCalled();
			await frames();
			expect(onOpenChangeComplete).toHaveBeenCalledExactlyOnceWith(false);
		} finally {
			unmount(c);
		}
	});
});
