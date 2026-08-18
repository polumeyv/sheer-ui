import type { PaneState } from '../../paneforge.svelte.js';

/**
 * Calculates `aria-valuemax`/`aria-valuemin`/`aria-valuenow` for the pane at
 * `pivotIndices[0]`, accounting for the min/max sizes of all other panes.
 */
export const calculateAriaValues = ({
	layout,
	panesArray,
	pivotIndices: [firstIndex],
}: {
	layout: number[];
	panesArray: PaneState[];
	pivotIndices: number[];
}) => {
	let currentMinSize = 0;
	let currentMaxSize = 100;
	let totalMinSize = 0;
	let totalMaxSize = 0;

	panesArray.forEach(({ constraints: { maxSize = 100, minSize = 0 } }, i) => {
		if (i === firstIndex) {
			currentMinSize = minSize;
			currentMaxSize = maxSize;
		} else {
			totalMinSize += minSize;
			totalMaxSize += maxSize;
		}
	});

	return {
		valueMax: Math.min(currentMaxSize, 100 - totalMinSize),
		valueMin: Math.max(currentMinSize, 100 - totalMaxSize),
		valueNow: layout[firstIndex!],
	};
};
