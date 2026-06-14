export type PolygonSide = 'top' | 'bottom' | 'left' | 'right';
export type IntentTarget = 'trigger' | 'content';
export type Point = { x: number; y: number };
export type Polygon = Point[];

export function isPointInPolygon(point: Point, polygon: Polygon): boolean {
	const { x, y } = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i]!.x;
		const yi = polygon[i]!.y;
		const xj = polygon[j]!.x;
		const yj = polygon[j]!.y;
		// prettier-ignore
		const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
		if (intersect) inside = !inside;
	}
	return inside;
}

export function isInsideRect(point: Point, rect: DOMRect): boolean {
	return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}

export function isInsideInsetRect(point: Point, rect: DOMRect, inset: number): boolean {
	return point.x >= rect.left + inset && point.x <= rect.right - inset && point.y >= rect.top + inset && point.y <= rect.bottom - inset;
}

export function getSide(triggerRect: DOMRect, contentRect: DOMRect): PolygonSide {
	const triggerCenterX = triggerRect.left + triggerRect.width / 2;
	const triggerCenterY = triggerRect.top + triggerRect.height / 2;
	const contentCenterX = contentRect.left + contentRect.width / 2;
	const contentCenterY = contentRect.top + contentRect.height / 2;

	const deltaX = contentCenterX - triggerCenterX;
	const deltaY = contentCenterY - triggerCenterY;
	if (Math.abs(deltaX) > Math.abs(deltaY)) {
		return deltaX > 0 ? 'right' : 'left';
	}
	return deltaY > 0 ? 'bottom' : 'top';
}

export function getCorridorPolygon(triggerRect: DOMRect, contentRect: DOMRect, side: PolygonSide): Polygon {
	const buffer = 2;
	switch (side) {
		case 'top':
			return [
				{ x: Math.min(triggerRect.left, contentRect.left) - buffer, y: triggerRect.top },
				{ x: Math.min(triggerRect.left, contentRect.left) - buffer, y: contentRect.bottom },
				{
					x: Math.max(triggerRect.right, contentRect.right) + buffer,
					y: contentRect.bottom,
				},
				{ x: Math.max(triggerRect.right, contentRect.right) + buffer, y: triggerRect.top },
			];
		case 'bottom':
			return [
				{ x: Math.min(triggerRect.left, contentRect.left) - buffer, y: triggerRect.bottom },
				{ x: Math.min(triggerRect.left, contentRect.left) - buffer, y: contentRect.top },
				{ x: Math.max(triggerRect.right, contentRect.right) + buffer, y: contentRect.top },
				{
					x: Math.max(triggerRect.right, contentRect.right) + buffer,
					y: triggerRect.bottom,
				},
			];
		case 'left':
			return [
				{ x: triggerRect.left, y: Math.min(triggerRect.top, contentRect.top) - buffer },
				{ x: contentRect.right, y: Math.min(triggerRect.top, contentRect.top) - buffer },
				{
					x: contentRect.right,
					y: Math.max(triggerRect.bottom, contentRect.bottom) + buffer,
				},
				{
					x: triggerRect.left,
					y: Math.max(triggerRect.bottom, contentRect.bottom) + buffer,
				},
			];
		case 'right':
			return [
				{ x: triggerRect.right, y: Math.min(triggerRect.top, contentRect.top) - buffer },
				{ x: contentRect.left, y: Math.min(triggerRect.top, contentRect.top) - buffer },
				{
					x: contentRect.left,
					y: Math.max(triggerRect.bottom, contentRect.bottom) + buffer,
				},
				{
					x: triggerRect.right,
					y: Math.max(triggerRect.bottom, contentRect.bottom) + buffer,
				},
			];
	}
}

export function getIntentPolygon(exitPoint: Point, targetRect: DOMRect, side: PolygonSide, target: IntentTarget, sourceRect?: DOMRect): Polygon {
	const edgeBuffer = 8;
	const effectiveSide = target === 'trigger' ? flipSide(side) : side;

	const top = sourceRect ? Math.min(targetRect.top, sourceRect.top) - edgeBuffer : targetRect.top - edgeBuffer;
	const bottom = sourceRect ? Math.max(targetRect.bottom, sourceRect.bottom) + edgeBuffer : targetRect.bottom + edgeBuffer;
	const left = sourceRect ? Math.min(targetRect.left, sourceRect.left) - edgeBuffer : targetRect.left - edgeBuffer;
	const right = sourceRect ? Math.max(targetRect.right, sourceRect.right) + edgeBuffer : targetRect.right + edgeBuffer;

	switch (effectiveSide) {
		case 'right':
			return [exitPoint, { x: targetRect.left, y: top }, { x: targetRect.left, y: bottom }];
		case 'left':
			return [exitPoint, { x: targetRect.right, y: top }, { x: targetRect.right, y: bottom }];
		case 'bottom':
			return [exitPoint, { x: left, y: targetRect.top }, { x: right, y: targetRect.top }];
		case 'top':
			return [exitPoint, { x: left, y: targetRect.bottom }, { x: right, y: targetRect.bottom }];
	}
}

function flipSide(side: PolygonSide): PolygonSide {
	switch (side) {
		case 'top':
			return 'bottom';
		case 'bottom':
			return 'top';
		case 'left':
			return 'right';
		case 'right':
			return 'left';
	}
}
