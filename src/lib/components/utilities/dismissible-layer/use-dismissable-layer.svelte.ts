import {
	box,
	boxWith,
	attachRef,
	type Getter,
	type ReadableBox,
	type RefAttachment,
	type WritableBox,
	executeCallbacks,
	type ReadableBoxedValues,
} from '$lib/internal/tools/index.js';
import { on } from 'svelte/events';
import { onMount, tick } from 'svelte';
import type { DismissibleLayerImplProps, InteractOutsideBehaviorType, InteractOutsideEventHandler } from './types.js';
import { type EventCallback } from '$lib/internal/events.js';
import { isElementOrSVGElement } from '@polumeyv/utilities/dom';
import { CONTEXT_MENU_CONTENT_ATTR, CONTEXT_MENU_TRIGGER_ATTR } from '$lib/components/menu/menu.svelte.js';

const isPointerOutsideElementRect = ({ clientX: x, clientY: y }: PointerEvent, node: HTMLElement) => {
	const { left, right, top, bottom } = node.getBoundingClientRect();
	return x < left || x > right || y < top || y > bottom;
};

globalThis.bitsDismissableLayers ??= new Map<DismissibleLayerState, ReadableBox<InteractOutsideBehaviorType>>();

interface DismissibleLayerStateOpts extends ReadableBoxedValues<Required<Omit<DismissibleLayerImplProps, 'children' | 'ref'>>> {
	ref: WritableBox<HTMLElement | null>;
}

export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 500) {
	let timeout: ReturnType<typeof setTimeout> | undefined;

	const debounced = (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), wait);
	};

	debounced.destroy = () => clearTimeout(timeout);

	return debounced;
}

export class DismissibleLayerState {
	static create(opts: DismissibleLayerStateOpts) {
		return new DismissibleLayerState(opts);
	}
	readonly opts: DismissibleLayerStateOpts;
	#interactOutsideProp: ReadableBox<EventCallback<PointerEvent>>;
	#behaviorType: ReadableBox<InteractOutsideBehaviorType>;
	#interceptedEvents: Record<string, boolean> = {
		pointerdown: false,
	};
	#isResponsibleLayer = false;
	#isFocusInsideDOMTree = false;
	#onFocusOutside: DismissibleLayerStateOpts['onFocusOutside'];
	#unsubClickListener = () => {};

	constructor(opts: DismissibleLayerStateOpts) {
		this.opts = opts;

		this.#behaviorType = opts.interactOutsideBehavior;
		this.#interactOutsideProp = opts.onInteractOutside;
		this.#onFocusOutside = opts.onFocusOutside;

		let unsubEvents = () => {};

		const cleanup = () => {
			this.#resetState();
			globalThis.bitsDismissableLayers.delete(this);
			this.#handleInteractOutside.destroy();
			unsubEvents();
		};

		$effect(() => {
			this.opts.enabled.current;
			this.opts.ref.current;
			if (!this.opts.enabled.current || !this.opts.ref.current) return;
			setTimeout(() => {
				if (!this.opts.ref.current) return;
				globalThis.bitsDismissableLayers.set(this, this.#behaviorType);

				unsubEvents();
				unsubEvents = this.#addEventListeners();
			}, 1);
			return cleanup;
		});

		onMount(() => () => {
			this.#resetState.destroy();
			globalThis.bitsDismissableLayers.delete(this);
			this.#handleInteractOutside.destroy();
			this.#unsubClickListener();
			unsubEvents();
		});
	}

	#handleFocus = (event: FocusEvent) => {
		if (event.defaultPrevented) return;
		if (!this.opts.ref.current) return;
		tick().then(() => {
			if (!this.opts.ref.current || this.#isTargetWithinLayer(event.target as HTMLElement)) return;

			if (event.target && !this.#isFocusInsideDOMTree) {
				this.#onFocusOutside.current?.(event);
			}
		});
	};

	#addEventListeners() {
		const doc = this.opts.ref.current?.ownerDocument ?? document;

		return executeCallbacks(
			on(doc, 'pointerdown', executeCallbacks(this.#markInterceptedEvent, this.#markResponsibleLayer), { capture: true }),
			on(doc, 'pointerdown', executeCallbacks(this.#markNonInterceptedEvent, this.#handleInteractOutside)),
			on(doc, 'focusin', this.#handleFocus),
		);
	}

	#handleDismiss = (e: MouseEvent) => {
		let event = e;
		if (event.defaultPrevented) {
			event = createWrappedEvent(e);
		}
		this.#interactOutsideProp.current(e as PointerEvent);
	};

	#handleInteractOutside = debounce((e: PointerEvent) => {
		if (!this.opts.ref.current) {
			this.#unsubClickListener();
			return;
		}
		const isEventValid = this.opts.isValidEvent.current(e, this.opts.ref.current) || isValidEvent(e, this.opts.ref.current);

		if (!this.#isResponsibleLayer || this.#isAnyEventIntercepted() || !isEventValid) {
			this.#unsubClickListener();
			return;
		}

		let event = e;
		if (event.defaultPrevented) {
			event = createWrappedEvent(event);
		}

		if (this.#behaviorType.current !== 'close' && this.#behaviorType.current !== 'defer-otherwise-close') {
			this.#unsubClickListener();
			return;
		}

		if (e.pointerType === 'touch') {
			this.#unsubClickListener();

			const doc = this.opts.ref.current?.ownerDocument ?? document;

			this.#unsubClickListener = on(doc, 'click', this.#handleDismiss, {
				once: true,
			});
		} else {
			this.#interactOutsideProp.current(event);
		}
	}, 10);

	#markInterceptedEvent = (e: PointerEvent) => {
		this.#interceptedEvents[e.type] = true;
	};

	#markNonInterceptedEvent = (e: PointerEvent) => {
		this.#interceptedEvents[e.type] = false;
	};

	#markResponsibleLayer = () => {
		if (!this.opts.ref.current) return;
		this.#isResponsibleLayer = isResponsibleLayer(this.opts.ref.current);
	};
	#isTargetWithinLayer = (target: HTMLElement) => {
		return this.opts.ref.current?.contains(target) ?? false;
	};

	#resetState = debounce(() => {
		for (const eventType in this.#interceptedEvents) {
			this.#interceptedEvents[eventType] = false;
		}
		this.#isResponsibleLayer = false;
	}, 20);

	#isAnyEventIntercepted() {
		const i = Object.values(this.#interceptedEvents).some(Boolean);
		return i;
	}

	#onfocuscapture = () => {
		this.#isFocusInsideDOMTree = true;
	};

	#onblurcapture = () => {
		this.#isFocusInsideDOMTree = false;
	};

	props = {
		onfocuscapture: this.#onfocuscapture,
		onblurcapture: this.#onblurcapture,
	};
}

/**
 * The dismissible (interact-outside) behavior, without the renderless `<DismissibleLayer>` wrapper.
 * Returns the focus-capture props (`onfocuscapture`/`onblurcapture`) and a node-lifecycle attachment
 * separately, because the wrapper's two consumers differ: most overlays merge BOTH onto the content
 * element, but dialog/sheet/alert-dialog historically merged only the activation (their default-slot
 * usage dropped the capture props) — so callers keep that choice by merging `props` or not.
 *
 * Must be called during component init (the state uses `onMount`). The global `bitsDismissableLayers`
 * stack, the responsibility algorithm, and the listeners are unchanged; the attachment just owns the
 * node (registers on mount, deregisters on removal).
 */
export function interactOutsideAttachment(opts: {
	id: Getter<string>;
	interactOutsideBehavior: Getter<InteractOutsideBehaviorType>;
	onInteractOutside: Getter<InteractOutsideEventHandler>;
	onFocusOutside: Getter<(event: FocusEvent) => void>;
	enabled: Getter<boolean>;
	isValidEvent: Getter<(e: PointerEvent, node: HTMLElement) => boolean>;
}): { props: { onfocuscapture: () => void; onblurcapture: () => void }; attachment: RefAttachment<HTMLElement> } {
	const ref = box<HTMLElement | null>(null);
	const state = DismissibleLayerState.create({
		id: boxWith(opts.id),
		interactOutsideBehavior: boxWith(opts.interactOutsideBehavior),
		onInteractOutside: boxWith(opts.onInteractOutside),
		enabled: boxWith(opts.enabled),
		onFocusOutside: boxWith(opts.onFocusOutside),
		isValidEvent: boxWith(opts.isValidEvent),
		ref,
	});
	return { props: state.props, attachment: attachRef(ref) };
}

export function getTopMostDismissableLayer(
	layersArr: [DismissibleLayerState, ReadableBox<InteractOutsideBehaviorType>][] = [...globalThis.bitsDismissableLayers],
) {
	return layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === 'close' || behaviorType === 'ignore');
}

function isResponsibleLayer(node: HTMLElement): boolean {
	const layersArr = [...globalThis.bitsDismissableLayers];
	/**
	 * We first check if we can find a top layer with `close` or `ignore`.
	 * If that top layer was found and matches the provided node, then the node is
	 * responsible for the outside interaction. Otherwise, we know that all layers defer so
	 * the first layer is the responsible one.
	 */
	const topMostLayer = getTopMostDismissableLayer(layersArr);
	if (topMostLayer) return topMostLayer[0].opts.ref.current === node;
	const [firstLayerNode] = layersArr[0]!;
	return firstLayerNode.opts.ref.current === node;
}

function isValidEvent(e: PointerEvent, node: HTMLElement): boolean {
	const target = e.target;
	if (!isElementOrSVGElement(target)) return false;

	const targetIsContextMenuTrigger = Boolean(target.closest(`[${CONTEXT_MENU_TRIGGER_ATTR}]`));
	const nodeIsContextMenu = Boolean(node.closest(`[${CONTEXT_MENU_CONTENT_ATTR}]`));

	if ('button' in e && e.button > 0 && !targetIsContextMenuTrigger) return false;
	if ('button' in e && e.button === 0 && targetIsContextMenuTrigger && nodeIsContextMenu) {
		return true;
	}
	if (targetIsContextMenuTrigger && nodeIsContextMenu) return false;

	const isValid = target.ownerDocument.documentElement.contains(target) && !node.contains(target) && isPointerOutsideElementRect(e, node);
	return isValid;
}

export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>;

function createWrappedEvent(e: PointerEvent | MouseEvent): PointerEvent {
	const capturedCurrentTarget = e.currentTarget;
	const capturedTarget = e.target;

	let newEvent: PointerEvent;

	if (e instanceof PointerEvent) {
		newEvent = new PointerEvent(e.type, e);
	} else {
		newEvent = new PointerEvent('pointerdown', e);
	}

	// track the prevented state separately
	let isPrevented = false;

	// Create a proxy to intercept property access and method calls
	const wrappedEvent = new Proxy(newEvent, {
		get: (target, prop) => {
			if (prop === 'currentTarget') {
				return capturedCurrentTarget;
			}
			if (prop === 'target') {
				return capturedTarget;
			}
			if (prop === 'preventDefault') {
				return () => {
					isPrevented = true;
					if (typeof target.preventDefault === 'function') {
						target.preventDefault();
					}
				};
			}
			if (prop === 'defaultPrevented') {
				return isPrevented;
			}
			if (prop in target) {
				// oxlint-disable-next-line no-explicit-any
				return (target as any)[prop];
			}
			// oxlint-disable-next-line no-explicit-any
			return (e as any)[prop];
		},
	});

	return wrappedEvent as PointerEvent;
}
