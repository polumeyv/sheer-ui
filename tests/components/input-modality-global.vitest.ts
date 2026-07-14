import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import InputModalityGlobalFixture from './input-modality-global.fixture.svelte';

function render(props: { menuRoots?: number; contextMenuRoots?: number } = {}) {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(InputModalityGlobalFixture, { props, target });
	flushSync();
	return component;
}

function listenerCalls(spy: ReturnType<typeof vi.spyOn>, type: 'pointerdown' | 'keydown') {
	return spy.mock.calls.filter((call) => call[0] === type);
}

function usesCapture(options: unknown): boolean {
	return (
		options === true || (typeof options === 'object' && options !== null && 'capture' in options && options.capture === true)
	);
}

afterEach(() => {
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

describe('menu input modality listeners', () => {
	test('a menu root owns one capture-phase document listener pair', () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		const component = render();

		try {
			expect(listenerCalls(addSpy, 'pointerdown')).toHaveLength(1);
			expect(listenerCalls(addSpy, 'keydown')).toHaveLength(1);
			expect(usesCapture(listenerCalls(addSpy, 'pointerdown')[0]?.[2])).toBe(true);
			expect(usesCapture(listenerCalls(addSpy, 'keydown')[0]?.[2])).toBe(true);
		} finally {
			unmount(component);
		}
	});

	test('each menu and context-menu root owns independent listeners', () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		const component = render({ menuRoots: 2, contextMenuRoots: 1 });

		try {
			expect(listenerCalls(addSpy, 'pointerdown')).toHaveLength(3);
			expect(listenerCalls(addSpy, 'keydown')).toHaveLength(3);
		} finally {
			unmount(component);
		}
	});

	test('Svelte removes every root listener when the roots unmount', () => {
		const removeSpy = vi.spyOn(document, 'removeEventListener');
		const component = render({ menuRoots: 2, contextMenuRoots: 1 });

		unmount(component);
		flushSync();

		expect(listenerCalls(removeSpy, 'pointerdown')).toHaveLength(3);
		expect(listenerCalls(removeSpy, 'keydown')).toHaveLength(3);
	});
});
