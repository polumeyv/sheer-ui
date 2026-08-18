import { flushSync } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import { render, text } from '../harness.js';
import SliderValueNormalizationFixture from './slider-value-normalization.fixture.svelte';

// SliderSingleRootState and SliderMultiRootState both register their document pointer listeners
// through the shared SliderBaseRootState constructor now (previously each subclass duplicated the
// same onMount block) — these tests exist to prove that hoist didn't change listener registration
// or break the drag interaction for either mode.

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
		render(SliderValueNormalizationFixture, { type: 'single', min: 0, max: 100, step: 1 });

		expect(documentCalls(addSpy, 'pointerdown')).toHaveLength(1);
		expect(documentCalls(addSpy, 'pointerup')).toHaveLength(1);
		expect(documentCalls(addSpy, 'pointermove')).toHaveLength(1);
		expect(documentCalls(addSpy, 'pointerleave')).toHaveLength(1);
	});

	test('multi-value mode attaches exactly one set of document pointer listeners', () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		render(SliderValueNormalizationFixture, { type: 'multiple', min: 0, max: 100, step: 1 });

		expect(documentCalls(addSpy, 'pointerdown')).toHaveLength(1);
		expect(documentCalls(addSpy, 'pointerup')).toHaveLength(1);
		expect(documentCalls(addSpy, 'pointermove')).toHaveLength(1);
		expect(documentCalls(addSpy, 'pointerleave')).toHaveLength(1);
	});

	test('unmounting aborts the document pointer listeners', () => {
		// Listener removal rides the onMount effect's AbortSignal, so removeEventListener is
		// never called — the removal contract is that every registration carried the signal
		// and unmount aborts it.
		const addSpy = vi.spyOn(document, 'addEventListener');
		const { unmount } = render(SliderValueNormalizationFixture, { type: 'single', min: 0, max: 100, step: 1 });

		const signals = (['pointerdown', 'pointerup', 'pointermove', 'pointerleave'] as const).map((type) => {
			const calls = documentCalls(addSpy, type);
			expect(calls).toHaveLength(1);
			const options = calls[0]![2] as AddEventListenerOptions;
			expect(options.signal).toBeInstanceOf(AbortSignal);
			return options.signal!;
		});
		expect(signals.some((signal) => signal.aborted)).toBe(false);

		unmount();
		flushSync();

		expect(signals.every((signal) => signal.aborted)).toBe(true);
	});
});

describe('Slider drag behavior', () => {
	test('pointerdown, pointermove, and pointerup drive the value through a full drag', () => {
		const { target } = render(SliderValueNormalizationFixture, { type: 'single', value: 0, min: 0, max: 100, step: 1 });
		const root = getRoot(target);

		expect(text('value')).toBe('0');

		// pointerdown at 10% of the 200px track -> value snaps to 10, and handlePointerDown
		// applies the initial position synchronously (no separate move needed).
		pointerdownAt(root, 20);
		expect(text('value')).toBe('10');
		expect(text('change-count')).toBe('1');

		// drag to 50% -> value follows to 50
		pointermoveAt(100);
		expect(text('value')).toBe('50');
		expect(text('change-count')).toBe('2');

		// release -> commits the value the drag landed on
		expect(text('commit-count')).toBe('0');
		pointerup();
		expect(text('commit-count')).toBe('1');
		expect(text('last-committed')).toBe('50');
	});

	test('pointermove before any pointerdown does not move the value (drag must start on the slider)', () => {
		const { target } = render(SliderValueNormalizationFixture, { type: 'single', value: 0, min: 0, max: 100, step: 1 });
		getRoot(target);

		expect(text('value')).toBe('0');
		pointermoveAt(150);
		expect(text('value')).toBe('0');
		expect(text('change-count')).toBe('0');
	});
});
