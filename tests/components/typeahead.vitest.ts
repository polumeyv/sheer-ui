import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import TypeaheadFixture from './typeahead.fixture.svelte';

type Fixture = {
	typeLabel: (key: string) => string | undefined;
	typeNode: (key: string) => HTMLElement | undefined;
	resetLabels: () => void;
	labelSearch: () => string;
};

function render() {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(TypeaheadFixture, { target }) as unknown as Fixture;
	flushSync();

	function read(testid: string) {
		return target.querySelector(`[data-testid="${testid}"]`)?.textContent ?? '';
	}

	return { component, read };
}

afterEach(() => {
	vi.useRealTimers();
	document.body.innerHTML = '';
});

describe('Typeahead', () => {
	test('string candidates match by prefix', () => {
		const { component, read } = render();
		try {
			expect(component.typeLabel('b')).toBe('Banana');
			flushSync();
			expect(read('matched-label')).toBe('Banana');
		} finally {
			unmount(component);
		}
	});

	test('element candidates match on their trimmed text content', () => {
		const { component, read } = render();
		try {
			expect(component.typeNode('b')?.textContent?.trim()).toBe('Banana');
			flushSync();
			expect(read('matched-node')).toBe('Banana');
		} finally {
			unmount(component);
		}
	});

	test('repeating a key cycles through the candidates sharing that letter', () => {
		const { component } = render();
		try {
			expect(component.typeLabel('a')).toBe('Apple');
			expect(component.typeLabel('a')).toBe('Apricot');
			expect(component.typeLabel('a')).toBe('Apple');
		} finally {
			unmount(component);
		}
	});

	test('the search buffer clears itself after 1000ms', () => {
		vi.useFakeTimers();
		const { component } = render();
		try {
			component.typeLabel('a');
			component.typeLabel('p');
			expect(component.labelSearch()).toBe('ap');

			vi.advanceTimersByTime(999);
			expect(component.labelSearch()).toBe('ap');

			vi.advanceTimersByTime(1);
			expect(component.labelSearch()).toBe('');
		} finally {
			unmount(component);
		}
	});

	test('reset clears the search buffer mid-word', () => {
		const { component } = render();
		try {
			component.typeLabel('a');
			component.typeLabel('p');
			expect(component.labelSearch()).toBe('ap');

			component.resetLabels();
			expect(component.labelSearch()).toBe('');
		} finally {
			unmount(component);
		}
	});
});
