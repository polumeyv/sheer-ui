import { flushSync } from 'svelte';
import { describe, expect, test } from 'vitest';
import { mountInBody } from '../mount';
import MenuSubContentTypeaheadFixture from './menu-sub-content-typeahead.fixture.svelte';

// SubContent both spreads its merged props onto PopperLayer (which routes them back into the
// popper snippet's `props`) and merges them into the rendered element. If the whole bag is
// merged twice, the state's onkeydown composes with itself: one physical 'a' keypress appends
// "aa" to the typeahead buffer, and the repeated-char logic cycles PAST the first match.
describe('submenu typeahead', () => {
	test.each([
		{ variant: 'floating', isStatic: false },
		{ variant: 'static', isStatic: true },
	])('$variant SubContent: one keypress advances typeahead by exactly one step', ({ isStatic }) => {
		mountInBody(MenuSubContentTypeaheadFixture, { isStatic });

		const subcontent = document.body.querySelector<HTMLElement>('[data-testid="subcontent"]');
		if (!subcontent) throw new Error('Expected the subcontent to render');

		subcontent.focus();
		subcontent.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA', bubbles: true, cancelable: true }));
		flushSync();

		expect(document.activeElement?.getAttribute('data-testid')).toBe('alpha');
	});

	test.each([
		{ variant: 'floating', isStatic: false },
		{ variant: 'static', isStatic: true },
	])('$variant SubContent keeps its id and dir on the rendered element', ({ isStatic }) => {
		mountInBody(MenuSubContentTypeaheadFixture, { isStatic });

		const subcontent = document.body.querySelector<HTMLElement>('[data-testid="subcontent"]');
		if (!subcontent) throw new Error('Expected the subcontent to render');

		expect(subcontent.id).not.toBe('');
		expect(subcontent.getAttribute('dir')).toBe('ltr');
	});
});
