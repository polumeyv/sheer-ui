import { flushSync, mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import Fixture from './data-table-header-sync.fixture.svelte';

test('header checkbox re-renders when the page changes under a selection', () => {
	const renders: boolean[] = [];
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(Fixture, { props: { onHeaderRender: (checked: boolean) => renders.push(checked) }, target });
	flushSync();
	expect(renders).toEqual([false]);

	component.selectAllPage();
	flushSync();
	expect(renders).toEqual([false, true]);

	component.nextPage();
	flushSync();
	// page 2 has no selected rows: the header fn must re-run and see false
	expect(renders.at(-1)).toBe(false);
	const headerCheckbox = document.body.querySelector('thead [role="checkbox"]')!;
	expect(headerCheckbox.getAttribute('aria-checked')).toBe('false');

	unmount(component);
	document.body.innerHTML = '';
});
