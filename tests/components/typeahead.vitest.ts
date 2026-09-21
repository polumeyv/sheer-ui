import { flushSync } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { mountInBody } from '../mount';
import TypeaheadFixture from './typeahead.fixture.svelte';

type Fixture = {
	typeLabel: (key: string) => string | undefined;
	typeNode: (key: string) => HTMLElement | undefined;
	resetLabels: () => void;
	labelSearch: () => string;
};

function render() {
	const { component, target } = mountInBody(TypeaheadFixture);

	function read(testid: string) {
		return target.querySelector(`[data-testid="${testid}"]`)?.textContent ?? '';
	}

	return { component: component as unknown as Fixture, read };
}

afterEach(() => {
	vi.useRealTimers();
});

describe('Typeahead', () => {
	test('string candidates match by prefix', () => {
		const { component, read } = render();
		expect(component.typeLabel('b')).toBe('Banana');
		flushSync();
		expect(read('matched-label')).toBe('Banana');
	});

	test('element candidates match on their trimmed text content', () => {
		const { component, read } = render();
		expect(component.typeNode('b')?.textContent?.trim()).toBe('Banana');
		flushSync();
		expect(read('matched-node')).toBe('Banana');
	});

	test('repeating a key cycles through the candidates sharing that letter', () => {
		const { component } = render();
		expect(component.typeLabel('a')).toBe('Apple');
		expect(component.typeLabel('a')).toBe('Apricot');
		expect(component.typeLabel('a')).toBe('Apple');
	});

	test('the search buffer clears itself after 1000ms', () => {
		vi.useFakeTimers();
		const { component } = render();
		component.typeLabel('a');
		component.typeLabel('p');
		expect(component.labelSearch()).toBe('ap');

		vi.advanceTimersByTime(999);
		expect(component.labelSearch()).toBe('ap');

		vi.advanceTimersByTime(1);
		expect(component.labelSearch()).toBe('');
	});

	test('reset clears the search buffer mid-word', () => {
		const { component } = render();
		component.typeLabel('a');
		component.typeLabel('p');
		expect(component.labelSearch()).toBe('ap');

		component.resetLabels();
		expect(component.labelSearch()).toBe('');
	});
});
