import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test } from 'vitest';
import Fixture from './tabs-pagination.fixture.svelte';

// Both engines take accessor-object options; these pin that reads stay live and writes reach the bindable.

function render(surface: 'tabs' | 'pagination') {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(Fixture, { props: { surface }, target });
	flushSync();
	return component;
}

function el(testid: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-testid="${testid}"]`);
	if (!node) throw new Error(`Expected ${testid} to render`);
	return node;
}

function click(testid: string) {
	el(testid).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
	flushSync();
}

function press(testid: string, key: string) {
	el(testid).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
	flushSync();
}

afterEach(() => {
	document.body.innerHTML = '';
});

describe('tabs', () => {
	test('click activates a tab, its panel shows, and the bound value follows', () => {
		const c = render('tabs');
		expect(el('tab-one').getAttribute('aria-selected')).toBe('true');
		expect(el('panel-two').hidden).toBe(true);

		click('tab-two');
		expect(c.current().tab).toBe('two');
		expect(el('tab-two').getAttribute('aria-selected')).toBe('true');
		expect(el('panel-one').hidden).toBe(true);
		expect(el('panel-two').hidden).toBe(false);
		expect(el('panel-two').getAttribute('aria-labelledby')).toBe(el('tab-two').id);

		click('tab-three');
		expect(c.current().tab).toBe('two');
		unmount(c);
	});

	test('arrow keys rove between enabled triggers', () => {
		const c = render('tabs');
		el('tab-one').focus();
		press('tab-one', 'ArrowRight');
		expect(document.activeElement).toBe(el('tab-two'));
		unmount(c);
	});
});

describe('pagination', () => {
	test('page and next/prev buttons write the bound page and clamp at the ends', () => {
		const c = render('pagination');
		expect(el('prev').hasAttribute('disabled')).toBe(true);

		click('page-3');
		expect(c.current().page).toBe(3);
		expect(el('page-3').getAttribute('data-selected')).toBe('');

		click('next');
		click('next');
		expect(c.current().page).toBe(5);
		expect(el('next').hasAttribute('disabled')).toBe(true);

		click('prev');
		expect(c.current().page).toBe(4);
		unmount(c);
	});
});
