import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { mountInBody } from '../mount';
import MenuPresenceFixture from './menu-presence.fixture.svelte';

// The open surface flags itself; ui.css turns the flag into the body user-select guard.

test('an open menu content carries the text-selection guard flag, a closed one does not', () => {
	const { component: c } = mountInBody(MenuPresenceFixture, {});
	const content = document.body.querySelector<HTMLElement>('[data-testid="content"]')!;
	expect(content.hasAttribute('data-text-selection-guard')).toBe(false);
	c.setOpen(true);
	flushSync();
	expect(content.hasAttribute('data-text-selection-guard')).toBe(true);
	c.setOpen(false);
	flushSync();
	expect(content.hasAttribute('data-text-selection-guard')).toBe(false);
});
