import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import InputModalityGlobalFixture from './input-modality-global.fixture.svelte';

function render() {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(InputModalityGlobalFixture, { target });
	flushSync();
	return { component, target };
}

function isKeyboard(target: HTMLElement): string | null {
	const node = target.querySelector('[data-testid="is-keyboard"]');
	if (!node) throw new Error('missing is-keyboard readout');
	return node.textContent;
}

function fireKeydown() {
	document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
	flushSync();
}

function firePointerdown() {
	document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
	flushSync();
}

// `on()` (svelte/events) attaches through element.addEventListener under the hood, so spying on
// document's own methods is a faithful way to observe when the shared listener pair actually
// attaches/detaches, independent of the SharedState refcounting internals.
function listenerCalls(spy: ReturnType<typeof vi.spyOn>, type: 'pointerdown' | 'keydown') {
	return spy.mock.calls.filter((call) => call[0] === type);
}

afterEach(() => {
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

describe('useGlobalInputModality', () => {
	test('a single consumer attaches exactly one pointerdown + keydown listener pair', () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		const { component, target } = render();

		try {
			expect(listenerCalls(addSpy, 'pointerdown')).toHaveLength(1);
			expect(listenerCalls(addSpy, 'keydown')).toHaveLength(1);
			expect(listenerCalls(addSpy, 'pointerdown')[0]?.[2]).toMatchObject({ capture: true });
			expect(listenerCalls(addSpy, 'keydown')[0]?.[2]).toMatchObject({ capture: true });

			expect(isKeyboard(target)).toBe('false');
			fireKeydown();
			expect(isKeyboard(target)).toBe('true');
			firePointerdown();
			expect(isKeyboard(target)).toBe('false');
		} finally {
			unmount(component);
		}
	});

	test('a second consumer shares the same listener pair instead of attaching new ones', () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		const first = render();

		try {
			expect(listenerCalls(addSpy, 'pointerdown')).toHaveLength(1);
			expect(listenerCalls(addSpy, 'keydown')).toHaveLength(1);

			const second = render();
			try {
				// still exactly one pair — the second consumer reused the shared subscription
				expect(listenerCalls(addSpy, 'pointerdown')).toHaveLength(1);
				expect(listenerCalls(addSpy, 'keydown')).toHaveLength(1);

				fireKeydown();
				expect(isKeyboard(first.target)).toBe('true');
				expect(isKeyboard(second.target)).toBe('true');
			} finally {
				unmount(second.component);
			}
		} finally {
			unmount(first.component);
		}
	});

	test('listeners tear down only after the last consumer unmounts, not before', () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		const removeSpy = vi.spyOn(document, 'removeEventListener');
		const first = render();
		const second = render();

		try {
			expect(listenerCalls(addSpy, 'pointerdown')).toHaveLength(1);

			unmount(first.component);
			flushSync();
			// one of two consumers gone — the shared listener must still be live
			expect(listenerCalls(removeSpy, 'pointerdown')).toHaveLength(0);
			expect(listenerCalls(removeSpy, 'keydown')).toHaveLength(0);

			firePointerdown();
			expect(isKeyboard(second.target)).toBe('false');
			fireKeydown();
			expect(isKeyboard(second.target)).toBe('true');

			unmount(second.component);
			flushSync();
			// last consumer gone — now it tears down, exactly once
			expect(listenerCalls(removeSpy, 'pointerdown')).toHaveLength(1);
			expect(listenerCalls(removeSpy, 'keydown')).toHaveLength(1);
		} finally {
			document.body.innerHTML = '';
		}
	});
});
