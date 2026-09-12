import { flushSync, mount, unmount } from 'svelte';
import { afterEach, expect, test, vi } from 'vitest';
import DataTableContentFixture from './data-table-content.fixture.svelte';
import type { ComponentProps } from 'svelte';

let component: ReturnType<typeof mount> | undefined;

function render(props: ComponentProps<typeof DataTableContentFixture> = {}) {
	const target = document.createElement('div');
	document.body.append(target);
	component = mount(DataTableContentFixture, { target, props });
	flushSync();
}

function button(label: string) {
	const element = [...document.body.querySelectorAll<HTMLButtonElement>('button')].find((button) => button.textContent?.trim() === label);
	if (!element) throw new Error(`Expected button: ${label}`);
	return element;
}

function click(element: HTMLElement) {
	element.click();
	flushSync();
}

function rows() {
	return [...document.body.querySelectorAll<HTMLTableRowElement>('tbody tr')];
}

function names() {
	return rows().map((row) => row.cells[1]?.textContent);
}

function filter(value: string) {
	const input = document.body.querySelector<HTMLInputElement>('input[placeholder="Filter names..."]')!;
	input.value = value;
	input.dispatchEvent(new Event('input', { bubbles: true }));
	flushSync();
	return input;
}

afterEach(async () => {
	if (component) await unmount(component);
	component = undefined;
	document.body.innerHTML = '';
});

test('compiled headers, text cells and action snippets escape text and keep styles', () => {
	const html = '<img src=x onerror="alert(1)"> & "quoted"';
	render({
		noteLabel: html,
		data: [
			{ name: html, note: html },
			{ name: 'Empty', note: null },
		],
	});
	expect(document.body.querySelector('img')).toBeNull();
	expect(document.body.querySelectorAll('th')[2]!.textContent).toBe(html);
	expect(rows()[0]!.querySelector('.font-medium')!.textContent).toBe(html);
	expect(rows()[0]!.querySelector('.text-muted-foreground')!.textContent).toBe(`<${html}>`);
	expect(rows()[1]!.querySelector('.text-muted-foreground')!.textContent).toBe('-');
	expect(rows()[0]!.querySelector('strong')!.textContent).toBe(html);
	expect(rows()[0]!.cells[2]!.classList.contains('text-right')).toBe(true);
});

test('header sorting cycles in the rendered table and pagination follows the sorted rows', () => {
	render();
	expect(names()).toEqual(['Beta', 'Alpha']);
	click(button('Name'));
	expect(names()).toEqual(['Alpha', 'Beta']);
	click(button('Go to next page'));
	expect(names()).toEqual(['Gamma']);
	click(button('Name'));
	expect(names()).toEqual(['Gamma', 'Beta']);
	click(button('Name'));
	expect(names()).toEqual(['Beta', 'Alpha']);
});

test('zero results keep search and reset available, and clearing restores selected rows', () => {
	render();
	click(rows()[0]!.querySelector<HTMLElement>('[role="checkbox"]')!);
	const input = filter('missing');
	expect(rows()[0]!.textContent).toBe('No results.');
	expect(input.disabled).toBe(false);
	expect(button('Reset').disabled).toBe(false);
	click(button('Reset'));
	expect(input.value).toBe('');
	expect(names()).toEqual(['Beta', 'Alpha']);
	expect(rows()[0]!.dataset.state).toBe('selected');
	filter('missing');
	filter('Gamma');
	expect(names()).toEqual(['Gamma']);
});

test('page selection stays scoped to the page and survives pagination', () => {
	render();
	const header = document.body.querySelector<HTMLElement>('thead [role="checkbox"]')!;
	click(header);
	expect(rows().every((row) => row.dataset.state === 'selected')).toBe(true);
	click(button('Go to next page'));
	expect(rows()[0]!.dataset.state).not.toBe('selected');
	click(header);
	expect(rows()[0]!.dataset.state).toBe('selected');
	click(button('Go to previous page'));
	expect(rows().every((row) => row.dataset.state === 'selected')).toBe(true);
	click(header);
	expect(rows().every((row) => row.dataset.state !== 'selected')).toBe(true);
	click(button('Go to next page'));
	expect(rows()[0]!.dataset.state).toBe('selected');
});

test('hiding columns keeps headers, cells and the empty span aligned', () => {
	render();
	click(button('Hide note'));
	expect(document.body.querySelectorAll('th')).toHaveLength(3);
	expect(rows()[0]!.cells).toHaveLength(3);
	filter('missing');
	expect(rows()[0]!.cells[0]!.colSpan).toBe(3);
});

test('row navigation ignores selection and cell actions', () => {
	const onRowClick = vi.fn();
	const onAction = vi.fn();
	render({ onRowClick, onAction });
	click(rows()[0]!.cells[1]!);
	expect(onRowClick).toHaveBeenCalledWith({ name: 'Beta', note: null });
	onRowClick.mockClear();
	click(rows()[0]!.querySelector<HTMLElement>('[role="checkbox"]')!);
	click(button('Action Beta').querySelector('strong')!);
	expect(onRowClick).not.toHaveBeenCalled();
	expect(onAction).toHaveBeenCalledWith({ name: 'Beta', note: null });
});
