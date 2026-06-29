import { createContext } from 'svelte';
import { createAttachmentKey, type Attachment } from 'svelte/attachments';
import { type Middleware, type Placement, arrow, autoUpdate, flip, hide, limitShift, offset, shift, size } from '@floating-ui/dom';
import {
	attachRef,
	cssToStyleObj,
	getWindow,
	styleToString,
	type ReadableBoxedValues,
	type ReadableBox,
	type RefAttachment,
	type Box,
	simpleBox,
	boxFrom,
	boxWith,
} from '$lib/internal/tools/index.js';
import type { Arrayable, WithRefOpts } from '$lib/internal/types.js';
import { isNotNull } from '@polumeyv/utilities/dom';
import { useId } from '$lib/internal/use-id.js';
import { useFloating } from '$lib/internal/floating-svelte/use-floating.svelte.js';
import type { Measurable, UseFloatingReturn } from '$lib/internal/floating-svelte/types.js';
import type { Direction, StyleProperties } from '$lib/internal/index.js';

export const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const;
export const ALIGN_OPTIONS = ['start', 'center', 'end'] as const;

const OPPOSITE_SIDE: Record<Side, Side> = {
	top: 'bottom',
	right: 'left',
	bottom: 'top',
	left: 'right',
};

const [getFloatingRoot, setFloatingRoot] = createContext<FloatingRootState>();
const [getFloatingContent, setFloatingContent] = createContext<FloatingContentState>();
const [getFloatingTooltipRoot, setFloatingTooltipRoot] = createContext<FloatingRootState>();

export type Side = (typeof SIDE_OPTIONS)[number];
export type Align = (typeof ALIGN_OPTIONS)[number];

export type Boundary = Element | null;
type AnchorNode = Measurable | HTMLElement | null;
type CustomAnchorNode = AnchorNode | string;

export class FloatingRootState {
	static create(tooltip = false) {
		return tooltip ? setFloatingTooltipRoot(new FloatingRootState()) : setFloatingRoot(new FloatingRootState());
	}
	#customAnchorSource = $state<ReadableBox<CustomAnchorNode>>(simpleBox(null));
	triggerSource = $state<ReadableBox<AnchorNode>>(simpleBox(null));
	anchorNode: ReadableBox<AnchorNode> = boxWith(() => {
		const customAnchor = this.#customAnchorSource.current;

		if (customAnchor) {
			if (typeof customAnchor === 'string') {
				if (typeof document === 'undefined') return null;
				return document.querySelector(customAnchor);
			}
			return customAnchor;
		}

		return this.triggerSource.current;
	});

	get triggerNode() {
		return this.triggerSource;
	}

	setCustomAnchorSource(source: ReadableBox<CustomAnchorNode>) {
		this.#customAnchorSource = source;
	}
}

export interface FloatingContentStateOpts extends ReadableBoxedValues<{
	id: string;
	wrapperId: string;
	side: Side;
	sideOffset: number;
	align: Align;
	alignOffset: number;
	arrowPadding: number;
	avoidCollisions: boolean;
	collisionBoundary: Arrayable<Boundary>;
	collisionPadding: number | Partial<Record<Side, number>>;
	sticky: 'partial' | 'always';
	hideWhenDetached: boolean;
	updatePositionStrategy: 'optimized' | 'always';
	strategy: 'fixed' | 'absolute';
	onPlaced: () => void;
	dir: Direction;
	style: StyleProperties | null | undefined | string;
	enabled: boolean;
	customAnchor: string | HTMLElement | null | Measurable;
}> {}

export class FloatingContentState {
	static create(opts: FloatingContentStateOpts, tooltip = false) {
		return tooltip
			? setFloatingContent(new FloatingContentState(opts, getFloatingTooltipRoot()))
			: setFloatingContent(new FloatingContentState(opts, getFloatingRoot()));
	}
	readonly opts: FloatingContentStateOpts;
	readonly root: FloatingRootState;

	#arrowWidth = $state(0);
	#arrowHeight = $state(0);

	// nodes
	contentRef = simpleBox<HTMLElement | null>(null);
	wrapperRef = simpleBox<HTMLElement | null>(null);
	arrowRef = simpleBox<HTMLElement | null>(null);
	readonly contentAttachment = attachRef(this.contentRef);
	readonly wrapperAttachment = attachRef(this.wrapperRef);
	readonly arrowAttachment = {
		...attachRef(this.arrowRef),
		[createAttachmentKey()]: ((node) => this.#measureArrow(node)) satisfies Attachment<HTMLElement>,
	};

	// ids
	arrowId: Box<string> = simpleBox(useId());

	#transformedStyle = $derived.by(() => {
		if (typeof this.opts.style === 'string') return cssToStyleObj(this.opts.style);
		if (!this.opts.style) return {};
	});

	#updatePositionStrategy = undefined as unknown as FloatingContentStateOpts['updatePositionStrategy'];
	#desiredPlacement = $derived.by(
		() => (this.opts.side?.current + (this.opts.align.current !== 'center' ? `-${this.opts.align.current}` : '')) as Placement,
	);
	#boundary = $derived.by(() =>
		Array.isArray(this.opts.collisionBoundary.current) ? this.opts.collisionBoundary.current : [this.opts.collisionBoundary.current],
	);
	hasExplicitBoundaries = $derived(this.#boundary.length > 0);
	detectOverflowOptions = $derived.by(() => ({
		padding: this.opts.collisionPadding.current,
		boundary: this.#boundary.filter(isNotNull),
		altBoundary: this.hasExplicitBoundaries,
	}));
	#availableWidth = $state<number | undefined>(undefined);
	#availableHeight = $state<number | undefined>(undefined);
	#anchorWidth = $state<number | undefined>(undefined);
	#anchorHeight = $state<number | undefined>(undefined);
	middleware: Middleware[] = $derived.by(
		() =>
			[
				offset({
					mainAxis: this.opts.sideOffset.current + this.#arrowHeight,
					alignmentAxis: this.opts.alignOffset.current,
				}),
				this.opts.avoidCollisions.current &&
					shift({
						mainAxis: true,
						crossAxis: false,
						limiter: this.opts.sticky.current === 'partial' ? limitShift() : undefined,
						...this.detectOverflowOptions,
					}),
				this.opts.avoidCollisions.current && flip({ ...this.detectOverflowOptions }),
				size({
					...this.detectOverflowOptions,
					apply: ({ rects, availableWidth, availableHeight }) => {
						const { width: anchorWidth, height: anchorHeight } = rects.reference;
						this.#availableWidth = availableWidth;
						this.#availableHeight = availableHeight;
						this.#anchorWidth = anchorWidth;
						this.#anchorHeight = anchorHeight;
					},
				}),
				this.arrowRef.current &&
					arrow({
						element: this.arrowRef.current,
						padding: this.opts.arrowPadding.current,
					}),
				transformOrigin({
					arrowWidth: this.#arrowWidth,
					arrowHeight: this.#arrowHeight,
				}),
				this.opts.hideWhenDetached.current && hide({ strategy: 'referenceHidden', ...this.detectOverflowOptions }),
			].filter(Boolean) as Middleware[],
	);
	floating: UseFloatingReturn;
	placedSide = $derived.by(() => getSideFromPlacement(this.floating.placement));
	placedAlign = $derived.by(() => getAlignFromPlacement(this.floating.placement));

	arrowX = $derived.by(() => this.floating.middlewareData.arrow?.x ?? 0);
	arrowY = $derived.by(() => this.floating.middlewareData.arrow?.y ?? 0);
	cannotCenterArrow = $derived.by(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
	contentZIndex = $state<string>();
	arrowBaseSide = $derived(OPPOSITE_SIDE[this.placedSide]);
	wrapperProps = $derived.by(
		() =>
			({
				id: this.opts.wrapperId.current,
				'data-bits-floating-content-wrapper': '',
				style: {
					...this.floating.floatingStyles,
					// keep off page when measuring
					transform: this.floating.isPositioned ? this.floating.floatingStyles.transform : 'translate(0, -200%)',
					minWidth: 'max-content',
					zIndex: this.contentZIndex,
					'--bits-floating-transform-origin': `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
					'--bits-floating-available-width': `${this.#availableWidth}px`,
					'--bits-floating-available-height': `${this.#availableHeight}px`,
					'--bits-floating-anchor-width': `${this.#anchorWidth}px`,
					'--bits-floating-anchor-height': `${this.#anchorHeight}px`,
					// hide the content if using the hide middleware and should be hidden
					...(this.floating.middlewareData.hide?.referenceHidden && {
						visibility: 'hidden',
						'pointer-events': 'none',
					}),
					...this.#transformedStyle,
				},
				// Floating UI calculates logical alignment based the `dir` attribute
				dir: this.opts.dir.current,
				...this.wrapperAttachment,
			}) as const,
	);
	props = $derived.by(
		() =>
			({
				'data-side': this.placedSide,
				'data-align': this.placedAlign,
				style: styleToString({
					...this.#transformedStyle,
				}),
				...this.contentAttachment,
			}) as const,
	);

	arrowStyle = $derived({
		position: 'absolute',
		left: this.arrowX ? `${this.arrowX}px` : undefined,
		top: this.arrowY ? `${this.arrowY}px` : undefined,
		[this.arrowBaseSide]: 0,
		'transform-origin': {
			top: '',
			right: '0 0',
			bottom: 'center 0',
			left: '100% 0',
		}[this.placedSide],
		transform: {
			top: 'translateY(100%)',
			right: 'translateY(50%) rotate(90deg) translateX(-50%)',
			bottom: 'rotate(180deg)',
			left: 'translateY(50%) rotate(-90deg) translateX(50%)',
		}[this.placedSide],
		visibility: this.cannotCenterArrow ? 'hidden' : undefined,
	});

	constructor(opts: FloatingContentStateOpts, root: FloatingRootState) {
		this.opts = opts;
		this.root = root;
		this.#updatePositionStrategy = opts.updatePositionStrategy;
		this.root.setCustomAnchorSource(opts.customAnchor);

		this.floating = useFloating({
			strategy: () => this.opts.strategy.current,
			placement: () => this.#desiredPlacement,
			middleware: () => this.middleware,
			reference: this.root.anchorNode,
			whileElementsMounted: (...args) => {
				const cleanup = autoUpdate(...args, {
					animationFrame: this.#updatePositionStrategy?.current === 'always',
				});
				return cleanup;
			},
			open: () => this.opts.enabled.current,
			sideOffset: () => this.opts.sideOffset.current,
			alignOffset: () => this.opts.alignOffset.current,
		});

		$effect(() => {
			if (!this.floating.isPositioned) return;
			this.opts.onPlaced?.current();
		});

		// Feed the rendered wrapper element into useFloating. Without this the floating element
		// stays null, computePosition never runs, and the content is stuck off-screen.
		$effect(() => {
			this.floating.floating.current = this.wrapperRef.current;
		});
	}

	#measureArrow(arrowNode: HTMLElement) {
		this.#arrowWidth = 0;
		this.#arrowHeight = 0;

		const win = getWindow(arrowNode);
		let active = true;

		const measure = () => {
			if (!active) return;

			this.#arrowWidth = arrowNode.offsetWidth;
			this.#arrowHeight = arrowNode.offsetHeight;
			this.floating.update();
		};

		measure();

		const observer = new win.ResizeObserver(measure);
		observer.observe(arrowNode);

		return () => {
			active = false;
			this.#arrowWidth = 0;
			this.#arrowHeight = 0;
			observer.disconnect();
		};
	}
}

interface FloatingArrowStateOpts extends WithRefOpts {}

export class FloatingArrowState {
	static create(opts: FloatingArrowStateOpts) {
		return new FloatingArrowState(opts, getFloatingContent());
	}
	readonly opts: FloatingArrowStateOpts;
	readonly content: FloatingContentState;

	constructor(opts: FloatingArrowStateOpts, content: FloatingContentState) {
		this.opts = opts;
		this.content = content;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				style: this.content.arrowStyle,
				'data-side': this.content.placedSide,
				...this.content.arrowAttachment,
			}) as const,
	);
}

/**
 * Registers an explicit reference source as the floating root's anchor. Used for the cursor-anchored
 * context menu, where there is no element to attach to — the source is a virtual `Measurable` box
 * tracking the pointer. Reads the floating-root context, so call it during component init.
 */
export function setFloatingAnchor(source: ReadableBox<AnchorNode>, tooltip = false) {
	const root = tooltip ? getFloatingTooltipRoot() : getFloatingRoot();
	root.triggerSource = source;
}

/**
 * Registers the element it is attached to as the floating root's trigger/reference source, replacing
 * the renderless `<FloatingLayer.Anchor>` wrapper for the common real-element case. Spread it onto the
 * trigger element (e.g. merge into the trigger props). Reads the floating-root context, so it must be
 * called during component init. The cursor/virtual-element case (context menu) keeps the imperative
 * `root.triggerSource = box` path, since an attachment only ever receives a real node.
 */
export function floatingAnchor(tooltip = false): RefAttachment {
	const root = tooltip ? getFloatingTooltipRoot() : getFloatingRoot();
	return {
		[createAttachmentKey()]: (node) => {
			root.triggerSource = boxFrom(node);
			return () => {
				root.triggerSource = simpleBox(null);
			};
		},
	};
}

//
// HELPERS
//
const alignToOrigin = {
	start: '0%',
	center: '50%',
	end: '100%',
} satisfies Record<Align, string>;

function transformOrigin(options: { arrowWidth: number; arrowHeight: number }): Middleware {
	const { arrowWidth, arrowHeight } = options;

	return {
		name: 'transformOrigin',
		options,
		fn({ placement, rects, middlewareData }) {
			const [side, align] = getSideAndAlignFromPlacement(placement);

			const arrow = middlewareData.arrow;
			const hasArrow = arrow?.centerOffset === 0;

			const width = hasArrow ? arrowWidth : 0;
			const height = hasArrow ? arrowHeight : 0;

			const fallback = alignToOrigin[align];
			const arrowX = `${(arrow?.x ?? 0) + width / 2}px`;
			const arrowY = `${(arrow?.y ?? 0) + height / 2}px`;

			switch (side) {
				case 'bottom':
					return { data: { x: hasArrow ? arrowX : fallback, y: `${-height}px` } };

				case 'top':
					return { data: { x: hasArrow ? arrowX : fallback, y: `${rects.floating.height + height}px` } };

				case 'right':
					return { data: { x: `${-height}px`, y: hasArrow ? arrowY : fallback } };

				case 'left':
					return { data: { x: `${rects.floating.width + height}px`, y: hasArrow ? arrowY : fallback } };
			}
		},
	};
}

const getSideAndAlignFromPlacement = (placement: Placement) => {
	const [side, align] = placement.split('-') as [Side, Align?];
	return [side, align ?? 'center'] as const;
};

export const getSideFromPlacement = (placement: Placement): Side => getSideAndAlignFromPlacement(placement)[0];

export const getAlignFromPlacement = (placement: Placement): Align => getSideAndAlignFromPlacement(placement)[1];
