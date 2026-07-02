import type { PaneConstraints } from '../types.js';
import { assert } from './assert.js';
import { areNumbersAlmostEqual, compareNumbersWithTolerance } from './compare.js';
import { resizePane } from './resize.js';

/**
 * Adjusts the layout of panes based on the delta of the resize handle.
 * All units must be in percentages; pixel values should be pre-converted.
 *
 * Credit: https://github.com/bvaughn/react-resizable-panels
 */
export function adjustLayoutByDelta({
	delta,
	layout: prevLayout,
	paneConstraints,
	pivotIndices: [firstPivotIndex, secondPivotIndex],
	trigger,
}: {
	delta: number;
	layout: number[];
	paneConstraints: PaneConstraints[];
	pivotIndices: number[];
	trigger: 'imperative-api' | 'keyboard' | 'mouse-or-touch';
}): number[] {
	if (areNumbersAlmostEqual(delta, 0)) return prevLayout;

	const nextLayout = [...prevLayout];
	const safeSize = (paneIndex: number, initialSize: number) => resizePane({ paneConstraints, paneIndex, initialSize });

	// Keyboard resizes snap collapsible panes through their full collapsed<->min transition,
	// rather than gating on the halfway threshold (which could prevent expansion entirely).
	if (trigger === 'keyboard')
		for (const expand of [true, false]) {
			const index = delta < 0 === expand ? secondPivotIndex : firstPivotIndex;
			const constraints = paneConstraints[index];
			assert(constraints);
			if (!constraints.collapsible) continue;

			const { collapsedSize = 0, minSize = 0 } = constraints;
			const prevSize = prevLayout[index];
			assert(prevSize != null);
			if (!areNumbersAlmostEqual(prevSize, expand ? collapsedSize : minSize)) continue;

			const localDelta = expand ? minSize - prevSize : prevSize - collapsedSize;
			if (compareNumbersWithTolerance(localDelta, Math.abs(delta)) > 0) delta = delta < 0 ? -localDelta : localDelta;
		}

	// Clamp the requested delta to the max the panes opposite the pivot can actually yield.
	{
		const increment = delta < 0 ? 1 : -1;
		let maxAvailableDelta = 0;
		for (let index = delta < 0 ? secondPivotIndex : firstPivotIndex; index >= 0 && index < paneConstraints.length; index += increment) {
			const prevSize = prevLayout[index];
			assert(prevSize != null);
			maxAvailableDelta += safeSize(index, 100) - prevSize;
		}
		const minAbsDelta = Math.min(Math.abs(delta), Math.abs(maxAvailableDelta));
		delta = delta < 0 ? -minAbsDelta : minAbsDelta;
	}

	// Subtract the delta from panes on one side of the pivot, within their constraints.
	let deltaApplied = 0;
	{
		let index = delta < 0 ? firstPivotIndex : secondPivotIndex;
		while (index >= 0 && index < paneConstraints.length) {
			const prevSize = prevLayout[index];
			assert(prevSize != null);

			const next = safeSize(index, prevSize - (Math.abs(delta) - Math.abs(deltaApplied)));
			if (!areNumbersAlmostEqual(prevSize, next)) {
				deltaApplied += prevSize - next;
				nextLayout[index] = next;

				if (deltaApplied.toPrecision(3).localeCompare(Math.abs(delta).toPrecision(3), undefined, { numeric: true }) >= 0) break;
			}
			index += delta < 0 ? -1 : 1;
		}
	}

	// Nothing moved — bail (e.g. drag past a pane's boundary).
	if (areNumbersAlmostEqual(deltaApplied, 0)) return prevLayout;

	// Add the applied delta to the pivot pane on the other side.
	{
		const pivotIndex = delta < 0 ? secondPivotIndex : firstPivotIndex;
		const prevSize = prevLayout[pivotIndex];
		assert(prevSize != null);

		const unsafeSize = prevSize + deltaApplied;
		const size = safeSize(pivotIndex, unsafeSize);
		nextLayout[pivotIndex] = size;

		// Expanding/contracting one pane flipped another's collapsed state — redistribute the remainder.
		if (!areNumbersAlmostEqual(size, unsafeSize)) {
			let deltaRemaining = unsafeSize - size;
			let index = pivotIndex;
			while (index >= 0 && index < paneConstraints.length) {
				const prevSize = nextLayout[index];
				assert(prevSize != null);

				const next = safeSize(index, prevSize + deltaRemaining);
				if (!areNumbersAlmostEqual(prevSize, next)) {
					deltaRemaining -= next - prevSize;
					nextLayout[index] = next;
				}
				if (areNumbersAlmostEqual(deltaRemaining, 0)) break;
				index += delta > 0 ? -1 : 1;
			}
		}
	}

	const totalSize = nextLayout.reduce((total, size) => total + size, 0);
	return areNumbersAlmostEqual(totalSize, 100) ? nextLayout : prevLayout;
}
