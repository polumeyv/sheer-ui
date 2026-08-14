import type { Getter } from './tools/index.js';
import { on } from 'svelte/events';
import { isElement } from './tools/utils/dom.js';
import {
	AXIS_VERTICAL,
	DIR_POS,
	type Point,
	type SideBits,
	TARGET_CONTENT,
	TARGET_NONE,
	TARGET_TRIGGER,
	type TargetBits,
	flipSide,
	getCorridorPolygon,
	getSide,
	isInsideRect,
	isPointInPolygon,
} from './hover-intent-geometry.js';

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
	// tracks what we're moving toward
	#exitTarget: TargetBits = TARGET_NONE;
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

			const doc = triggerNode.ownerDocument;

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
					this.#exitTarget = TARGET_CONTENT;
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
					this.#exitTarget = TARGET_TRIGGER;
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
		const targetRect = exitTarget & TARGET_CONTENT ? contentRect : triggerRect;

		if (isInsideRect(clientPoint, targetRect)) {
			this.#clearTracking();
			return;
		}

		if (exitTarget & TARGET_CONTENT) {
			for (const transitTarget of this.#transitTargets) {
				const transitRect = transitTarget.getBoundingClientRect();

				if (isInsideRect(clientPoint, transitRect)) return;

				const transitSide = getSide(triggerRect, transitRect);
				const transitCorridor = getCorridorPolygon(triggerRect, transitRect, transitSide, this.#buffer);

				if (isPointInPolygon(clientPoint, transitCorridor)) return;
			}
		}

		const side = getSide(triggerRect, contentRect);
		const corridor = getCorridorPolygon(triggerRect, contentRect, side, this.#buffer);

		if (isPointInPolygon(clientPoint, corridor)) return;

		const safePolygon = this.#getSafePolygon(exitPoint, targetRect, side, exitTarget);

		if (isPointInPolygon(clientPoint, safePolygon)) return;

		this.#clearTracking();
		this.#opts.onPointerExit();
	}

	#clearTracking() {
		this.#exitPoint = null;
		this.#exitTarget = TARGET_NONE;
		this.#transitTargets = [];
		this.#cancelLeaveFallback();
		this.#cancelTransitIntentTimeout();
	}

	/**
	 * Creates a triangular/trapezoidal safe zone from the exit point to the target.
	 */
	#getSafePolygon(exitPoint: Point, targetRect: DOMRect, side: SideBits, exitTarget: TargetBits): Point[] {
		const b = this.#buffer * 4;
		const [x, y] = exitPoint;
		const { top, right, bottom, left } = targetRect;

		const effectiveSide = exitTarget & TARGET_TRIGGER ? flipSide(side) : side;
		const dir = effectiveSide & DIR_POS;
		const sign = dir === 0 ? 1 : -1;

		if (effectiveSide & AXIS_VERTICAL) {
			const edgeNear = dir === 0 ? bottom : top;
			const edgeFar = dir === 0 ? top : bottom;
			return [
				[x - b, y + sign * b],
				[x + b, y + sign * b],
				[right + b, edgeNear],
				[right + b, edgeFar],
				[left - b, edgeFar],
				[left - b, edgeNear],
			];
		}

		const edgeNear = dir === 0 ? right : left;
		const edgeFar = dir === 0 ? left : right;
		return [
			[x + sign * b, y - b],
			[x + sign * b, y + b],
			[edgeNear, bottom + b],
			[edgeFar, bottom + b],
			[edgeFar, top - b],
			[edgeNear, top - b],
		];
	}
}
