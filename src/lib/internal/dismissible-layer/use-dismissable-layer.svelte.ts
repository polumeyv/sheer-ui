import {
	simpleBox,
	boxWith,
	attachRef,
	type Getter,
	type ReadableBox,
	type RefAttachment,
	type WritableBox,
	mergeHandlers,
	type ReadableBoxedValues,
} from '../tools/index.js';
import { on } from 'svelte/events';
import { getAbortSignal, onMount, tick } from 'svelte';
import type { DismissibleLayerImplProps, InteractOutsideBehaviorType, InteractOutsideEventHandler } from './types.js';
import { type EventCallback } from '../tools/utils/events.js';
import { createLayerStack } from '../layer-stack.js';
import { globalSingleton } from '../global-singleton.js';
import { isElementOrSVGElement } from '../tools/utils/dom.js';
import { CONTEXT_MENU_CONTENT_ATTR, CONTEXT_MENU_TRIGGER_ATTR } from '../../components/menu/menu.svelte.js';
import { debounce, realTimers, type Timers, type Debounced } from './scheduler.js';

const isPointerOutsideRect = ({ clientX: x, clientY: y }: PointerEvent, node: HTMLElement) =>
	(({ left, right, top, bottom }) => x < left || x > right || y < top || y > bottom)(node.getBoundingClientRect());

const dismissableLayers = globalSingleton('bitsDismissableLayers', () =>
	createLayerStack<DismissibleLayerState, ReadableBox<InteractOutsideBehaviorType>>(
		(box) => box.current === 'close' || box.current === 'ignore',
	),
);

interface DismissibleLayerStateOpts
	extends ReadableBoxedValues<Required<Pick<DismissibleLayerImplProps, 'enabled' | 'id' | 'interactOutsideBehavior'>>> {
	ref: WritableBox<HTMLElement | null>;
	// `onInteractOutside` stays a required key (a layer that notifies nobody is pointless) but may
	// resolve to undefined; the other two are extras the layer no-ops without.
	onInteractOutside: ReadableBox<EventCallback<PointerEvent> | undefined>;
	onFocusOutside?: ReadableBox<((event: FocusEvent) => void) | undefined>;
	isValidEvent?: ReadableBox<((e: PointerEvent, node: HTMLElement) => boolean) | undefined>;
	/** Timer seam; defaults to {@link realTimers} (the real global timers). Tests inject a fake clock. */
	timers?: Timers;
}

export class DismissibleLayerState {
	static create(opts: DismissibleLayerStateOpts) {
		return new DismissibleLayerState(opts);
	}
	readonly opts: DismissibleLayerStateOpts;
	#interactOutsideProp: DismissibleLayerStateOpts['onInteractOutside'];
	#behaviorType: ReadableBox<InteractOutsideBehaviorType>;
	#interceptedEvents: Record<string, boolean> = {
		pointerdown: false,
	};
	#isResponsibleLayer = false;
	#isFocusInsideDOMTree = false;
	#onFocusOutside: DismissibleLayerStateOpts['onFocusOutside'];
	#unsubClickListener = () => {};
	#timers: Timers;
	#handleInteractOutside: Debounced<(e: PointerEvent) => void>;
	#resetState: Debounced<() => void>;

	constructor(opts: DismissibleLayerStateOpts) {
		this.opts = opts;
		this.#timers = opts.timers ?? realTimers;

		this.#behaviorType = opts.interactOutsideBehavior;
		this.#interactOutsideProp = opts.onInteractOutside;
		this.#onFocusOutside = opts.onFocusOutside;

		this.#handleInteractOutside = debounce(this.#timers, (e: PointerEvent) => {
			if (!this.opts.ref.current) {
				this.#unsubClickListener();
				return;
			}
			const isEventValid = this.opts.isValidEvent?.current?.(e, this.opts.ref.current) || isValidEvent(e, this.opts.ref.current);

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
				this.#interactOutsideProp.current?.(event);
			}
		}, 10);

		this.#resetState = debounce(this.#timers, () => {
			for (const eventType in this.#interceptedEvents) {
				this.#interceptedEvents[eventType] = false;
			}
			this.#isResponsibleLayer = false;
		}, 20);

		const cleanup = () => {
			this.#resetState();
			dismissableLayers.unregister(this);
			this.#handleInteractOutside.destroy();
		};

		$effect(() => {
			this.opts.enabled.current;
			this.opts.ref.current;
			if (!this.opts.enabled.current || !this.opts.ref.current) return;
			// Minted here, passed into the timeout: a stale timeout firing after this run
			// was superseded adds listeners against an aborted signal, i.e. not at all.
			const signal = getAbortSignal();
			this.#timers.setTimeout(() => {
				if (!this.opts.ref.current || signal.aborted) return;
				dismissableLayers.register(this, this.#behaviorType);
				this.#addEventListeners(signal);
			}, 1);
			return cleanup;
		});

		onMount(() => () => {
			this.#resetState.destroy();
			dismissableLayers.unregister(this);
			this.#handleInteractOutside.destroy();
			this.#unsubClickListener();
		});
	}

	#handleFocus = (event: FocusEvent) => {
		if (event.defaultPrevented) return;
		if (!this.opts.ref.current) return;
		tick().then(() => {
			if (!this.opts.ref.current || this.#isTargetWithinLayer(event.target as HTMLElement)) return;

			if (event.target && !this.#isFocusInsideDOMTree) {
				this.#onFocusOutside?.current?.(event);
			}
		});
	};

	#addEventListeners(signal: AbortSignal) {
		const doc = this.opts.ref.current?.ownerDocument ?? document;

		on(doc, 'pointerdown', mergeHandlers(this.#markInterceptedEvent, this.#markResponsibleLayer), { capture: true, signal });
		on(doc, 'pointerdown', mergeHandlers(this.#markNonInterceptedEvent, this.#handleInteractOutside), { signal });
		on(doc, 'focusin', this.#handleFocus, { signal });
	}

	#handleDismiss = (e: MouseEvent) => {
		let event = e;
		if (event.defaultPrevented) {
			event = createWrappedEvent(e);
		}
		this.#interactOutsideProp.current?.(e as PointerEvent);
	};

	#markInterceptedEvent = (e: PointerEvent) => {
		this.#interceptedEvents[e.type] = true;
	};

	#markNonInterceptedEvent = (e: PointerEvent) => {
		this.#interceptedEvents[e.type] = false;
	};

	#markResponsibleLayer = () => {
		if (!this.opts.ref.current) return;
		this.#isResponsibleLayer = dismissableLayers.isResponsible(this);
	};
	#isTargetWithinLayer = (target: HTMLElement) => {
		return this.opts.ref.current?.contains(target) ?? false;
	};

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
 * stack (a shared `LayerStack`, see `internal/layer-stack.ts`) and the listeners are unchanged; the
 * attachment just owns the node (registers on mount, deregisters on removal).
 */
export function interactOutsideAttachment(opts: {
	id: Getter<string>;
	interactOutsideBehavior: Getter<InteractOutsideBehaviorType>;
	onInteractOutside: Getter<InteractOutsideEventHandler | undefined>;
	onFocusOutside?: Getter<((event: FocusEvent) => void) | undefined>;
	enabled: Getter<boolean>;
	isValidEvent?: Getter<((e: PointerEvent, node: HTMLElement) => boolean) | undefined>;
}): { props: { onfocuscapture: () => void; onblurcapture: () => void }; attachment: RefAttachment<HTMLElement> } {
	const ref = simpleBox<HTMLElement | null>(null);
	const state = DismissibleLayerState.create({
		id: boxWith(opts.id),
		interactOutsideBehavior: boxWith(opts.interactOutsideBehavior),
		onInteractOutside: boxWith(opts.onInteractOutside),
		enabled: boxWith(opts.enabled),
		onFocusOutside: boxWith(() => opts.onFocusOutside?.()),
		isValidEvent: boxWith(() => opts.isValidEvent?.()),
		ref,
	});
	return { props: state.props, attachment: attachRef(ref) };
}

function isValidEvent(e: PointerEvent, node: HTMLElement): boolean {
	const target = e.target;
	if (!isElementOrSVGElement(target)) return false;

	const targetIsContextMenuTrigger = Boolean(target.closest(`[${CONTEXT_MENU_TRIGGER_ATTR}]`));

	// A context menu re-triggering over its own content: only the primary button counts.
	if (targetIsContextMenuTrigger && node.closest(`[${CONTEXT_MENU_CONTENT_ATTR}]`)) return e.button === 0;
	// Secondary buttons never dismiss, unless they landed on a context-menu trigger.
	if (e.button > 0 && !targetIsContextMenuTrigger) return false;

	return target.ownerDocument.documentElement.contains(target) && !node.contains(target) && isPointerOutsideRect(e, node);
}

export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>;

function createWrappedEvent(e: PointerEvent | MouseEvent): PointerEvent {
	const capturedCurrentTarget = e.currentTarget;
	const capturedTarget = e.target;

	// A `click` is already a PointerEvent in modern browsers; a synthetic MouseEvent replays as pointerdown.
	const newEvent = new PointerEvent(e instanceof PointerEvent ? e.type : 'pointerdown', e);

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
