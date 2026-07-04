import {
	attachRef,
	DOMContext,
	getDocument,
	getWindow,
	type ReadableBoxedValues,
	type WritableBoxedValues,
	simpleBox,
	boxWith,
	type ReadableBox,
} from '../../internal/tools/index.js';
import { mergeProps } from '../../internal/merge-props.js';
import { createContext, onDestroy, tick, untrack } from 'svelte';
import { SUB_OPEN_KEYS, getCheckedState, isMouseEvent } from './utils.js';
import { focusFirst } from '../../internal/focus.js';
import type {
	AnyFn,
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	OnChangeFn,
	RefAttachment,
	WithRefOpts,
} from '../../internal/types.js';
import { isElement, isElementOrSVGElement, isHTMLElement } from '@polumeyv/utilities/dom';
import { kbd, FIRST_LAST_KEYS, LAST_KEYS, SELECTION_KEYS } from '../../internal/kbd.js';
import {
	createBitsAttrs,
	getAriaChecked,
	boolToStr,
	getDataOpenClosed,
	boolToEmptyStrOrUndef,
	getDataTransitionAttrs,
} from '../../internal/attrs.js';
import type { Direction } from '../../internal/index.js';
import { useGlobalInputModality } from '../../internal/input-modality/input-modality.svelte.js';
import { getTabbableFrom, isTabbable } from '../../internal/tabbable.js';
import type { KeyboardEventHandler, PointerEventHandler, MouseEventHandler } from 'svelte/elements';
import { DOMTypeahead } from '../../internal/dom-typeahead.svelte.js';
import { RovingFocusGroup } from '../../internal/roving-focus-group.js';
import { PresenceManager } from '../../internal/presence-manager.svelte.js';
import { arraysAreEqual } from '../../internal/arrays.js';
import { on } from 'svelte/events';
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
} from '../../internal/hover-intent-geometry.js';

export const CONTEXT_MENU_TRIGGER_ATTR = 'data-context-menu-trigger';
export const CONTEXT_MENU_CONTENT_ATTR = 'data-context-menu-content';

const [getMenuRoot, setMenuRoot] = createContext<MenuRootState>();
const [getMenuMenu, setMenuMenu] = createContext<MenuMenuState>();
const [getMenuContent, setMenuContent] = createContext<MenuContentState>();
const [getMenuGroup, setMenuGroup] = createContext<MenuGroupState | MenuRadioGroupState>();
const [getMenuRadioGroup, setMenuRadioGroup] = createContext<MenuRadioGroupState>();
export const [getMenuCheckboxGroup, setMenuCheckboxGroup] = createContext<MenuCheckboxGroupState>();

const missingContextErrorUrl = 'https://svelte.dev/e/missing_context';

function getMenuRadioGroupOr<TFallback>(fallback: TFallback): MenuRadioGroupState | TFallback {
	try {
		return getMenuRadioGroup();
	} catch (error) {
		if (error instanceof Error && error.message.includes(missingContextErrorUrl)) return fallback;
		throw error;
	}
}

export function getMenuCheckboxGroupOr<TFallback>(fallback: TFallback): MenuCheckboxGroupState | TFallback {
	try {
		return getMenuCheckboxGroup();
	} catch (error) {
		if (error instanceof Error && error.message.includes(missingContextErrorUrl)) return fallback;
		throw error;
	}
}

type MenuVariant = 'context-menu' | 'dropdown-menu' | 'menubar';

export interface MenuRootStateOpts extends ReadableBoxedValues<{
	dir: Direction;
	variant: MenuVariant;
}> {
	onClose: AnyFn;
	/** When closing, if this returns true, exit animations are skipped (instant unmount). */
	shouldSkipExitAnimation?: () => boolean;
}

export const menuAttrs = createBitsAttrs({
	component: 'menu',
	parts: [
		'trigger',
		'content',
		'sub-trigger',
		'item',
		'group',
		'group-heading',
		'checkbox-group',
		'checkbox-item',
		'radio-group',
		'radio-item',
		'separator',
		'sub-content',
		'arrow',
	],
});

type Polygon = Point[];

// const SVG_NS = "http://www.w3.org/2000/svg";

export interface MenuSubmenuIntentOptions {
	enabled: () => boolean;
	triggerNode: () => HTMLElement | null;
	contentNode: () => HTMLElement | null;
	parentContentNode: () => HTMLElement | null;
	subContentSelector: () => string;
	onIntentExit: (pointerPoint: Point | null) => void;
	setIsPointerInTransit: (value: boolean) => void;
}

export class MenuSubmenuIntent {
	readonly #opts: MenuSubmenuIntentOptions;
	#cleanupDocMove: AnyFn | null = null;
	#fallbackTimer: ReturnType<typeof setTimeout> | null = null;
	#active = false;
	#target: TargetBits = TARGET_NONE;
	#apex: Point | null = null;
	#pointerPoint: Point | null = null;
	#launchPoint: Point | null = null;

	constructor(opts: MenuSubmenuIntentOptions) {
		this.#opts = opts;

		$effect(() => {
			const triggerNode = opts.triggerNode();
			const contentNode = opts.contentNode();
			const enabled = opts.enabled();
			return untrack(() => {
				this.#reset();
				if (!triggerNode || !contentNode || !enabled) return;

				const onTriggerMove = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					this.#launchPoint = [e.clientX, e.clientY];
					if (!this.#active) this.#preview(e, TARGET_CONTENT);
				};

				const onTriggerLeave = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					this.#engage(e, TARGET_CONTENT);
				};

				const onContentMove = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					if (!this.#active) this.#preview(e, TARGET_TRIGGER);
				};

				const onContentLeave = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					if (isElement(e.relatedTarget)) {
						const selector = this.#opts.subContentSelector();
						const matchedSubContent = e.relatedTarget.closest(selector);
						if (matchedSubContent && matchedSubContent !== contentNode && matchedSubContent.id) {
							const isChild = !!contentNode.querySelector(`[aria-controls="${matchedSubContent.id}"]`);
							if (isChild) {
								return;
							}
						}
					}
					this.#engage(e, TARGET_TRIGGER);
				};

				const onTriggerEnter = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					this.#disengage();
				};

				const onContentEnter = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					this.#disengage();
				};

				const cleanup = [
					on(triggerNode, 'pointermove', onTriggerMove),
					on(triggerNode, 'pointerleave', onTriggerLeave),
					on(triggerNode, 'pointerenter', onTriggerEnter),
					on(contentNode, 'pointermove', onContentMove),
					on(contentNode, 'pointerleave', onContentLeave),
					on(contentNode, 'pointerenter', onContentEnter),
				];

				return () => {
					cleanup.forEach((remove) => remove());
					this.#reset();
				};
			});
		});

		onDestroy(() => {
			this.#reset();
		});
	}

	#parentTargetRect(): DOMRect | null {
		const parent = this.#opts.parentContentNode();
		if (parent) return parent.getBoundingClientRect();
		return this.#opts.triggerNode()?.getBoundingClientRect() ?? null;
	}

	#computePolygons(
		pointerPt: Point,
		target: TargetBits,
	): {
		corridor: Polygon;
		intent: Polygon;
		targetRect: DOMRect;
		side: SideBits;
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

		if (target & TARGET_CONTENT) {
			apex = this.#active ? (this.#apex ?? pointerPt) : pointerPt;
			targetRect = contentRect;
		} else {
			apex = this.#launchPoint ?? pointerPt;
			targetRect = this.#parentTargetRect() ?? triggerRect;
			sourceRect = contentRect;
		}

		this.#apex = apex;

		return {
			// this file's corridor has always used a fixed buffer of 2 (distinct from
			// SafePolygon's configurable buffer), preserved explicitly here
			corridor: getCorridorPolygon(triggerRect, contentRect, side, 2),
			intent: getIntentPolygon(apex, targetRect, side, target, sourceRect),
			targetRect,
			side,
		};
	}

	#isInSafeZone(pt: Point, corridor: Polygon, intent: Polygon): boolean {
		return isPointInPolygon(pt, corridor) || isPointInPolygon(pt, intent);
	}

	#preview(e: PointerEvent, target: TargetBits) {
		const pt: Point = [e.clientX, e.clientY];
		const geo = this.#computePolygons(pt, target);
		if (!geo) return;

		this.#target = target;
		this.#pointerPoint = pt;
	}

	#engage(e: PointerEvent, target: TargetBits) {
		if (!this.#opts.enabled()) return;

		const triggerNode = this.#opts.triggerNode();
		const contentNode = this.#opts.contentNode();
		if (!triggerNode || !contentNode) return;

		const related = e.relatedTarget;
		if (isElement(related)) {
			if (target & TARGET_CONTENT && contentNode.contains(related)) return;
			if (target & TARGET_TRIGGER && triggerNode.contains(related)) return;
		}

		const pt: Point = [e.clientX, e.clientY];

		const geo = this.#computePolygons(pt, target);
		if (!geo) return;

		if (!isInsideRect(pt, geo.targetRect) && !this.#isInSafeZone(pt, geo.corridor, geo.intent)) {
			this.#clearVisuals();
			return;
		}

		this.#active = true;
		this.#target = target;
		this.#pointerPoint = pt;

		this.#opts.setIsPointerInTransit(true);
		this.#attachDocMove();
		this.#startFallback();
	}

	#disengageTimer: ReturnType<typeof setTimeout> | null = null;

	#disengage() {
		if (!this.#active) return;
		const wasReturning = (this.#target & TARGET_TRIGGER) !== 0;
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
		this.#target = TARGET_NONE;
		this.#apex = null;
		this.#pointerPoint = null;
		this.#launchPoint = null;
	}

	#isPointerInDescendantSubContent(pt: Point): boolean {
		const contentNode = this.#opts.contentNode();
		if (!contentNode) return false;
		const doc = contentNode.ownerDocument;
		const el = doc.elementFromPoint(pt[0], pt[1]);
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
		const pt: Point = [e.clientX, e.clientY];
		this.#pointerPoint = pt;

		const triggerRect = triggerNode.getBoundingClientRect();
		const contentRect = contentNode.getBoundingClientRect();
		if (this.#target & TARGET_CONTENT && isInsideRect(pt, contentRect)) {
			this.#disengage();
			return;
		}
		if (this.#target & TARGET_TRIGGER && isInsideInsetRect(pt, triggerRect, 4)) {
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
		const remove = on(doc, 'pointermove', this.#onDocMove, { capture: true });
		this.#cleanupDocMove = () => {
			remove();
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
		this.#target = TARGET_NONE;
		this.#apex = null;
		this.#pointerPoint = null;
	}

}

function isInsideInsetRect(point: Point, rect: DOMRect, inset: number): boolean {
	return point[0] >= rect.left + inset && point[0] <= rect.right - inset && point[1] >= rect.top + inset && point[1] <= rect.bottom - inset;
}

/**
 * The submenu-chain "intent" safe zone: a precise triangular cone from the exit point to the
 * target's near edge (optionally widened to also cover `sourceRect`, e.g. the content rect when
 * aiming back at a parent trigger). Deliberately narrower than SafePolygon's hexagonal safe zone —
 * densely-packed sibling menu items need more precision than a single floating trigger/content pair.
 */
function getIntentPolygon(exitPoint: Point, targetRect: DOMRect, side: SideBits, target: TargetBits, sourceRect?: DOMRect): Polygon {
	const edgeBuffer = 8;
	const effectiveSide = target & TARGET_TRIGGER ? flipSide(side) : side;

	const top = sourceRect ? Math.min(targetRect.top, sourceRect.top) - edgeBuffer : targetRect.top - edgeBuffer;
	const bottom = sourceRect ? Math.max(targetRect.bottom, sourceRect.bottom) + edgeBuffer : targetRect.bottom + edgeBuffer;
	const left = sourceRect ? Math.min(targetRect.left, sourceRect.left) - edgeBuffer : targetRect.left - edgeBuffer;
	const right = sourceRect ? Math.max(targetRect.right, sourceRect.right) + edgeBuffer : targetRect.right + edgeBuffer;

	const dir = effectiveSide & DIR_POS;

	if (effectiveSide & AXIS_VERTICAL) {
		// dir 0 = top (target is below the apex; cone opens toward targetRect.bottom), 1 = bottom
		const edgeY = dir === 0 ? targetRect.bottom : targetRect.top;
		return [exitPoint, [left, edgeY], [right, edgeY]];
	}
	// dir 0 = left (target is to the right; cone opens toward targetRect.right), 1 = right
	const edgeX = dir === 0 ? targetRect.right : targetRect.left;
	return [exitPoint, [edgeX, top], [edgeX, bottom]];
}

export class MenuRootState {
	static create(opts: MenuRootStateOpts) {
		const root = new MenuRootState(opts);
		return setMenuRoot(root);
	}

	readonly opts: MenuRootStateOpts;
	readonly inputModality = useGlobalInputModality();
	ignoreCloseAutoFocus = $state(false);
	isPointerInTransit = $state(false);

	constructor(opts: MenuRootStateOpts) {
		this.opts = opts;
	}

	getBitsAttr: typeof menuAttrs.getAttr = (part) => {
		return menuAttrs.getAttr(part, this.opts.variant.current);
	};
}

interface MenuMenuStateOpts
	extends
		WritableBoxedValues<{
			open: boolean;
		}>,
		ReadableBoxedValues<{
			onOpenChangeComplete: OnChangeFn<boolean>;
		}> {}

export class MenuMenuState {
	static create(opts: MenuMenuStateOpts, root: MenuRootState) {
		return setMenuMenu(new MenuMenuState(opts, root, null));
	}

	readonly opts: MenuMenuStateOpts;
	readonly root: MenuRootState;
	readonly parentMenu: MenuMenuState | null;
	contentId = boxWith<string>(() => '');
	contentNode = $state<HTMLElement | null>(null);
	contentPresence: PresenceManager;
	triggerNode = $state<HTMLElement | null>(null);
	/** Registered by the mounted content: keyboard-driven opens land focus on the first item. */
	focusFirstItem: (() => void) | null = null;

	constructor(opts: MenuMenuStateOpts, root: MenuRootState, parentMenu: MenuMenuState | null) {
		this.opts = opts;
		this.root = root;
		this.parentMenu = parentMenu;

		this.contentPresence = new PresenceManager({
			ref: boxWith(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
			shouldSkipExitAnimation: () => {
				if (this.root.opts.variant.current !== 'menubar' || this.parentMenu !== null) {
					return false;
				}
				return this.root.opts.shouldSkipExitAnimation?.() ?? false;
			},
		});

		if (parentMenu) {
			$effect(() => {
				parentMenu.opts.open.current;
				untrack(() => {
					if (parentMenu.opts.open.current) return;
					this.opts.open.current = false;
				});
			});
		}
	}

	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}

	onOpen() {
		this.opts.open.current = true;
	}

	onClose() {
		this.opts.open.current = false;
	}
}

interface MenuContentStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			loop: boolean;
			onCloseAutoFocus: (event: Event) => void;
		}> {
	isSub?: boolean;
}

export class MenuContentState {
	static create(opts: MenuContentStateOpts) {
		return setMenuContent(new MenuContentState(opts, getMenuMenu()));
	}

	readonly opts: MenuContentStateOpts;
	readonly parentMenu: MenuMenuState;
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly domContext: DOMContext;
	readonly attachment: RefAttachment;
	search = $state('');
	#timer = 0;
	#handleTypeaheadSearch: DOMTypeahead['handleTypeaheadSearch'];
	#isSub: boolean;

	constructor(opts: MenuContentStateOpts, parentMenu: MenuMenuState) {
		this.opts = opts;
		this.parentMenu = parentMenu;
		this.domContext = new DOMContext(opts.ref);
		this.attachment = attachRef(this.opts.ref, (v) => {
			if (this.parentMenu.contentNode !== v) {
				this.parentMenu.contentNode = v;
			}
		});

		parentMenu.contentId = opts.id;

		this.#isSub = opts.isSub ?? false;
		this.onkeydown = this.onkeydown.bind(this);
		this.onblur = this.onblur.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.handleInteractOutside = this.handleInteractOutside.bind(this);

		new MenuSubmenuIntent({
			contentNode: () => this.parentMenu.contentNode,
			triggerNode: () => this.parentMenu.triggerNode,
			parentContentNode: () => this.parentMenu.parentMenu?.contentNode ?? null,
			subContentSelector: () => `[${this.parentMenu.root.getBitsAttr('sub-content')}]`,
			enabled: () =>
				this.parentMenu.opts.open.current &&
				Boolean(this.parentMenu.triggerNode?.hasAttribute(this.parentMenu.root.getBitsAttr('sub-trigger'))),
			onIntentExit: (pointerPoint) => {
				this.parentMenu.opts.open.current = false;
				this.#dispatchPointerMoveToHoveredSubTrigger(pointerPoint);
			},
			setIsPointerInTransit: (value) => {
				this.parentMenu.root.isPointerInTransit = value;
			},
		});

		this.#handleTypeaheadSearch = new DOMTypeahead({
			getActiveElement: () => this.domContext.getActiveElement(),
			getWindow: () => this.domContext.getWindow(),
		}).handleTypeaheadSearch;
		this.rovingFocusGroup = new RovingFocusGroup({
			rootNode: boxWith(() => this.parentMenu.contentNode),
			candidateAttr: this.parentMenu.root.getBitsAttr('item'),
			loop: this.opts.loop,
			orientation: boxWith(() => 'vertical'),
		});

		$effect(() => {
			this.parentMenu.focusFirstItem = () => {
				tick().then(() => {
					if (!this.parentMenu.root.inputModality.isKeyboard) return;
					this.rovingFocusGroup.focusFirstCandidate();
				});
			};
			return () => {
				this.parentMenu.focusFirstItem = null;
			};
		});

		$effect(() => {
			if (!this.parentMenu.opts.open.current) {
				this.domContext.getWindow().clearTimeout(this.#timer);
			}
		});
	}

	#getCandidateNodes() {
		const node = this.parentMenu.contentNode;
		if (!node) return [];
		const candidates = Array.from(node.querySelectorAll<HTMLElement>(`[${this.parentMenu.root.getBitsAttr('item')}]:not([data-disabled])`));
		return candidates;
	}

	#isPointerMovingToSubmenu() {
		return this.parentMenu.root.isPointerInTransit;
	}

	#dispatchPointerMoveToHoveredSubTrigger(pointerPoint: Point | null) {
		if (!pointerPoint) return;
		const parentContentNode = this.parentMenu.parentMenu?.contentNode;
		if (!parentContentNode) return;
		const hoveredNode = this.domContext.getDocument().elementFromPoint(pointerPoint[0], pointerPoint[1]);
		if (!isElement(hoveredNode)) return;
		const hoveredSubTrigger = hoveredNode.closest<HTMLElement>(`[${this.parentMenu.root.getBitsAttr('sub-trigger')}]`);
		if (!hoveredSubTrigger || !parentContentNode.contains(hoveredSubTrigger)) return;
		if (hoveredSubTrigger === this.parentMenu.triggerNode) return;
		hoveredSubTrigger.dispatchEvent(
			new PointerEvent('pointermove', {
				bubbles: true,
				cancelable: true,
				pointerType: 'mouse',
				clientX: pointerPoint[0],
				clientY: pointerPoint[1],
			}),
		);
	}

	onCloseAutoFocus = (e: Event) => {
		this.opts.onCloseAutoFocus.current?.(e);
		if (e.defaultPrevented || this.#isSub) return;
		if (this.parentMenu.root.ignoreCloseAutoFocus) {
			e.preventDefault();
			return;
		}

		if (this.parentMenu.triggerNode && isTabbable(this.parentMenu.triggerNode)) {
			e.preventDefault();
			this.parentMenu.triggerNode.focus();
		}
	};

	handleTabKeyDown(e: BitsKeyboardEvent) {
		/**
		 * We locate the root `menu`'s trigger by going up the tree until
		 * we find a menu that has no parent. This will allow us to focus the next
		 * tabbable element before/after the root trigger.
		 */
		let rootMenu = this.parentMenu;
		while (rootMenu.parentMenu !== null) {
			rootMenu = rootMenu.parentMenu;
		}
		if (!rootMenu.triggerNode) return;
		e.preventDefault();
		const nodeToFocus = getTabbableFrom(rootMenu.triggerNode, e.shiftKey ? 'prev' : 'next');
		if (nodeToFocus) {
			/**
			 * We set a flag to ignore the `onCloseAutoFocus` event handler
			 * as well as the fallbacks inside the focus scope to prevent
			 * race conditions causing focus to fall back to the body even
			 * though we're trying to focus the next tabbable element.
			 */
			this.parentMenu.root.ignoreCloseAutoFocus = true;
			rootMenu.onClose();
			tick().then(() => {
				nodeToFocus.focus();
				tick().then(() => {
					this.parentMenu.root.ignoreCloseAutoFocus = false;
				});
			});
		} else {
			this.domContext.getDocument().body.focus();
		}
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.defaultPrevented) return;
		if (e.key === kbd.TAB) {
			this.handleTabKeyDown(e);
			return;
		}

		const target = e.target;
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(target) || !isHTMLElement(currentTarget)) return;

		const isKeydownInside = target.closest(`[${this.parentMenu.root.getBitsAttr('content')}]`)?.id === this.parentMenu.contentId.current;

		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
		const isCharacterKey = e.key.length === 1;

		const kbdFocusedEl = this.rovingFocusGroup.handleKeydown(target, e);
		if (kbdFocusedEl) return;

		// prevent space from being considered with typeahead
		if (e.code === 'Space') return;

		const candidateNodes = this.#getCandidateNodes();

		if (isKeydownInside) {
			if (!isModifierKey && isCharacterKey) {
				this.#handleTypeaheadSearch(e.key, candidateNodes);
			}
		}

		// focus first/last based on key pressed
		if ((e.target as HTMLElement)?.id !== this.parentMenu.contentId.current) return;

		if (!FIRST_LAST_KEYS.includes(e.key)) return;
		e.preventDefault();

		if (LAST_KEYS.includes(e.key)) {
			candidateNodes.reverse();
		}
		focusFirst(candidateNodes, { select: false }, () => this.domContext.getActiveElement());
	}

	onblur(e: BitsFocusEvent) {
		if (!isElement(e.currentTarget)) return;
		if (!isElement(e.target)) return;
		// clear search buffer when leaving the menu
		if (!e.currentTarget.contains?.(e.target)) {
			this.domContext.getWindow().clearTimeout(this.#timer);
			this.search = '';
		}
	}

	onfocus(_: BitsFocusEvent) {
		if (!this.parentMenu.root.inputModality.isKeyboard) return;
		tick().then(() => this.rovingFocusGroup.focusFirstCandidate());
	}

	onItemEnter() {
		return this.#isPointerMovingToSubmenu();
	}

	onItemLeave(e: BitsPointerEvent) {
		if (e.currentTarget.hasAttribute(this.parentMenu.root.getBitsAttr('sub-trigger'))) return;
		if (this.#isPointerMovingToSubmenu() || this.parentMenu.root.inputModality.isKeyboard) return;
		const contentNode = this.parentMenu.contentNode;
		contentNode?.focus({ preventScroll: true });
		this.rovingFocusGroup.setCurrentTabStopId('');
	}

	onTriggerLeave() {
		if (this.#isPointerMovingToSubmenu()) return true;
		return false;
	}

	handleInteractOutside(e: PointerEvent) {
		if (!isElementOrSVGElement(e.target)) return;
		const triggerId = this.parentMenu.triggerNode?.id;
		if (e.target.id === triggerId) {
			e.preventDefault();
			return;
		}
		if (e.target.closest(`#${triggerId}`)) {
			e.preventDefault();
			return;
		}
		/**
		 * when the menu closes due to an outside pointer interaction (for example,
		 * clicking another dropdown trigger), avoid focusing this menu's trigger
		 * to prevent stealing focus from the new interaction target.
		 */
		this.parentMenu.root.ignoreCloseAutoFocus = true;
		tick().then(() => {
			this.parentMenu.root.ignoreCloseAutoFocus = false;
		});
	}

	get shouldRender() {
		return this.parentMenu.contentPresence.shouldRender;
	}

	readonly snippetProps = $derived.by(() => ({ open: this.parentMenu.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'menu',
				'aria-orientation': 'vertical' as const,
				[this.parentMenu.root.getBitsAttr('content')]: '',
				'data-state': getDataOpenClosed(this.parentMenu.opts.open.current),
				...getDataTransitionAttrs(this.parentMenu.contentPresence.transitionStatus),
				onkeydown: this.onkeydown,
				onblur: this.onblur,
				onfocus: this.onfocus,
				dir: this.parentMenu.root.opts.dir.current,
				style: {
					pointerEvents: 'auto',
					contain: 'layout style',
				},
				...this.attachment,
			}) as const,
	);

	readonly popperProps = {
		onCloseAutoFocus: (e: Event) => this.onCloseAutoFocus(e),
	};
}

interface MenuItemSharedStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}> {}

class MenuItemSharedState {
	readonly opts: MenuItemSharedStateOpts;
	readonly content: MenuContentState;
	readonly attachment: RefAttachment;
	#isFocused = $state(false);

	constructor(opts: MenuItemSharedStateOpts, content: MenuContentState) {
		this.opts = opts;
		this.content = content;
		this.attachment = attachRef(this.opts.ref);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.onblur = this.onblur.bind(this);
	}

	onpointermove(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		if (!isMouseEvent(e)) return;

		if (this.opts.disabled.current) {
			this.content.onItemLeave(e);
		} else {
			const defaultPrevented = this.content.onItemEnter();
			if (defaultPrevented) return;
			const item = e.currentTarget;
			if (!isHTMLElement(item)) return;
			item.focus({ preventScroll: true });
		}
	}

	onpointerleave(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		if (!isMouseEvent(e)) return;
		this.content.onItemLeave(e);
	}

	onfocus(e: BitsFocusEvent) {
		tick().then(() => {
			if (e.defaultPrevented || this.opts.disabled.current) return;
			this.#isFocused = true;
		});
	}

	onblur(e: BitsFocusEvent) {
		tick().then(() => {
			if (e.defaultPrevented) return;
			this.#isFocused = false;
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				tabindex: -1,
				role: 'menuitem',
				'aria-disabled': boolToStr(this.opts.disabled.current),
				'data-disabled': boolToEmptyStrOrUndef(this.opts.disabled.current),
				'data-highlighted': this.#isFocused ? '' : undefined,
				[this.content.parentMenu.root.getBitsAttr('item')]: '',
				//
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
				onfocus: this.onfocus,
				onblur: this.onblur,
				...this.attachment,
			}) as const,
	);
}

type MenuItemCombinedProps = MenuItemSharedStateOpts & MenuItemStateOpts;

interface MenuItemStateOpts extends ReadableBoxedValues<{
	onSelect: AnyFn;
	closeOnSelect: boolean;
}> {}

export class MenuItemState {
	static create(opts: MenuItemCombinedProps) {
		const item = new MenuItemSharedState(opts, getMenuContent());
		return new MenuItemState(opts, item);
	}

	readonly opts: MenuItemStateOpts;
	readonly item: MenuItemSharedState;
	readonly root: MenuRootState;
	#isPointerDown = false;

	constructor(opts: MenuItemStateOpts, item: MenuItemSharedState) {
		this.opts = opts;
		this.item = item;
		this.root = item.content.parentMenu.root;

		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
	}

	#handleSelect() {
		if (this.item.opts.disabled.current) return;
		const selectEvent = new CustomEvent('menuitemselect', { bubbles: true, cancelable: true });
		this.opts.onSelect.current(selectEvent);
		if (selectEvent.defaultPrevented) {
			this.item.content.parentMenu.root.inputModality.reset();
			return;
		}
		if (this.opts.closeOnSelect.current) {
			this.item.content.parentMenu.root.opts.onClose();
		}
	}

	onkeydown(e: BitsKeyboardEvent) {
		const isTypingAhead = this.item.content.search !== '';
		if (this.item.opts.disabled.current || (isTypingAhead && e.key === kbd.SPACE)) return;
		if (SELECTION_KEYS.includes(e.key)) {
			if (!isHTMLElement(e.currentTarget)) return;
			e.currentTarget.click();
			/**
			 * We prevent default browser behavior for selection keys as they should trigger
			 * a selection only:
			 * - prevents space from scrolling the page.
			 * - if keydown causes focus to move, prevents keydown from firing on the new target.
			 */
			e.preventDefault();
		}
	}

	onclick(_: BitsMouseEvent) {
		if (this.item.opts.disabled.current) return;
		this.#handleSelect();
	}

	onpointerup(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		if (!this.#isPointerDown) {
			if (!isHTMLElement(e.currentTarget)) return;
			e.currentTarget?.click();
		}
	}

	onpointerdown(_: BitsPointerEvent) {
		this.#isPointerDown = true;
	}

	readonly props = $derived.by(() =>
		mergeProps(this.item.props, {
			onclick: this.onclick,
			onpointerdown: this.onpointerdown,
			onpointerup: this.onpointerup,
			onkeydown: this.onkeydown,
		}),
	);
}

interface MenuSubTriggerStateOpts extends MenuItemSharedStateOpts, Pick<MenuItemStateOpts, 'onSelect'> {
	openDelay: ReadableBox<number>;
}

export class MenuSubTriggerState {
	static create(opts: MenuSubTriggerStateOpts) {
		const content = getMenuContent();
		const item = new MenuItemSharedState(opts, content);
		const submenu = getMenuMenu();
		return new MenuSubTriggerState(opts, item, content, submenu);
	}
	readonly opts: MenuSubTriggerStateOpts;
	readonly item: MenuItemSharedState;
	readonly content: MenuContentState;
	readonly submenu: MenuMenuState;
	readonly attachment: RefAttachment;
	#openTimer: number | null = null;

	constructor(opts: MenuSubTriggerStateOpts, item: MenuItemSharedState, content: MenuContentState, submenu: MenuMenuState) {
		this.opts = opts;
		this.item = item;
		this.content = content;
		this.submenu = submenu;
		this.attachment = attachRef(this.opts.ref, (v) => (this.submenu.triggerNode = v));
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);

		onDestroy(() => {
			this.#clearOpenTimer();
		});
	}

	#clearOpenTimer() {
		if (this.#openTimer === null) return;
		this.content.domContext.getWindow().clearTimeout(this.#openTimer);
		this.#openTimer = null;
	}

	onpointermove(e: BitsPointerEvent) {
		if (!isMouseEvent(e)) return;
		if (this.submenu.root.isPointerInTransit) {
			if (this.#openTimer !== null) this.#clearOpenTimer();
			return;
		}

		if (!this.item.opts.disabled.current && !this.submenu.opts.open.current && !this.#openTimer) {
			const openDelay = this.opts.openDelay.current;

			if (openDelay <= 0) {
				this.submenu.onOpen();
				return;
			}

			this.#openTimer = this.content.domContext.setTimeout(() => {
				if (this.submenu.root.isPointerInTransit) {
					this.#clearOpenTimer();
					return;
				}

				this.submenu.onOpen();
				this.#clearOpenTimer();
			}, openDelay);
		}
	}

	onpointerleave(e: BitsPointerEvent) {
		if (!isMouseEvent(e)) return;
		this.#clearOpenTimer();
	}

	onkeydown(e: BitsKeyboardEvent) {
		const isTypingAhead = this.content.search !== '';
		if (this.item.opts.disabled.current || (isTypingAhead && e.key === kbd.SPACE)) return;

		if (SUB_OPEN_KEYS[this.submenu.root.opts.dir.current].includes(e.key)) {
			e.currentTarget.click();
			e.preventDefault();
		}
	}

	onclick(e: BitsMouseEvent) {
		if (this.item.opts.disabled.current) return;
		/**
		 * We manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
		 * and we rely heavily on `onFocusOutside` for submenus to close when switching
		 * between separate submenus.
		 */
		if (!isHTMLElement(e.currentTarget)) return;
		e.currentTarget.focus();
		const selectEvent = new CustomEvent('menusubtriggerselect', {
			bubbles: true,
			cancelable: true,
		});
		this.opts.onSelect.current(selectEvent);
		if (!this.submenu.opts.open.current) {
			this.submenu.onOpen();
			tick().then(() => {
				if (!this.submenu.contentNode) return;
				this.submenu.focusFirstItem?.();
			});
		}
	}

	readonly props = $derived.by(() =>
		mergeProps(
			{
				'aria-haspopup': 'menu',
				'aria-expanded': boolToStr(this.submenu.opts.open.current),
				'data-state': getDataOpenClosed(this.submenu.opts.open.current),
				'aria-controls': this.submenu.opts.open.current ? this.submenu.contentId.current : undefined,
				[this.submenu.root.getBitsAttr('sub-trigger')]: '',
				onclick: this.onclick,
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
				onkeydown: this.onkeydown,
				...this.attachment,
			},
			this.item.props,
		),
	);
}

interface MenuCheckboxItemStateOpts
	extends
		WritableBoxedValues<{
			checked: boolean;
			indeterminate: boolean;
		}>,
		ReadableBoxedValues<{
			value: string;
		}> {}

export class MenuCheckboxItemState {
	static create(opts: MenuItemCombinedProps & MenuCheckboxItemStateOpts, checkboxGroup: MenuCheckboxGroupState | null) {
		const item = new MenuItemState(opts, new MenuItemSharedState(opts, getMenuContent()));
		return new MenuCheckboxItemState(opts, item, checkboxGroup);
	}

	readonly opts: MenuCheckboxItemStateOpts;
	readonly item: MenuItemState;
	readonly group: MenuCheckboxGroupState | null;

	constructor(opts: MenuCheckboxItemStateOpts, item: MenuItemState, group: MenuCheckboxGroupState | null = null) {
		this.opts = opts;
		this.item = item;
		this.group = group;

		if (this.group) {
			/**
			 * Group -> item sync: external bind:value updates must drive each item's
			 * bind:checked state and ARIA state.
			 */
			$effect(() => {
				const groupValues = this.group!.opts.value.current;
				untrack(() => {
					this.opts.checked.current = groupValues.includes(this.opts.value.current);
				});
			});

			/**
			 * Item -> group sync: menu selection toggles write back into the controlled
			 * group value. addValue/removeValue are idempotent to avoid value-array churn.
			 */
			$effect(() => {
				const checked = this.opts.checked.current;
				untrack(() => {
					if (checked) {
						this.group!.addValue(this.opts.value.current);
					} else {
						this.group!.removeValue(this.opts.value.current);
					}
				});
			});
		}
	}

	toggleChecked() {
		if (this.opts.indeterminate.current) {
			this.opts.indeterminate.current = false;
			this.opts.checked.current = true;
		} else {
			this.opts.checked.current = !this.opts.checked.current;
		}
	}

	readonly snippetProps = $derived.by(() => ({
		checked: this.opts.checked.current,
		indeterminate: this.opts.indeterminate.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				...this.item.props,
				role: 'menuitemcheckbox',
				'aria-checked': getAriaChecked(this.opts.checked.current, this.opts.indeterminate.current),
				'data-state': getCheckedState(this.opts.checked.current),
				[this.item.root.getBitsAttr('checkbox-item')]: '',
			}) as const,
	);
}

interface MenuGroupStateOpts extends WithRefOpts {}

export class MenuGroupState {
	static create(opts: MenuGroupStateOpts) {
		return setMenuGroup(new MenuGroupState(opts, getMenuRoot()));
	}

	readonly opts: MenuGroupStateOpts;
	readonly root: MenuRootState;
	readonly attachment: RefAttachment;
	groupHeadingId = $state<string | undefined>(undefined);

	constructor(opts: MenuGroupStateOpts, root: MenuRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'group',
				'aria-labelledby': this.groupHeadingId,
				[this.root.getBitsAttr('group')]: '',
				...this.attachment,
			}) as const,
	);
}

interface MenuGroupHeadingStateOpts extends WithRefOpts {}

export class MenuGroupHeadingState {
	static create(opts: MenuGroupHeadingStateOpts) {
		// Try to get checkbox group first, then radio group, then regular group
		const checkboxGroup = getMenuCheckboxGroupOr(null);
		if (checkboxGroup) return new MenuGroupHeadingState(opts, checkboxGroup);

		const radioGroup = getMenuRadioGroupOr(null);
		if (radioGroup) return new MenuGroupHeadingState(opts, radioGroup);

		return new MenuGroupHeadingState(opts, getMenuGroup());
	}
	readonly opts: MenuGroupHeadingStateOpts;
	readonly group: MenuGroupState | MenuRadioGroupState | MenuCheckboxGroupState;
	readonly attachment: RefAttachment;

	constructor(opts: MenuGroupHeadingStateOpts, group: MenuGroupState | MenuRadioGroupState | MenuCheckboxGroupState) {
		this.opts = opts;
		this.group = group;
		this.attachment = attachRef(this.opts.ref, (v) => (this.group.groupHeadingId = v?.id));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'group',
				[this.group.root.getBitsAttr('group-heading')]: '',
				...this.attachment,
			}) as const,
	);
}

interface MenuSeparatorStateOpts extends WithRefOpts {}

export class MenuSeparatorState {
	static create(opts: MenuSeparatorStateOpts) {
		return new MenuSeparatorState(opts, getMenuRoot());
	}

	readonly opts: MenuSeparatorStateOpts;
	readonly root: MenuRootState;
	readonly attachment: RefAttachment;

	constructor(opts: MenuSeparatorStateOpts, root: MenuRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'group',
				[this.root.getBitsAttr('separator')]: '',
				...this.attachment,
			}) as const,
	);
}

export class MenuArrowState {
	static create() {
		return new MenuArrowState(getMenuRoot());
	}

	readonly root: MenuRootState;

	constructor(root: MenuRootState) {
		this.root = root;
	}

	readonly props = $derived.by(
		() =>
			({
				[this.root.getBitsAttr('arrow')]: '',
			}) as const,
	);
}

interface MenuRadioGroupStateOpts
	extends
		WithRefOpts,
		WritableBoxedValues<{
			value: string;
		}> {}

export class MenuRadioGroupState {
	static create(opts: MenuRadioGroupStateOpts) {
		return setMenuGroup(setMenuRadioGroup(new MenuRadioGroupState(opts, getMenuContent())));
	}
	readonly opts: MenuRadioGroupStateOpts;
	readonly content: MenuContentState;
	readonly attachment: RefAttachment;
	groupHeadingId = $state<string | null>(null);
	root: MenuRootState;

	constructor(opts: MenuRadioGroupStateOpts, content: MenuContentState) {
		this.opts = opts;
		this.content = content;
		this.root = content.parentMenu.root;
		this.attachment = attachRef(this.opts.ref);
	}

	setValue(v: string) {
		this.opts.value.current = v;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr('radio-group')]: '',
				role: 'group',
				'aria-labelledby': this.groupHeadingId,
				...this.attachment,
			}) as const,
	);
}

interface MenuRadioItemStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			value: string;
			closeOnSelect: boolean;
		}> {}

export class MenuRadioItemState {
	static create(opts: MenuRadioItemStateOpts & MenuItemCombinedProps) {
		const radioGroup = getMenuRadioGroup();
		const sharedItem = new MenuItemSharedState(opts, radioGroup.content);
		const item = new MenuItemState(opts, sharedItem);
		return new MenuRadioItemState(opts, item, radioGroup);
	}
	readonly opts: MenuRadioItemStateOpts;
	readonly item: MenuItemState;
	readonly group: MenuRadioGroupState;
	readonly attachment: RefAttachment;
	readonly isChecked = $derived.by(() => this.group.opts.value.current === this.opts.value.current);

	constructor(opts: MenuRadioItemStateOpts, item: MenuItemState, group: MenuRadioGroupState) {
		this.opts = opts;
		this.item = item;
		this.group = group;
		this.attachment = attachRef(this.opts.ref);
	}

	selectValue() {
		this.group.setValue(this.opts.value.current);
	}

	readonly props = $derived.by(
		() =>
			({
				[this.group.root.getBitsAttr('radio-item')]: '',
				...this.item.props,
				role: 'menuitemradio',
				'aria-checked': getAriaChecked(this.isChecked, false),
				'data-state': getCheckedState(this.isChecked),
				...this.attachment,
			}) as const,
	);
}

//
// DROPDOWN MENU TRIGGER
//

interface DropdownMenuTriggerStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}> {}

export class DropdownMenuTriggerState {
	static create(opts: DropdownMenuTriggerStateOpts) {
		return new DropdownMenuTriggerState(opts, getMenuMenu());
	}

	readonly opts: DropdownMenuTriggerStateOpts;
	readonly parentMenu: MenuMenuState;
	readonly attachment: RefAttachment;

	constructor(opts: DropdownMenuTriggerStateOpts, parentMenu: MenuMenuState) {
		this.opts = opts;
		this.parentMenu = parentMenu;
		this.attachment = attachRef(this.opts.ref, (v) => (this.parentMenu.triggerNode = v));
	}

	onclick: MouseEventHandler<HTMLElement> = (e) => {
		/**
		 * MacOS VoiceOver sends a click in Safari/Firefox bypassing the keydown event
		 * when V0+Space is pressed. Since we already handle the keydown event and the
		 * pointerdown events separately, we ignore it if the detail is not 0.
		 */
		if (this.opts.disabled.current || e.detail !== 0) return;
		this.parentMenu.toggleOpen();
		e.preventDefault();
	};

	onpointerdown: PointerEventHandler<HTMLElement> = (e) => {
		if (this.opts.disabled.current) return;
		if (e.pointerType === 'touch') return e.preventDefault();

		if (e.button === 0 && e.ctrlKey === false) {
			this.parentMenu.toggleOpen();
			// prevent trigger focusing when opening to allow
			// the content to be given focus without competition
			if (!this.parentMenu.opts.open.current) e.preventDefault();
		}
	};

	onpointerup: PointerEventHandler<HTMLElement> = (e) => {
		if (this.opts.disabled.current) return;
		if (e.pointerType === 'touch') {
			e.preventDefault();
			this.parentMenu.toggleOpen();
		}
	};

	onkeydown: KeyboardEventHandler<HTMLElement> = (e) => {
		if (this.opts.disabled.current) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			this.parentMenu.toggleOpen();
			e.preventDefault();
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			this.parentMenu.onOpen();
			e.preventDefault();
		}
	};

	readonly #ariaControls = $derived.by(() => {
		if (this.parentMenu.opts.open.current && this.parentMenu.contentId.current) return this.parentMenu.contentId.current;
		return undefined;
	});

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.opts.disabled.current,
				'aria-haspopup': 'menu',
				'aria-expanded': boolToStr(this.parentMenu.opts.open.current),
				'aria-controls': this.#ariaControls,
				'data-disabled': boolToEmptyStrOrUndef(this.opts.disabled.current),
				'data-state': getDataOpenClosed(this.parentMenu.opts.open.current),
				[this.parentMenu.root.getBitsAttr('trigger')]: '',
				//
				onclick: this.onclick,
				onpointerdown: this.onpointerdown,
				onpointerup: this.onpointerup,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);
}

interface ContextMenuTriggerStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}> {}

export class ContextMenuTriggerState {
	static create(opts: ContextMenuTriggerStateOpts) {
		return new ContextMenuTriggerState(opts, getMenuMenu());
	}

	readonly opts: ContextMenuTriggerStateOpts;
	readonly parentMenu: MenuMenuState;
	readonly attachment: RefAttachment;
	#point = $state({ x: 0, y: 0 });

	virtualElement = simpleBox({
		getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...this.#point }),
	});
	#longPressTimer: number | null = null;

	constructor(opts: ContextMenuTriggerStateOpts, parentMenu: MenuMenuState) {
		this.opts = opts;
		this.parentMenu = parentMenu;
		this.attachment = attachRef(this.opts.ref, (v) => (this.parentMenu.triggerNode = v));
		this.oncontextmenu = this.oncontextmenu.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointercancel = this.onpointercancel.bind(this);
		this.onpointerup = this.onpointerup.bind(this);

		$effect(() => {
			const point = this.#point;
			untrack(() => {
				this.virtualElement.current = {
					getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...point }),
				};
			});
		});

		$effect(() => {
			const isDisabled = this.opts.disabled.current;
			untrack(() => {
				if (isDisabled) {
					this.#clearLongPressTimer();
				}
			});
		});

		onDestroy(() => this.#clearLongPressTimer());
	}

	#clearLongPressTimer() {
		if (this.#longPressTimer === null) return;
		getWindow(this.opts.ref.current).clearTimeout(this.#longPressTimer);
	}

	#handleOpen(e: BitsMouseEvent | BitsPointerEvent) {
		this.#point = { x: e.clientX, y: e.clientY };
		this.parentMenu.onOpen();
	}

	oncontextmenu(e: BitsMouseEvent) {
		if (e.defaultPrevented || this.opts.disabled.current) return;

		this.#clearLongPressTimer();
		this.#handleOpen(e);
		e.preventDefault();
		this.parentMenu.contentNode?.focus();
	}

	onpointerdown(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
		this.#longPressTimer = getWindow(this.opts.ref.current).setTimeout(() => this.#handleOpen(e), 700);
	}

	onpointermove(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	onpointercancel(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	onpointerup(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.opts.disabled.current,
				'data-disabled': boolToEmptyStrOrUndef(this.opts.disabled.current),
				'data-state': getDataOpenClosed(this.parentMenu.opts.open.current),
				[CONTEXT_MENU_TRIGGER_ATTR]: '',
				tabindex: -1,
				onpointerdown: this.onpointerdown,
				onpointermove: this.onpointermove,
				onpointercancel: this.onpointercancel,
				onpointerup: this.onpointerup,
				oncontextmenu: this.oncontextmenu,
				...this.attachment,
			}) as const,
	);
}

interface MenuCheckboxGroupStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			onValueChange: (value: string[]) => void;
		}>,
		WritableBoxedValues<{
			value: string[];
		}> {}

export class MenuCheckboxGroupState {
	static create(opts: MenuCheckboxGroupStateOpts) {
		return setMenuCheckboxGroup(new MenuCheckboxGroupState(opts, getMenuContent()));
	}

	readonly opts: MenuCheckboxGroupStateOpts;
	readonly content: MenuContentState;
	readonly root: MenuRootState;
	readonly attachment: RefAttachment;
	groupHeadingId = $state<string | null>(null);

	constructor(opts: MenuCheckboxGroupStateOpts, content: MenuContentState) {
		this.opts = opts;
		this.content = content;
		this.root = content.parentMenu.root;
		this.attachment = attachRef(this.opts.ref);
	}

	addValue(checkboxValue: string | undefined) {
		if (!checkboxValue) return;
		if (!this.opts.value.current.includes(checkboxValue)) {
			const newValue = [...$state.snapshot(this.opts.value.current), checkboxValue];
			this.opts.value.current = newValue;
			if (arraysAreEqual(this.opts.value.current, newValue)) return;
			this.opts.onValueChange.current(newValue);
		}
	}

	removeValue(checkboxValue: string | undefined) {
		if (!checkboxValue) return;
		const index = this.opts.value.current.indexOf(checkboxValue);
		if (index === -1) return;
		const newValue = this.opts.value.current.filter((v) => v !== checkboxValue);
		this.opts.value.current = newValue;
		if (arraysAreEqual(this.opts.value.current, newValue)) return;
		this.opts.onValueChange.current(newValue);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr('checkbox-group')]: '',
				role: 'group',
				'aria-labelledby': this.groupHeadingId,
				...this.attachment,
			}) as const,
	);
}

export class MenuSubmenuState {
	static create(opts: MenuMenuStateOpts) {
		const menu = getMenuMenu();
		return setMenuMenu(new MenuMenuState(opts, menu.root, menu));
	}
}
