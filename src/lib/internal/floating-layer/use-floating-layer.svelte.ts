import { createContext } from 'svelte';
import { createAttachmentKey, type Attachment } from 'svelte/attachments';
import { attachRef, getWindow, styleToString, type ReadableBoxedValues, type RefAttachment } from '../tools/index.js';
import type { WithRefOpts } from '../types.js';
import type { Direction, StyleProperties } from '../index.js';

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

/** A virtual anchor: anything with a client rect (the context menu's pointer position). */
export type Measurable = {
	getBoundingClientRect: () => DOMRect;
};
type AnchorNode = Measurable | HTMLElement | null;
type CustomAnchorNode = AnchorNode | string;

/** The per-component names the adapters read (`--bits-<name>-content-available-height` and so on). */
export const getFloatingContentCSSVars = (name: string): Record<string, string> => {
	const prefix = `--bits-${name}`;

	return {
		[`${prefix}-content-transform-origin`]: 'var(--bits-floating-transform-origin)',
		[`${prefix}-content-available-width`]: 'var(--bits-floating-available-width)',
		[`${prefix}-content-available-height`]: 'var(--bits-floating-available-height)',
		[`${prefix}-anchor-width`]: 'var(--bits-floating-anchor-width)',
		[`${prefix}-anchor-height`]: 'var(--bits-floating-anchor-height)',
	};
};

/**
 * One floating root per surface: names the CSS anchor the content positions against and holds
 * the anchor source (the trigger, a `customAnchor`, or a virtual rect).
 */
export class FloatingRootState {
	static create(anchorName: string, tooltip = false) {
		const root = new FloatingRootState(anchorName);
		return tooltip ? setFloatingTooltipRoot(root) : setFloatingRoot(root);
	}
	readonly anchorName: string;
	// Getters over whoever owns the anchor (trigger attachment, customAnchor, pointer rect): a derived reading through them tracks the owner.
	#customAnchorSource: () => CustomAnchorNode = $state.raw(() => null);
	triggerSource: () => AnchorNode = $state.raw(() => null);

	constructor(anchorName: string) {
		this.anchorName = anchorName;
	}

	get anchorNode(): AnchorNode {
		const customAnchor = this.#customAnchorSource();

		if (customAnchor) {
			if (typeof customAnchor === 'string') {
				if (typeof document === 'undefined') return null;
				return document.querySelector(customAnchor);
			}
			return customAnchor;
		}

		return this.triggerSource();
	}

	get triggerNode(): AnchorNode {
		return this.triggerSource();
	}

	setCustomAnchorSource(source: () => CustomAnchorNode) {
		this.#customAnchorSource = source;
	}
}

export interface FloatingContentStateOpts extends ReadableBoxedValues<{
	id: string;
	side: Side;
	sideOffset: number;
	align: Align;
	alignOffset: number;
	arrowPadding: number;
	avoidCollisions: boolean;
	collisionPadding: number | Partial<Record<Side, number>>;
	hideWhenDetached: boolean;
	onPlaced: () => void;
	dir: Direction;
	style: StyleProperties | null | undefined | string;
	enabled: boolean;
	/** Open, or closed with the exit still running. A closed-at-rest surface leaves anchor layout. */
	present: boolean;
	customAnchor: string | HTMLElement | null | Measurable;
}> {}

const alignToOrigin = {
	start: '0%',
	center: '50%',
	end: '100%',
} satisfies Record<Align, string>;

/**
 * Positions the content with CSS anchor positioning: the content element is `position: fixed`
 * in a `position-area` beside its anchor, and `position-try-fallbacks` flips it away from a
 * viewport edge, then moves a left/right request below or above the anchor once neither side
 * fits (the `--bits-cross` option in ui.css). The sizing custom properties
 * (`--bits-floating-available-*`, `--bits-floating-anchor-*`) resolve against that area, so they
 * only mean something on the content element itself, never on a descendant. Nothing runs per
 * scroll or resize; the browser repositions. `data-side` and `data-align` are the requested
 * placement (the resolved fallback is not readable outside Chrome).
 */
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

	contentRef = $state.raw<HTMLElement | null>(null);
	readonly contentAttachment = attachRef<HTMLElement>((v) => (this.contentRef = v));
	readonly arrowAttachment = {
		[createAttachmentKey()]: ((node) => this.#measureArrow(node)) satisfies Attachment<HTMLElement>,
	};

	#userStyle = $derived.by(() => styleToString(this.opts.style.current));

	#padding = $derived.by(() => {
		const padding = this.opts.collisionPadding.current;
		const value = (side: Side) => (typeof padding === 'number' ? padding : (padding[side] ?? 0));
		return { top: value('top'), right: value('right'), bottom: value('bottom'), left: value('left') };
	});

	#requestedSide = $derived.by(() => this.opts.side.current);
	#requestedAlign = $derived.by(() => this.opts.align.current);
	/**
	 * The placement the browser actually chose. The applied position-try fallback cannot be read
	 * back (anchored container queries are Chrome-only), so it is measured from the rects while
	 * open; `data-side`/`data-align`, the transform origin and the arrow follow it through flips.
	 * The position style itself always emits the requested placement — the measurement must never
	 * feed back into what it measures.
	 */
	#measuredPlacement = $state<{ side: Side; align: Align } | null>(null);
	placedSide = $derived(this.#measuredPlacement?.side ?? this.#requestedSide);
	placedAlign = $derived(this.#measuredPlacement?.align ?? this.#requestedAlign);
	#vertical = $derived(this.#requestedSide === 'top' || this.#requestedSide === 'bottom');
	/** The physical edge of the anchor the content aligns to on a side of that axis; `start`/`end` follow the text direction across. */
	#alignEdge(vertical: boolean): Side | null {
		const align = this.#requestedAlign;
		if (align === 'center') return null;
		if (!vertical) return align === 'start' ? 'top' : 'bottom';
		const rtl = this.opts.dir.current === 'rtl';
		return (align === 'start') !== rtl ? 'left' : 'right';
	}

	/** The area and margins that put the content on `side`: offsets toward the anchor, collision padding toward the viewport. */
	#placement(side: Side) {
		const padding = this.#padding;
		const vertical = side === 'top' || side === 'bottom';
		const edge = this.#alignEdge(vertical);
		const margin: Record<Side, number> = {
			[OPPOSITE_SIDE[side]]: this.opts.sideOffset.current + this.#arrowHeight,
			[side]: padding[side],
		} as Record<Side, number>;
		const cross: [Side, Side] = vertical ? ['left', 'right'] : ['top', 'bottom'];
		for (const s of cross) margin[s] = padding[s];
		if (edge) margin[edge] = this.opts.alignOffset.current;
		// the content spans from the aligned anchor edge toward the opposite one; centered spans both ways
		const span = edge ? `span-${OPPOSITE_SIDE[edge]}` : 'span-all';
		return { area: `${side} ${span}`, margin };
	}

	#transformOrigin = $derived.by(() => {
		const along = alignToOrigin[this.placedAlign];
		switch (this.placedSide) {
			case 'bottom':
				return `${along} 0%`;
			case 'top':
				return `${along} 100%`;
			case 'right':
				return `0% ${along}`;
			case 'left':
				return `100% ${along}`;
		}
	});

	#positionStyle = $derived.by(() => {
		// Hidden at rest, the surface must not keep the anchor solver busy: a page of always-mounted
		// menus re-evaluates every anchored box per layout pass, which showed up as a measurable delay
		// on every animation on the page. The anchored style comes back in the same pass that opens it.
		if (!this.opts.present.current) {
			return { position: 'fixed', inset: 'auto' } satisfies StyleProperties;
		}
		const side = this.#requestedSide;
		const vertical = this.#vertical;
		const { area, margin } = this.#placement(side);
		// Five entries: the spec lets an engine stop there and Chromium does. Whole flips first — a
		// side is left for a bigger one while the content fits there whole — then `--bits-clamped`
		// (ui.css) re-tries with max-block-size capped to the side's space, so the surface scrolls
		// inside. A left/right request spends its last two on the other axis, below the anchor and
		// then flipped above (`--bits-cross`): a phone's sheet has room there when neither side has.
		const fallbacks = this.opts.avoidCollisions.current
			? (vertical
					? ['flip-block', 'flip-inline', 'flip-block flip-inline', '--bits-clamped', '--bits-clamped flip-block']
					: ['flip-inline', 'flip-block', '--bits-clamped', '--bits-cross', '--bits-cross flip-block']
				).join(', ')
			: 'none';
		const below = vertical ? null : this.#placement('bottom');

		return {
			position: 'fixed',
			inset: 'auto',
			positionAnchor: this.root.anchorName,
			positionArea: area,
			positionTryFallbacks: fallbacks,
			...(this.#requestedAlign === 'center' && { [vertical ? 'justifySelf' : 'alignSelf']: 'anchor-center' }),
			...(this.opts.hideWhenDetached.current && { positionVisibility: 'anchors-visible' }),
			marginTop: `${margin.top}px`,
			marginRight: `${margin.right}px`,
			marginBottom: `${margin.bottom}px`,
			marginLeft: `${margin.left}px`,
			'--bits-floating-block-margins': `${margin.top + margin.bottom}px`,
			...(below && {
				'--bits-cross-area': below.area,
				'--bits-cross-margin': `${below.margin.top}px ${below.margin.right}px ${below.margin.bottom}px ${below.margin.left}px`,
			}),
			'--bits-floating-transform-origin': this.#transformOrigin,
			'--bits-floating-available-width': `calc(100% - ${margin.left + margin.right}px)`,
			'--bits-floating-available-height': `calc(100% - ${margin.top + margin.bottom}px)`,
			'--bits-floating-anchor-width': `anchor-size(${this.root.anchorName} width)`,
			'--bits-floating-anchor-height': `anchor-size(${this.root.anchorName} height)`,
		} satisfies StyleProperties;
	});

	/** A virtual anchor (a rect, no element) is rendered as a zero-size fixed box carrying the anchor name. */
	virtualAnchorStyle = $derived.by(() => {
		if (!this.opts.present.current) return null;
		const anchor = this.root.anchorNode;
		// SSR-safe: on the server there is no HTMLElement (and no virtual anchor either)
		if (!anchor || typeof HTMLElement === 'undefined' || anchor instanceof HTMLElement) return null;
		const rect = anchor.getBoundingClientRect();
		return styleToString({
			position: 'fixed',
			left: `${rect.left}px`,
			top: `${rect.top}px`,
			width: `${rect.width}px`,
			height: `${rect.height}px`,
			pointerEvents: 'none',
			anchorName: this.root.anchorName,
		});
	});

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'data-side': this.placedSide,
				'data-align': this.placedAlign,
				'data-floating-content': '',
				style: [styleToString(this.#positionStyle), this.#userStyle].filter(Boolean).join(' '),
				dir: this.opts.dir.current,
				...this.contentAttachment,
			}) as const,
	);

	arrowBaseSide = $derived(OPPOSITE_SIDE[this.placedSide]);
	arrowStyle = $derived.by((): StyleProperties => {
		// centered on the anchor, kept `arrowPadding` inside the content's edges
		const padding = this.opts.arrowPadding.current;
		const width = this.#arrowWidth;
		const centered = `clamp(${padding}px, calc(anchor(${this.root.anchorName} center) - ${width / 2}px), calc(100% - ${padding + width}px))`;
		return {
			position: 'absolute',
			...(this.#vertical ? { left: centered } : { top: centered }),
			[this.arrowBaseSide]: 0,
			transformOrigin: {
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
		};
	});

	constructor(opts: FloatingContentStateOpts, root: FloatingRootState) {
		this.opts = opts;
		this.root = root;
		this.root.setCustomAnchorSource(() => opts.customAnchor.current);

		// An element anchor that is not the trigger (a `customAnchor`) needs the anchor name too.
		$effect(() => {
			const anchor = this.root.anchorNode;
			if (!(anchor instanceof HTMLElement) || anchor === this.root.triggerNode) return;
			const previous = anchor.style.anchorName;
			anchor.style.anchorName = this.root.anchorName;
			return () => {
				anchor.style.anchorName = previous;
			};
		});

		// Placement is the browser's: the content is positioned as soon as it renders open.
		$effect(() => {
			if (!this.opts.enabled.current) return;
			this.opts.onPlaced.current();
		});

		// Measure the resolved placement while open, re-checking on scroll and resize (a flip can
		// change as the page moves). Rect reads only; guarded against unlaid-out nodes (jsdom).
		$effect(() => {
			if (!this.opts.enabled.current) {
				this.#measuredPlacement = null;
				return;
			}
			const content = this.contentRef;
			if (!content) return;
			const win = getWindow(content);
			const measure = () => {
				this.#measurePlacement();
				// the enter animation scales from the requested origin, so these rects are transformed:
				// measure again once it settles
				for (const animation of content.getAnimations()) animation.finished.then(schedule, () => {});
			};
			let raf = win.requestAnimationFrame(measure);
			const schedule = () => {
				win.cancelAnimationFrame(raf);
				raf = win.requestAnimationFrame(measure);
			};
			win.addEventListener('scroll', schedule, { capture: true, passive: true });
			win.addEventListener('resize', schedule, { passive: true });
			return () => {
				win.cancelAnimationFrame(raf);
				win.removeEventListener('scroll', schedule, { capture: true });
				win.removeEventListener('resize', schedule);
			};
		});
	}

	#measurePlacement() {
		const content = this.contentRef;
		const anchor = this.root.anchorNode;
		if (!content || !anchor) return;
		const c = content.getBoundingClientRect();
		const a = anchor.getBoundingClientRect();
		if (c.width === 0 && c.height === 0) return;

		const requested = this.#requestedSide;
		// the requested axis first, then the one the cross options may have moved it to
		const above = c.bottom <= a.top + 1;
		const below = c.top >= a.bottom - 1;
		const before = c.right <= a.left + 1;
		const after = c.left >= a.right - 1;
		const side: Side = this.#vertical
			? above
				? 'top'
				: below
					? 'bottom'
					: before
						? 'left'
						: after
							? 'right'
							: requested
			: before
				? 'left'
				: after
					? 'right'
					: above
						? 'top'
						: below
							? 'bottom'
							: requested;
		const vertical = side === 'top' || side === 'bottom';

		// nearest alignment on the cross axis; start/end follow the text direction horizontally
		const rtl = this.opts.dir.current === 'rtl';
		const distance: Record<Align, number> = vertical
			? {
					start: Math.abs(rtl ? c.right - a.right : c.left - a.left),
					center: Math.abs(c.left + c.width / 2 - (a.left + a.width / 2)),
					end: Math.abs(rtl ? c.left - a.left : c.right - a.right),
				}
			: {
					start: Math.abs(c.top - a.top),
					center: Math.abs(c.top + c.height / 2 - (a.top + a.height / 2)),
					end: Math.abs(c.bottom - a.bottom),
				};
		// a tie (content as wide as the anchor) keeps the requested alignment
		const align = ALIGN_OPTIONS.reduce((best, k) => (distance[k] < distance[best] ? k : best), this.#requestedAlign);

		const previous = this.#measuredPlacement;
		if (previous?.side !== side || previous?.align !== align) this.#measuredPlacement = { side, align };
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
 * tracking the pointer, which the content renders as a zero-size anchor element. Reads the
 * floating-root context, so call it during component init.
 */
export function setFloatingAnchor(source: () => AnchorNode, tooltip = false) {
	const root = tooltip ? getFloatingTooltipRoot() : getFloatingRoot();
	root.triggerSource = source;
}

/**
 * The trigger attachment: registers the node as the root's anchor and writes the anchor name
 * on it imperatively — through style props it would be lost to any consumer `style` attribute
 * after the spread. The content must follow the trigger in tree order; CSS anchor positioning
 * only resolves anchors laid out before the positioned element.
 */
export function floatingAnchor(tooltip = false): RefAttachment {
	const root = tooltip ? getFloatingTooltipRoot() : getFloatingRoot();
	return {
		[createAttachmentKey()]: (node) => {
			const el = node as HTMLElement;
			root.triggerSource = () => el;
			el.style.anchorName = root.anchorName;
			return () => {
				el.style.removeProperty('anchor-name');
				root.triggerSource = () => null;
			};
		},
	};
}
