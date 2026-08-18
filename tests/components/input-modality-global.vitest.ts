import { flushSync } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import { render } from '../harness.js';
import InputModalityGlobalFixture from './input-modality-global.fixture.svelte';

function listenerCalls(spy: ReturnType<typeof vi.spyOn>, type: 'pointerdown' | 'keydown') {
	return spy.mock.calls.filter((call) => call[0] === type);
}

function usesCapture(options: unknown): boolean {
	return (
		options === true || (typeof options === 'object' && options !== null && 'capture' in options && options.capture === true)
	);
}

describe('menu input modality listeners', () => {
	test('a menu root owns one capture-phase document listener pair', () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		render(InputModalityGlobalFixture);

		expect(listenerCalls(addSpy, 'pointerdown')).toHaveLength(1);
		expect(listenerCalls(addSpy, 'keydown')).toHaveLength(1);
		expect(usesCapture(listenerCalls(addSpy, 'pointerdown')[0]?.[2])).toBe(true);
		expect(usesCapture(listenerCalls(addSpy, 'keydown')[0]?.[2])).toBe(true);
	});

	test('each menu and context-menu root owns independent listeners', () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		render(InputModalityGlobalFixture, { menuRoots: 2, contextMenuRoots: 1 });

		expect(listenerCalls(addSpy, 'pointerdown')).toHaveLength(3);
		expect(listenerCalls(addSpy, 'keydown')).toHaveLength(3);
	});

	test('Svelte removes every root listener when the roots unmount', () => {
		const removeSpy = vi.spyOn(document, 'removeEventListener');
		const { unmount } = render(InputModalityGlobalFixture, { menuRoots: 2, contextMenuRoots: 1 });

		unmount();
		flushSync();

		expect(listenerCalls(removeSpy, 'pointerdown')).toHaveLength(3);
		expect(listenerCalls(removeSpy, 'keydown')).toHaveLength(3);
	});
});
