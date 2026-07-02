import { describe, expect, test } from 'bun:test';
import { flipSide, getCorridorPolygon, getSide, isInsideRect, isPointInPolygon, LEFT, RIGHT, TOP, BOTTOM } from './hover-intent-geometry';

function rect(left: number, top: number, right: number, bottom: number): DOMRect {
	return {
		left,
		top,
		right,
		bottom,
		width: right - left,
		height: bottom - top,
		x: left,
		y: top,
		toJSON() {
			return this;
		},
	};
}

describe('isPointInPolygon', () => {
	test('a point inside a square is inside', () => {
		const square = [
			[0, 0],
			[10, 0],
			[10, 10],
			[0, 10],
		] as [number, number][];
		expect(isPointInPolygon([5, 5], square)).toBe(true);
	});

	test('a point outside a square is outside', () => {
		const square = [
			[0, 0],
			[10, 0],
			[10, 10],
			[0, 10],
		] as [number, number][];
		expect(isPointInPolygon([50, 50], square)).toBe(false);
	});
});

describe('isInsideRect', () => {
	test('a point inside the rect bounds is inside', () => {
		expect(isInsideRect([5, 5], rect(0, 0, 10, 10))).toBe(true);
	});

	test('a point outside the rect bounds is outside', () => {
		expect(isInsideRect([50, 50], rect(0, 0, 10, 10))).toBe(false);
	});

	test('a point exactly on the boundary counts as inside', () => {
		expect(isInsideRect([10, 10], rect(0, 0, 10, 10))).toBe(true);
	});
});

describe('getSide', () => {
	test('content to the right of trigger is RIGHT', () => {
		expect(getSide(rect(0, 0, 10, 10), rect(100, 0, 110, 10))).toBe(RIGHT);
	});

	test('content to the left of trigger is LEFT', () => {
		expect(getSide(rect(100, 0, 110, 10), rect(0, 0, 10, 10))).toBe(LEFT);
	});

	test('content below trigger is BOTTOM', () => {
		expect(getSide(rect(0, 0, 10, 10), rect(0, 100, 10, 110))).toBe(BOTTOM);
	});

	test('content above trigger is TOP', () => {
		expect(getSide(rect(0, 100, 10, 110), rect(0, 0, 10, 10))).toBe(TOP);
	});
});

describe('flipSide', () => {
	test('flips each side to its opposite', () => {
		expect(flipSide(TOP)).toBe(BOTTOM);
		expect(flipSide(BOTTOM)).toBe(TOP);
		expect(flipSide(LEFT)).toBe(RIGHT);
		expect(flipSide(RIGHT)).toBe(LEFT);
	});
});

describe('getCorridorPolygon', () => {
	test('for a RIGHT side, spans the vertical gap between trigger and content with the buffer applied', () => {
		const triggerRect = rect(0, 0, 10, 10);
		const contentRect = rect(20, 0, 30, 10);
		const corridor = getCorridorPolygon(triggerRect, contentRect, RIGHT, 2);
		// corridor should cover the horizontal band between the two rects, inclusive of buffer
		expect(isPointInPolygon([15, 5], corridor)).toBe(true);
		// a point far outside the vertical extent of either rect is not in the corridor
		expect(isPointInPolygon([15, 500], corridor)).toBe(false);
	});

	test('a larger buffer widens the corridor', () => {
		const triggerRect = rect(0, 0, 10, 10);
		const contentRect = rect(20, 0, 30, 10);
		const narrow = getCorridorPolygon(triggerRect, contentRect, RIGHT, 1);
		const wide = getCorridorPolygon(triggerRect, contentRect, RIGHT, 50);
		// a point just past the narrow buffer's edge is outside narrow but inside wide
		expect(isPointInPolygon([15, 30], narrow)).toBe(false);
		expect(isPointInPolygon([15, 30], wide)).toBe(true);
	});
});
