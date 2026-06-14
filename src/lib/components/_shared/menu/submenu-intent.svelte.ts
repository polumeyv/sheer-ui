import { untrack } from 'svelte';
import { getDocument } from '$lib/vendor/index';
import type { AnyFn } from '$lib/vendor/types';
import { isMouseEvent } from '$lib/components/_shared/menu/utils';
import {
	getCorridorPolygon,
	getIntentPolygon,
	getSide,
	isInsideInsetRect,
	isInsideRect,
	isPointInPolygon,
	type IntentTarget,
	type Point,
	type Polygon,
	type PolygonSide,
} from '$lib/components/_shared/menu/geometry';

// const SVG_NS = "http://www.w3.org/2000/svg";

export interface MenuSubmenuIntentOptions {
	enabled: () => boolean;
	triggerNode: () => HTMLElement | null;
	contentNode: () => HTMLElement | null;
	parentContentNode: () => HTMLElement | null;
	subContentSelector: () => string;
	// debugMode: () => boolean;
	onIntentExit: (pointerPoint: Point | null) => void;
	setIsPointerInTransit: (value: boolean) => void;
}

/*
interface MenuIntentDebugSnapshot {
	active: boolean;
	target: IntentTarget | null;
	exitPoint: Point | null;
	pointerPoint: Point | null;
	corridor: Polygon | null;
	intentPolygon: Polygon | null;
}

class MenuIntentDebugOverlay {
	readonly #enabled: () => boolean;
	readonly #getDocument: () => Document | null;
	#root: HTMLDivElement | null = null;
	#corridorPolygon: SVGPolygonElement | null = null;
	#intentPolygon: SVGPolygonElement | null = null;
	#exitPoint: SVGCircleElement | null = null;
	#pointerPoint: SVGCircleElement | null = null;

	constructor(opts: { enabled: () => boolean; getDocument: () => Document | null }) {
		this.#enabled = opts.enabled;
		this.#getDocument = opts.getDocument;
	}

	update(state: MenuIntentDebugSnapshot) {
		if (!this.#enabled()) {
			this.#detach();
			return;
		}
		this.#ensureRoot();
		if (!this.#root) return;

		if (!state.active || !state.corridor || !state.intentPolygon || !state.exitPoint) {
			this.#root.style.display = "none";
			return;
		}

		const color = state.target === "trigger" ? "16 185 129" : "59 130 246";
		const strokeColor = `rgb(${color})`;
		const fillColor = `rgb(${color} / 0.18)`;
		const corridorFill = `rgb(${color} / 0.1)`;

		this.#root.style.display = "block";
		this.#setPolygon(this.#corridorPolygon, state.corridor, corridorFill, strokeColor, 1.5);
		this.#setPolygon(this.#intentPolygon, state.intentPolygon, fillColor, strokeColor, 2);
		this.#setPoint(this.#exitPoint, state.exitPoint, strokeColor, 5);
		this.#setPoint(
			this.#pointerPoint,
			state.pointerPoint,
			"rgb(15 23 42 / 0.9)",
			4,
			"rgb(255 255 255 / 0.95)"
		);
	}

	destroy() {
		this.#detach();
	}

	#setPolygon(
		node: SVGPolygonElement | null,
		points: Polygon | null,
		fill: string,
		stroke: string,
		strokeWidth: number
	) {
		if (!node || !points || points.length === 0) return;
		node.setAttribute("points", polygonToSvgPoints(points));
		node.setAttribute("fill", fill);
		node.setAttribute("stroke", stroke);
		node.setAttribute("stroke-width", `${strokeWidth}`);
		node.setAttribute("stroke-dasharray", "6 4");
	}

	#setPoint(
		node: SVGCircleElement | null,
		point: Point | null,
		fill: string,
		radius: number,
		stroke = "transparent"
	) {
		if (!node || !point) return;
		node.setAttribute("cx", `${point.x}`);
		node.setAttribute("cy", `${point.y}`);
		node.setAttribute("r", `${radius}`);
		node.setAttribute("fill", fill);
		node.setAttribute("stroke", stroke);
		node.setAttribute("stroke-width", "1.5");
	}

	#ensureRoot() {
		if (this.#root) return;
		const doc = this.#getDocument();
		if (!doc?.body) return;

		const root = doc.createElement("div");
		root.setAttribute("aria-hidden", "true");
		root.style.position = "fixed";
		root.style.inset = "0";
		root.style.pointerEvents = "none";
		root.style.zIndex = "2147483647";
		root.style.display = "none";

		const svg = doc.createElementNS(SVG_NS, "svg");
		svg.setAttribute("width", "100%");
		svg.setAttribute("height", "100%");
		svg.style.overflow = "visible";

		const corridorPolygon = doc.createElementNS(SVG_NS, "polygon");
		const intentPolygon = doc.createElementNS(SVG_NS, "polygon");
		const exitPoint = doc.createElementNS(SVG_NS, "circle");
		const pointerPoint = doc.createElementNS(SVG_NS, "circle");

		svg.append(corridorPolygon, intentPolygon, exitPoint, pointerPoint);
		root.append(svg);
		doc.body.append(root);

		this.#root = root;
		this.#corridorPolygon = corridorPolygon;
		this.#intentPolygon = intentPolygon;
		this.#exitPoint = exitPoint;
		this.#pointerPoint = pointerPoint;
	}

	#detach() {
		this.#root?.remove();
		this.#root = null;
		this.#corridorPolygon = null;
		this.#intentPolygon = null;
		this.#exitPoint = null;
		this.#pointerPoint = null;
	}
}
*/

export class MenuSubmenuIntent {
	readonly #opts: MenuSubmenuIntentOptions;
	// readonly #debugOverlay: MenuIntentDebugOverlay;
	#cleanupDocMove: AnyFn | null = null;
	#fallbackTimer: ReturnType<typeof setTimeout> | null = null;
	#active = false;
	#target: IntentTarget | null = null;
	#apex: Point | null = null;
	#pointerPoint: Point | null = null;
	// #corridor: Polygon | null = null;
	// #intentPolygon: Polygon | null = null;
	#launchPoint: Point | null = null;

	constructor(opts: MenuSubmenuIntentOptions) {
		this.#opts = opts;
		// this.#debugOverlay = new MenuIntentDebugOverlay({
		// 	enabled: () => this.#opts.debugMode(),
		// 	getDocument: () => getDocument(this.#opts.triggerNode() ?? this.#opts.contentNode()),
		// });

		$effect(() => {
			const [triggerNode, contentNode, enabled] = [opts.triggerNode(), opts.contentNode(), opts.enabled()];
			return untrack(() => {
				this.#reset();
				if (!triggerNode || !contentNode || !enabled) return;

				const onTriggerMove = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					this.#launchPoint = { x: e.clientX, y: e.clientY };
					if (!this.#active) this.#preview(e, 'content');
				};

				const onTriggerLeave = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					this.#engage(e, 'content');
				};

				const onContentMove = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					if (!this.#active) this.#preview(e, 'trigger');
				};

				const onContentLeave = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					if (e.relatedTarget instanceof Element) {
						const selector = this.#opts.subContentSelector();
						const matchedSubContent = e.relatedTarget.closest(selector);
						if (matchedSubContent && matchedSubContent !== contentNode && matchedSubContent.id) {
							const isChild = !!contentNode.querySelector(`[aria-controls="${matchedSubContent.id}"]`);
							if (isChild) {
								return;
							}
						}
					}
					this.#engage(e, 'trigger');
				};

				const onTriggerEnter = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					this.#disengage();
				};

				const onContentEnter = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					this.#disengage();
				};

				triggerNode.addEventListener('pointermove', onTriggerMove);
				triggerNode.addEventListener('pointerleave', onTriggerLeave);
				triggerNode.addEventListener('pointerenter', onTriggerEnter);
				contentNode.addEventListener('pointermove', onContentMove);
				contentNode.addEventListener('pointerleave', onContentLeave);
				contentNode.addEventListener('pointerenter', onContentEnter);

				return () => {
					triggerNode.removeEventListener('pointermove', onTriggerMove);
					triggerNode.removeEventListener('pointerleave', onTriggerLeave);
					triggerNode.removeEventListener('pointerenter', onTriggerEnter);
					contentNode.removeEventListener('pointermove', onContentMove);
					contentNode.removeEventListener('pointerleave', onContentLeave);
					contentNode.removeEventListener('pointerenter', onContentEnter);
					this.#reset();
				};
			});
		});

		$effect(() => () => {
			this.#reset();
			// this.#debugOverlay.destroy();
		});
	}

	#parentTargetRect(): DOMRect | null {
		const parent = this.#opts.parentContentNode();
		if (parent) return parent.getBoundingClientRect();
		return this.#opts.triggerNode()?.getBoundingClientRect() ?? null;
	}

	#computePolygons(
		pointerPt: Point,
		target: IntentTarget,
	): {
		corridor: Polygon;
		intent: Polygon;
		targetRect: DOMRect;
		side: PolygonSide;
	} | null {
		const triggerNode = this.#opts.triggerNode();
		const contentNode = this.#opts.contentNode();
		if (!triggerNode || !contentNode) return null;

		const triggerRect = triggerNode.getBoundingClientRect();
		const contentRect = contentNode.getBoundingClientRect();
		const side = getSide(triggerRect, contentRect);

		let apex: Point;
		let targetRect: DOMRect;

		let sourceRect: DOMRect | undefined;

		if (target === 'content') {
			apex = this.#active ? (this.#apex ?? pointerPt) : pointerPt;
			targetRect = contentRect;
		} else {
			apex = this.#launchPoint ?? pointerPt;
			targetRect = this.#parentTargetRect() ?? triggerRect;
			sourceRect = contentRect;
		}

		this.#apex = apex;

		return {
			corridor: getCorridorPolygon(triggerRect, contentRect, side),
			intent: getIntentPolygon(apex, targetRect, side, target, sourceRect),
			targetRect,
			side,
		};
	}

	#isInSafeZone(pt: Point, corridor: Polygon, intent: Polygon): boolean {
		return isPointInPolygon(pt, corridor) || isPointInPolygon(pt, intent);
	}

	#preview(e: PointerEvent, target: IntentTarget) {
		const pt = { x: e.clientX, y: e.clientY };
		const geo = this.#computePolygons(pt, target);
		if (!geo) return;

		this.#target = target;
		this.#pointerPoint = pt;
		// this.#corridor = geo.corridor;
		// this.#intentPolygon = geo.intent;
		// this.#syncDebug();
	}

	#engage(e: PointerEvent, target: IntentTarget) {
		if (!this.#opts.enabled()) return;

		const triggerNode = this.#opts.triggerNode();
		const contentNode = this.#opts.contentNode();
		if (!triggerNode || !contentNode) return;

		const related = e.relatedTarget;
		if (related instanceof Element) {
			if (target === 'content' && contentNode.contains(related)) return;
			if (target === 'trigger' && triggerNode.contains(related)) return;
		}

		const pt = { x: e.clientX, y: e.clientY };

		const geo = this.#computePolygons(pt, target);
		if (!geo) return;

		if (!isInsideRect(pt, geo.targetRect) && !this.#isInSafeZone(pt, geo.corridor, geo.intent)) {
			this.#clearVisuals();
			return;
		}

		this.#active = true;
		this.#target = target;
		this.#pointerPoint = pt;
		// this.#corridor = geo.corridor;
		// this.#intentPolygon = geo.intent;

		this.#opts.setIsPointerInTransit(true);
		this.#attachDocMove();
		this.#startFallback();
		// this.#syncDebug();
	}

	#disengageTimer: ReturnType<typeof setTimeout> | null = null;

	#disengage() {
		if (!this.#active) return;
		const wasReturning = this.#target === 'trigger';
		this.#detachDocMove();
		this.#clearFallback();
		this.#active = false;
		this.#clearVisuals();

		if (wasReturning) {
			this.#clearDisengageTimer();
			this.#disengageTimer = setTimeout(() => {
				this.#disengageTimer = null;
				this.#opts.setIsPointerInTransit(false);
			}, 100);
		} else {
			this.#opts.setIsPointerInTransit(false);
		}
	}

	#clearDisengageTimer() {
		if (this.#disengageTimer === null) return;
		clearTimeout(this.#disengageTimer);
		this.#disengageTimer = null;
	}

	#intentExit() {
		const pointerPoint = this.#pointerPoint;
		this.#detachDocMove();
		this.#clearFallback();
		this.#clearDisengageTimer();
		this.#active = false;
		this.#opts.setIsPointerInTransit(false);
		this.#clearVisuals();
		this.#opts.onIntentExit(pointerPoint);
	}

	#reset() {
		this.#detachDocMove();
		this.#clearFallback();
		this.#clearDisengageTimer();
		if (this.#active) this.#opts.setIsPointerInTransit(false);
		this.#active = false;
		this.#target = null;
		this.#apex = null;
		this.#pointerPoint = null;
		// this.#corridor = null;
		// this.#intentPolygon = null;
		this.#launchPoint = null;
		// this.#syncDebug();
	}

	#isPointerInDescendantSubContent(pt: Point): boolean {
		const contentNode = this.#opts.contentNode();
		if (!contentNode) return false;
		const doc = contentNode.ownerDocument;
		const el = doc.elementFromPoint(pt.x, pt.y);
		if (!el) return false;
		const selector = this.#opts.subContentSelector();
		const subContent = el.closest(selector);
		if (!subContent || subContent === contentNode) return false;
		if (subContent.id) return !!contentNode.querySelector(`[aria-controls="${subContent.id}"]`);
		return false;
	}

	#onDocMove = (e: PointerEvent) => {
		if (!this.#active || !this.#target) return;
		if (!isMouseEvent(e)) return;

		const triggerNode = this.#opts.triggerNode();
		const contentNode = this.#opts.contentNode();
		if (!triggerNode || !contentNode) {
			this.#intentExit();
			return;
		}

		this.#clearFallback();
		const pt = { x: e.clientX, y: e.clientY };
		this.#pointerPoint = pt;

		const triggerRect = triggerNode.getBoundingClientRect();
		const contentRect = contentNode.getBoundingClientRect();
		if (this.#target === 'content' && isInsideRect(pt, contentRect)) {
			this.#disengage();
			return;
		}
		if (this.#target === 'trigger' && isInsideInsetRect(pt, triggerRect, 4)) {
			this.#disengage();
			return;
		}

		if (this.#isPointerInDescendantSubContent(pt)) {
			this.#startFallback();
			return;
		}

		const geo = this.#computePolygons(pt, this.#target);
		if (!geo) {
			this.#intentExit();
			return;
		}

		// this.#corridor = geo.corridor;
		// this.#intentPolygon = geo.intent;
		// this.#syncDebug();

		if (this.#isInSafeZone(pt, geo.corridor, geo.intent)) {
			this.#startFallback();
			return;
		}

		this.#intentExit();
	};

	#attachDocMove() {
		if (this.#cleanupDocMove) return;
		const doc = getDocument(this.#opts.triggerNode() ?? this.#opts.contentNode());
		if (!doc) return;
		doc.addEventListener('pointermove', this.#onDocMove, true);
		this.#cleanupDocMove = () => {
			doc.removeEventListener('pointermove', this.#onDocMove, true);
			this.#cleanupDocMove = null;
		};
	}

	#detachDocMove() {
		this.#cleanupDocMove?.();
	}

	#startFallback() {
		this.#clearFallback();
		this.#fallbackTimer = setTimeout(() => {
			this.#fallbackTimer = null;
			if (this.#active) this.#intentExit();
		}, 500);
	}

	#clearFallback() {
		if (this.#fallbackTimer === null) return;
		clearTimeout(this.#fallbackTimer);
		this.#fallbackTimer = null;
	}

	#clearVisuals() {
		this.#target = null;
		this.#apex = null;
		this.#pointerPoint = null;
		// this.#corridor = null;
		// this.#intentPolygon = null;
		// this.#syncDebug();
	}

	/*
	#syncDebug() {
		this.#debugOverlay.update({
			active: this.#active || this.#corridor !== null,
			target: this.#target,
			exitPoint: this.#apex,
			pointerPoint: this.#pointerPoint,
			corridor: this.#corridor,
			intentPolygon: this.#intentPolygon,
		});
	}
	*/
}

/*
function polygonToSvgPoints(points: Polygon): string {
	return points.map((point) => `${point.x},${point.y}`).join(" ");
}
*/
