import { flushSync, mount, unmount } from 'svelte';
import { afterEach, expect, test } from 'vitest';
import MenuPresenceFixture from './menu-presence.fixture.svelte';

// The open surface flags itself; ui.css turns the flag into the body user-select guard.

afterEach(() => {
	document.body.innerHTML = '';
});

test('an open menu content carries the text-selection guard flag, a closed one does not', () => {
	const target = document.createElement('div');
	document.body.append(target);
	const c = mount(MenuPresenceFixture, { props: {}, target });
	flushSync();
	try {
		const content = document.body.querySelector<HTMLElement>('[data-testid="content"]')!;
		expect(content.hasAttribute('data-text-selection-guard')).toBe(false);
		c.setOpen(true);
		flushSync();
		expect(content.hasAttribute('data-text-selection-guard')).toBe(true);
		c.setOpen(false);
		flushSync();
		expect(content.hasAttribute('data-text-selection-guard')).toBe(false);
	} finally {
		unmount(c);
	}
});
