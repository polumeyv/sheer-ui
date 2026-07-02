/**
 * Shared pointer-geometry primitives for "don't close while the cursor is moving toward the
 * content" hover tracking. Both `SafePolygon` (tooltip/popover/link-preview) and `MenuSubmenuIntent`
 * (nested menu chains, in menu.svelte.ts) need this exact math. It's kept in the bitmask+tuple
 * representation SafePolygon originated (cheap integer comparisons instead of string comparisons on
 * every pointermove) rather than a more "readable" string+object form — this runs on pointer-move
 * frequency, and the bits are the performant version worth converging on.
 *
 * Deliberately excludes the "safe zone" shape builders (getSafePolygon / getIntentPolygon): those are
 * genuinely different algorithms (a forgiving hexagon vs a precise triangle) driven by different
 * domain requirements — a single floating trigger/content pair vs densely-packed sibling menu items —
 * not incidental duplication, so each keeps its own.
 */

export type Point = [number, number];

export const AXIS_VERTICAL = 0b10;
export const DIR_POS = 0b01;

export const LEFT = 0b00;
export const RIGHT = 0b01;
export const TOP = 0b10;
export const BOTTOM = 0b11;

export type SideBits = typeof LEFT | typeof RIGHT | typeof TOP | typeof BOTTOM;

export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
	const [x, y] = point;
	let isInside = false;
	const length = polygon.length;
	for (let i = 0, j = length - 1; i < length; j = i++) {
		const [xi, yi] = polygon[i] ?? [0, 0];
		const [xj, yj] = polygon[j] ?? [0, 0];
		const intersect = yi >= y !== yj >= y && x <= ((xj - xi) * (y - yi)) / (yj - yi) + xi;
		if (intersect) {
			isInside = !isInside;
		}
	}
	return isInside;
}

export function isInsideRect(point: Point, rect: DOMRect): boolean {
	return point[0] >= rect.left && point[0] <= rect.right && point[1] >= rect.top && point[1] <= rect.bottom;
}

export function getSide(triggerRect: DOMRect, contentRect: DOMRect): SideBits {
	// determine which side the content is on relative to trigger
	const dx = contentRect.left + contentRect.width / 2 - (triggerRect.left + triggerRect.width / 2);
	const dy = contentRect.top + contentRect.height / 2 - (triggerRect.top + triggerRect.height / 2);

	return Math.abs(dx) > Math.abs(dy)
		? ((dx > 0 ? DIR_POS : 0) as SideBits)
		: ((AXIS_VERTICAL | (dy > 0 ? DIR_POS : 0)) as SideBits);
}

export function flipSide(side: SideBits): SideBits {
	return (side ^ DIR_POS) as SideBits;
}

export const TARGET_NONE = 0;
export const TARGET_TRIGGER = 0b01;
export const TARGET_CONTENT = 0b10;

export type TargetBits = typeof TARGET_NONE | typeof TARGET_TRIGGER | typeof TARGET_CONTENT;

/**
 * A rectangular corridor between trigger and content — this prevents closing when the cursor is in
 * the gap between them.
 */
export function getCorridorPolygon(triggerRect: DOMRect, contentRect: DOMRect, side: SideBits, buffer: number): Point[] {
	const b = buffer;

	const minX = Math.min(triggerRect.left, contentRect.left) - b;
	const maxX = Math.max(triggerRect.right, contentRect.right) + b;
	const minY = Math.min(triggerRect.top, contentRect.top) - b;
	const maxY = Math.max(triggerRect.bottom, contentRect.bottom) + b;

	const dir = side & DIR_POS;

	if (side & AXIS_VERTICAL) {
		const triggerY = dir === 0 ? triggerRect.top : triggerRect.bottom;
		const contentY = dir === 0 ? contentRect.bottom : contentRect.top;
		return [
			[minX, triggerY],
			[minX, contentY],
			[maxX, contentY],
			[maxX, triggerY],
		];
	}

	const triggerX = dir === 0 ? triggerRect.left : triggerRect.right;
	const contentX = dir === 0 ? contentRect.right : contentRect.left;
	return [
		[triggerX, minY],
		[contentX, minY],
		[contentX, maxY],
		[triggerX, maxY],
	];
}
