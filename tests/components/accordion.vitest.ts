import { flushSync } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import { mountInBody, unmount } from '../mount';
import AccordionFixture from './accordion.fixture.svelte';

type SelectionType = 'single' | 'multiple';

function renderFixture(props: { type: SelectionType; value?: string | string[] }) {
	return mountInBody(AccordionFixture, props).component;
}

function getItem(name: string) {
	const node = document.body.querySelector<HTMLDetailsElement>(`[data-testid="item-${name}"]`);
	if (!node) throw new Error(`Expected item-${name} to render`);
	return node;
}

function click(name: string) {
	const summary = document.body.querySelector<HTMLElement>(`[data-testid="trigger-${name}"]`);
	if (!summary) throw new Error(`Expected trigger-${name} to render`);
	summary.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
	flushSync();
}

// A toggle the click path did not produce: find-in-page or a hash reveal flipped `open` natively.
function nativeToggle(name: string, open: boolean) {
	const details = getItem(name);
	details.open = open;
	details.dispatchEvent(new Event('toggle'));
	flushSync();
}

function readValue() {
	const node = document.body.querySelector('[data-testid="value"]');
	if (!node) throw new Error('Expected value readout to render');
	return node.textContent;
}

const state = (name: string) => getItem(name).getAttribute('data-state');

describe('accordion', () => {
	test('single mode opens one item, swaps on another, and closes on a second click', async () => {
		renderFixture({ type: 'single' });
		expect(readValue()).toBe('');
		expect(state('alpha')).toBe('closed');

		click('alpha');
		expect(readValue()).toBe('alpha');
		expect(state('alpha')).toBe('open');
		expect(getItem('alpha').open).toBe(true);

		click('beta');
		expect(readValue()).toBe('beta');
		expect(state('alpha')).toBe('closed');
		expect(state('beta')).toBe('open');
		// The force-closed sibling keeps `open` until its close settles, then drops it.
		await vi.waitFor(() => expect(getItem('alpha').open).toBe(false));

		click('beta');
		expect(readValue()).toBe('');
		expect(state('beta')).toBe('closed');
	});

	test('multiple mode accumulates items and removes them one at a time', () => {
		renderFixture({ type: 'multiple' });
		expect(readValue()).toBe('[]');

		click('alpha');
		click('beta');
		expect(readValue()).toBe('[alpha,beta]');
		expect(state('alpha')).toBe('open');
		expect(state('beta')).toBe('open');

		click('alpha');
		expect(readValue()).toBe('[beta]');
		expect(state('alpha')).toBe('closed');
	});

	test('a native toggle reports the browser state; one that matches the rendered state writes nothing', () => {
		const component = renderFixture({ type: 'multiple', value: ['alpha'] });
		nativeToggle('beta', true);
		expect(readValue()).toBe('[alpha,beta]');

		const before = component.getValue();
		nativeToggle('beta', true);
		expect(component.getValue()).toBe(before);
	});

	test('an initial value opens its item, and a reset to undefined repairs to the empty selection', () => {
		const single = renderFixture({ type: 'single', value: 'beta' });
		expect(state('beta')).toBe('open');
		single.setValue(undefined);
		flushSync();
		expect(readValue()).toBe('');
		expect(state('beta')).toBe('closed');
		unmount(single);

		const multiple = renderFixture({ type: 'multiple' });
		multiple.setValue(undefined);
		flushSync();
		expect(readValue()).toBe('[]');
	});
});
