import { flushSync } from 'svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from '../harness.js';
import Fixture from './use-floating-reactivity.fixture.svelte';

// Mocked so positioning is synchronous-ish + deterministic, and so we can count re-positions.
const floatingMocks = vi.hoisted(() => ({ computePosition: vi.fn() }));

vi.mock('@floating-ui/dom', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@floating-ui/dom')>();
	return { ...actual, computePosition: floatingMocks.computePosition };
});

async function settle() {
	await Promise.resolve();
	await Promise.resolve();
	flushSync();
}

beforeEach(() => {
	// Non-empty client rects → `isReferenceHidden` is false → `update()` runs to completion.
	vi.spyOn(Element.prototype, 'getClientRects').mockImplementation(
		() =>
			({
				length: 1,
				item: () => null,
				0: new DOMRect(0, 0, 10, 10),
				[Symbol.iterator]: function* () {
					yield (this as unknown as { 0: DOMRect })[0];
				},
			}) as unknown as DOMRectList,
	);
	floatingMocks.computePosition.mockResolvedValue({
		x: 0,
		y: 0,
		strategy: 'absolute',
		placement: 'bottom',
		middlewareData: {},
	});
});

describe('useFloating effect reactivity (const-arrow + && refactor)', () => {
	// `const reset = () => void (!openOption && floating.current === null && (isPositioned = false));`
	test('reset effect tracks `open` and clears isPositioned reactively', async () => {
		const { component: c } = render(Fixture);
		await settle();

		expect(c.isPositionedNow()).toBe(true);

		// Flip open→false and drop the floating element → reset's condition becomes true.
		// If the void(&&) arrow didn't register `open` as a dep, the effect wouldn't re-run
		// and isPositioned would stay `true`.
		c.setOpen(false);
		c.clearFloating();
		flushSync();

		expect(c.isPositionedNow()).toBe(false);
	});

	// `const trackWhileMountedDeps = () => [middlewareOption, placementOption, strategyOption, sideOffsetOption, alignOffsetOption, openOption] as const;`
	test('trackWhileMountedDeps registers its array entries as deps (sideOffset re-runs the effect)', async () => {
		const whileMounted = vi.fn((_r: unknown, _f: unknown, update: () => void) => {
			update();
			return () => {};
		});
		const { component: c } = render(Fixture, { whileMounted });
		await settle();
		await settle(); // isPositioned settles, then hasWhileMountedPosition flips true

		const before = floatingMocks.computePosition.mock.calls.length;

		// `sideOffset` is read ONLY by trackWhileMountedDeps while open is true (update()'s
		// side-offset branch is gated behind `!openOption`). So a re-position here is possible
		// only if the array arrow registered sideOffset as a dependency of the while-mounted effect.
		c.setSideOffset(12);
		flushSync();
		await settle();

		expect(floatingMocks.computePosition.mock.calls.length).toBeGreaterThan(before);
	});
});
