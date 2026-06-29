import { type Getter, getDocument } from '$lib/internal/tools/index.js';
import { on } from 'svelte/events';
import { isElement } from '@polumeyv/utilities/dom';
import type { Side } from '$lib/components/utilities/floating-layer/use-floating-layer.svelte.js';

type Point = [number, number];

function isPointInPolygon(point: Point, polygon: Point[]): boolean {
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

function isInsideRect(point: Point, rect: DOMRect): boolean {
	return point[0] >= rect.left && point[0] <= rect.right && point[1] >= rect.top && point[1] <= rect.bottom;
}

function getSide(triggerRect: DOMRect, contentRect: DOMRect): Side {
	// determine which side the content is on relative to trigger
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

export interface SafePolygonOptions {
	enabled: Getter<boolean>;
	triggerNode: Getter<HTMLElement | null>;
	contentNode: Getter<HTMLElement | null>;
	onPointerExit: () => void;
	buffer?: number;
	transitIntentTimeout?: number;
	/** nodes that should not trigger a close when they become the relatedTarget on trigger leave (e.g. sibling triggers in singleton mode) */
	ignoredTargets?: Getter<HTMLElement[]>;
}

/**
 * Creates a safe polygon area that allows users to move their cursor between
 * the trigger and floating content without closing it.
 */
export class SafePolygon {
	readonly #opts: SafePolygonOptions;
	readonly #buffer: number;
	readonly #transitIntentTimeout: number | null;

	// tracks the cursor position when leaving trigger or content
	#exitPoint: Point | null = null;
	// tracks what we're moving toward: "content" when leaving trigger, "trigger" when leaving content
	#exitTarget: 'trigger' | 'content' | null = null;
	#transitTargets: HTMLElement[] = [];
	#trackedTriggerNode: HTMLElement | null = null;
	#leaveFallbackRafId: number | null = null;
	#transitIntentTimeoutId: number | null = null;

	#cancelLeaveFallback() {
		if (this.#leaveFallbackRafId !== null) {
			cancelAnimationFrame(this.#leaveFallbackRafId);
			this.#leaveFallbackRafId = null;
		}
	}

	#scheduleLeaveFallback() {
		this.#cancelLeaveFallback();
		this.#leaveFallbackRafId = requestAnimationFrame(() => {
			this.#leaveFallbackRafId = null;
			if (!this.#exitPoint || !this.#exitTarget) return;
			this.#clearTracking();
			this.#opts.onPointerExit();
		});
	}

	#cancelTransitIntentTimeout() {
		if (this.#transitIntentTimeoutId !== null) {
			clearTimeout(this.#transitIntentTimeoutId);
			this.#transitIntentTimeoutId = null;
		}
	}

	#scheduleTransitIntentTimeout() {
		if (this.#transitIntentTimeout === null) return;
		this.#cancelTransitIntentTimeout();
		this.#transitIntentTimeoutId = window.setTimeout(() => {
			this.#transitIntentTimeoutId = null;
			if (!this.#exitPoint || !this.#exitTarget) return;
			this.#clearTracking();
			this.#opts.onPointerExit();
		}, this.#transitIntentTimeout);
	}

	constructor(opts: SafePolygonOptions) {
		this.#opts = opts;
		this.#buffer = opts.buffer ?? 1;
		const transitIntentTimeout = opts.transitIntentTimeout;
		this.#transitIntentTimeout = typeof transitIntentTimeout === 'number' && transitIntentTimeout > 0 ? transitIntentTimeout : null;

		$effect(() => {
			const triggerNode = opts.triggerNode();
			const contentNode = opts.contentNode();
			const enabled = opts.enabled();
			if (!triggerNode || !contentNode || !enabled) {
				this.#trackedTriggerNode = null;
				this.#clearTracking();
				return;
			}
			if (this.#trackedTriggerNode && this.#trackedTriggerNode !== triggerNode) {
				this.#clearTracking();
			}
			this.#trackedTriggerNode = triggerNode;

			const doc = getDocument(triggerNode);

			return [
				on(doc, 'pointermove', (e) => this.#onPointerMove([e.clientX, e.clientY], triggerNode, contentNode)),
				on(triggerNode, 'pointerleave', (e) => {
					// when leaving trigger toward content, record exit point
					const target = e.relatedTarget;
					// if going directly to content, no need for polygon tracking
					if (isElement(target) && contentNode.contains(target)) {
						return;
					}
					// if moving to an ignored target (e.g. a sibling trigger), don't close —
					// the sibling's enter handler will take over
					const ignoredTargets = this.#opts.ignoredTargets?.() ?? [];
					if (isElement(target) && ignoredTargets.some((n) => n === target || n.contains(target))) {
						return;
					}
					this.#transitTargets = isElement(target) && ignoredTargets.length > 0 ? ignoredTargets.filter((n) => target.contains(n)) : [];
					// for unrelated elements, defer close decisions to pointer geometry checks.
					// this allows the cursor to pass through intermediate elements on the way
					// to content without immediately closing.
					this.#exitPoint = [e.clientX, e.clientY];
					this.#exitTarget = 'content';
					this.#scheduleLeaveFallback();
				}),
				on(triggerNode, 'pointerenter', () => {
					// reached trigger, clear tracking
					this.#clearTracking();
				}),
				on(contentNode, 'pointerenter', () =>
					// reached content, clear tracking
					this.#clearTracking(),
				),
				on(contentNode, 'pointerleave', (e) => {
					// when leaving content, check if going directly back to trigger
					const target = e.relatedTarget;
					if (isElement(target) && triggerNode.contains(target)) {
						// going directly to trigger, no polygon tracking needed
						return;
					}
					// set up polygon tracking toward trigger — pointermove decides whether to close
					this.#exitPoint = [e.clientX, e.clientY];
					this.#exitTarget = 'trigger';
					this.#scheduleLeaveFallback();
				}),
			].reduce(
				(acc, cleanup) => () => {
					acc();
					cleanup();
				},
				() => {},
			);
		});
	}

	#onPointerMove(clientPoint: Point, triggerNode: HTMLElement, contentNode: HTMLElement): void {
		const exitPoint = this.#exitPoint;
		const exitTarget = this.#exitTarget;
		if (!exitPoint || !exitTarget) return;

		this.#cancelLeaveFallback();
		this.#scheduleTransitIntentTimeout();

		const triggerRect = triggerNode.getBoundingClientRect();
		const contentRect = contentNode.getBoundingClientRect();
		const targetRect = exitTarget === 'content' ? contentRect : triggerRect;

		if (isInsideRect(clientPoint, targetRect)) {
			this.#clearTracking();
			return;
		}

		if (exitTarget === 'content') {
			for (const transitTarget of this.#transitTargets) {
				const transitRect = transitTarget.getBoundingClientRect();

				if (isInsideRect(clientPoint, transitRect)) return;

				const transitSide = getSide(triggerRect, transitRect);
				const transitCorridor = this.#getCorridorPolygon(triggerRect, transitRect, transitSide);

				if (isPointInPolygon(clientPoint, transitCorridor)) return;
			}
		}

		const side = getSide(triggerRect, contentRect);
		const corridor = this.#getCorridorPolygon(triggerRect, contentRect, side);

		if (isPointInPolygon(clientPoint, corridor)) return;

		const safePolygon = this.#getSafePolygon(exitPoint, targetRect, side, exitTarget);

		if (isPointInPolygon(clientPoint, safePolygon)) return;

		this.#clearTracking();
		this.#opts.onPointerExit();
	}

	#clearTracking() {
		this.#exitPoint = null;
		this.#exitTarget = null;
		this.#transitTargets = [];
		this.#cancelLeaveFallback();
		this.#cancelTransitIntentTimeout();
	}

	/**
	 * Creates a rectangular corridor between trigger and content
	 * This prevents closing when cursor is in the gap between them
	 */
	#getCorridorPolygon(triggerRect: DOMRect, contentRect: DOMRect, side: Side): Point[] {
		const b = this.#buffer;

		const minX = Math.min(triggerRect.left, contentRect.left) - b;
		const maxX = Math.max(triggerRect.right, contentRect.right) + b;
		const minY = Math.min(triggerRect.top, contentRect.top) - b;
		const maxY = Math.max(triggerRect.bottom, contentRect.bottom) + b;

		switch (side) {
			case 'top':
				return [
					[minX, triggerRect.top],
					[minX, contentRect.bottom],
					[maxX, contentRect.bottom],
					[maxX, triggerRect.top],
				];

			case 'bottom':
				return [
					[minX, triggerRect.bottom],
					[minX, contentRect.top],
					[maxX, contentRect.top],
					[maxX, triggerRect.bottom],
				];

			case 'left':
				return [
					[triggerRect.left, minY],
					[contentRect.right, minY],
					[contentRect.right, maxY],
					[triggerRect.left, maxY],
				];

			case 'right':
				return [
					[triggerRect.right, minY],
					[contentRect.left, minY],
					[contentRect.left, maxY],
					[triggerRect.right, maxY],
				];
		}
	}
	/**
	 * Creates a triangular/trapezoidal safe zone from the exit point to the target.
	 */
	#getSafePolygon(exitPoint: Point, targetRect: DOMRect, side: Side, exitTarget: 'trigger' | 'content'): Point[] {
		const b = this.#buffer * 4;
		const [x, y] = exitPoint;
		const { top, right, bottom, left } = targetRect;

		const effectiveSide = exitTarget === 'trigger' ? this.#flipSide(side) : side;

		switch (effectiveSide) {
			case 'top':
				return [
					[x - b, y + b],
					[x + b, y + b],
					[right + b, bottom],
					[right + b, top],
					[left - b, top],
					[left - b, bottom],
				];

			case 'bottom':
				return [
					[x - b, y - b],
					[x + b, y - b],
					[right + b, top],
					[right + b, bottom],
					[left - b, bottom],
					[left - b, top],
				];

			case 'left':
				return [
					[x + b, y - b],
					[x + b, y + b],
					[right, bottom + b],
					[left, bottom + b],
					[left, top - b],
					[right, top - b],
				];

			case 'right':
				return [
					[x - b, y - b],
					[x - b, y + b],
					[left, bottom + b],
					[right, bottom + b],
					[right, top - b],
					[left, top - b],
				];
		}
	}

	#flipSide(side: Side): Side {
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
}
