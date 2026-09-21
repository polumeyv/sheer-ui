import { flushSync } from 'svelte';
import { describe, expect, test } from 'vitest';
import { mountInBody } from '../mount';
import Fixture from './tabs-pagination.fixture.svelte';

// Both engines take accessor-object options; these pin that reads stay live and writes reach the bindable.

function render(surface: 'tabs' | 'pagination') {
	return mountInBody(Fixture, { surface }).component;
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
	});

	test('arrow keys rove between enabled triggers', () => {
		render('tabs');
		el('tab-one').focus();
		press('tab-one', 'ArrowRight');
		expect(document.activeElement).toBe(el('tab-two'));
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
	});
});
