import { PRECISION } from '../constants.js';
import type { PaneConstraints } from '../types.js';
import { compareNumbersWithTolerance } from './compare.js';

/**
 * If the pane is collapsible, snaps below-min sizes to `collapsedSize` or
 * `minSize` based on the halfway point; otherwise clamps to `minSize`.
 */
const getAdjustedSizeForCollapsible = (size: number, collapsible: boolean | undefined, collapsedSize: number, minSize: number) =>
	!collapsible ? minSize : compareNumbersWithTolerance(size, (collapsedSize + minSize) / 2) < 0 ? collapsedSize : minSize;

/** Resizes a pane based on its constraints. */
export const resizePane = ({
	paneConstraints,
	paneIndex,
	initialSize,
}: {
	paneConstraints: PaneConstraints[];
	paneIndex: number;
	initialSize: number;
}): number => {
	const constraints = paneConstraints[paneIndex];
	if (!constraints) return initialSize;
	const { collapsedSize = 0, collapsible, maxSize = 100, minSize = 0 } = constraints;

	const size =
		compareNumbersWithTolerance(initialSize, minSize) < 0
			? getAdjustedSizeForCollapsible(initialSize, collapsible, collapsedSize, minSize)
			: initialSize;
	return Number(Math.min(maxSize, size).toFixed(PRECISION));
};
