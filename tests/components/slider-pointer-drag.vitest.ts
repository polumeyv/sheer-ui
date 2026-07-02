import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import SliderValueNormalizationFixture from './slider-value-normalization.fixture.svelte';

// SliderSingleRootState and SliderMultiRootState both register their document pointer listeners
// through the shared SliderBaseRootState constructor now (previously each subclass duplicated the
// same onMount block) — these tests exist to prove that hoist didn't change listener registration
// or break the drag interaction for either mode.

class ResizeObserverStub {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
}

beforeEach(() => {
	Object.defineProperty(globalThis, 'ResizeObserver', {
		configurable: true,
		value: ResizeObserverStub,
	});
	Object.defineProperty(window, 'ResizeObserver', {
		configurable: true,
		value: ResizeObserverStub,
	});
});

afterEach(() => {
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

type FixtureProps = Partial<{
	value: number | number[];
	type: 'single' | 'multiple';
	min: number;
	max: number;
	step: number | number[];
	autoSort: boolean;
}>;

function renderFixture(props: FixtureProps) {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(SliderValueNormalizationFixture, { props, target });
	flushSync();
	return { component, target };
}

function readOutput(target: HTMLElement, testId: string) {
	const node = target.querySelector(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} readout to render`);
	return node.textContent;
}

function getRoot(target: HTMLElement) {
	const root = target.querySelector<HTMLElement>('[data-slot="slider"]');
	if (!root) throw new Error('Expected slider root to render');
	// 200px-wide horizontal track starting at the origin, so clientX doubles as a 0-200 percent scale.
	vi.spyOn(root, 'getBoundingClientRect').mockReturnValue({
		left: 0,
		right: 200,
		top: 0,
		bottom: 20,
		width: 200,
		height: 20,
		x: 0,
		y: 0,
		toJSON: () => {},
	});
	return root;
}

function pointerdownAt(root: HTMLElement, clientX: number) {
	root.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX, clientY: 10 }));
	flushSync();
}

function pointermoveAt(clientX: number) {
	document.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX, clientY: 10 }));
	flushSync();
}

function pointerup() {
	document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
	flushSync();
}

function documentCalls(spy: ReturnType<typeof vi.spyOn>, type: string) {
	return spy.mock.calls.filter((call) => call[0] === type);
}

describe('Slider pointer listener registration', () => {
	test('single-value mode attaches exactly one set of document pointer listeners', () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		const { component } = renderFixture({ type: 'single', min: 0, max: 100, step: 1 });

		try {
			expect(documentCalls(addSpy, 'pointerdown')).toHaveLength(1);
			expect(documentCalls(addSpy, 'pointerup')).toHaveLength(1);
			expect(documentCalls(addSpy, 'pointermove')).toHaveLength(1);
			expect(documentCalls(addSpy, 'pointerleave')).toHaveLength(1);
		} finally {
			unmount(component);
		}
	});

	test('multi-value mode attaches exactly one set of document pointer listeners', () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		const { component } = renderFixture({ type: 'multiple', min: 0, max: 100, step: 1 });

		try {
			expect(documentCalls(addSpy, 'pointerdown')).toHaveLength(1);
			expect(documentCalls(addSpy, 'pointerup')).toHaveLength(1);
			expect(documentCalls(addSpy, 'pointermove')).toHaveLength(1);
			expect(documentCalls(addSpy, 'pointerleave')).toHaveLength(1);
		} finally {
			unmount(component);
		}
	});

	test('unmounting removes the pointer listeners', () => {
		const removeSpy = vi.spyOn(document, 'removeEventListener');
		const { component } = renderFixture({ type: 'single', min: 0, max: 100, step: 1 });

		unmount(component);
		flushSync();

		expect(documentCalls(removeSpy, 'pointerdown')).toHaveLength(1);
		expect(documentCalls(removeSpy, 'pointerup')).toHaveLength(1);
		expect(documentCalls(removeSpy, 'pointermove')).toHaveLength(1);
		expect(documentCalls(removeSpy, 'pointerleave')).toHaveLength(1);
	});
});

describe('Slider drag behavior', () => {
	test('pointerdown, pointermove, and pointerup drive the value through a full drag', () => {
		const { component, target } = renderFixture({ type: 'single', value: 0, min: 0, max: 100, step: 1 });
		const root = getRoot(target);

		try {
			expect(readOutput(target, 'value')).toBe('0');

			// pointerdown at 10% of the 200px track -> value snaps to 10, and handlePointerDown
			// applies the initial position synchronously (no separate move needed).
			pointerdownAt(root, 20);
			expect(readOutput(target, 'value')).toBe('10');
			expect(readOutput(target, 'change-count')).toBe('1');

			// drag to 50% -> value follows to 50
			pointermoveAt(100);
			expect(readOutput(target, 'value')).toBe('50');
			expect(readOutput(target, 'change-count')).toBe('2');

			// release -> commits the value the drag landed on
			expect(readOutput(target, 'commit-count')).toBe('0');
			pointerup();
			expect(readOutput(target, 'commit-count')).toBe('1');
			expect(readOutput(target, 'last-committed')).toBe('50');
		} finally {
			unmount(component);
		}
	});

	test('pointermove before any pointerdown does not move the value (drag must start on the slider)', () => {
		const { component, target } = renderFixture({ type: 'single', value: 0, min: 0, max: 100, step: 1 });
		getRoot(target);

		try {
			expect(readOutput(target, 'value')).toBe('0');
			pointermoveAt(150);
			expect(readOutput(target, 'value')).toBe('0');
			expect(readOutput(target, 'change-count')).toBe('0');
		} finally {
			unmount(component);
		}
	});
});
