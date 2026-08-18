import { flushSync } from 'svelte';
import { describe, expect, test } from 'vitest';
import { render } from '../harness.js';
import DataTableRenderFixture from './data-table-render.fixture.svelte';

function renderFixture() {
	const renders: string[] = [];
	render(DataTableRenderFixture, { onNameCellRender: (id: string) => renders.push(id) });
	return { renders };
}

function getRow(id: string) {
	const row = document.body.querySelector<HTMLTableRowElement>(`[data-testid="row-${id}"]`);
	if (!row) throw new Error(`Expected row-${id} to render`);
	return row;
}

function getCheckbox(scope: ParentNode) {
	const checkbox = scope.querySelector<HTMLElement>('[role="checkbox"]');
	if (!checkbox) throw new Error('Expected a checkbox to render');
	return checkbox;
}

describe('FlexRender branches', () => {
	test('string header, component cell and snippet cell all render', () => {
		renderFixture();
		expect(document.body.querySelectorAll('th')[1]!.textContent).toBe('Name');
		expect(getCheckbox(getRow('a'))).toBeTruthy();
		// textCell goes through createRawSnippet and must escape user text.
		expect(getRow('b').querySelectorAll('td')[1]!.innerHTML).toContain('Beta &amp; Co');
	});
});

describe('selection through the rendered table', () => {
	test('row checkbox selects its row; header checkbox toggles the page', () => {
		renderFixture();
		getCheckbox(getRow('a')).click();
		flushSync();
		expect(getRow('a').dataset.selected).toBe('true');
		expect(getRow('b').dataset.selected).toBe('false');

		getCheckbox(document.body.querySelector('thead')!).click();
		flushSync();
		expect(getRow('b').dataset.selected).toBe('true');

		getCheckbox(document.body.querySelector('thead')!).click();
		flushSync();
		expect(getRow('a').dataset.selected).toBe('false');
		expect(getRow('b').dataset.selected).toBe('false');
	});

	test('selecting one row does not re-render other rows data cells', () => {
		const { renders } = renderFixture();
		expect(renders.sort()).toEqual(['a', 'b']);

		getCheckbox(getRow('a')).click();
		flushSync();
		expect(renders.sort()).toEqual(['a', 'b']);
	});
});
