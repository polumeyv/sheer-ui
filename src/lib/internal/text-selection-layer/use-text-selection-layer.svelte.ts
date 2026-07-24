import {
	DOMContext,
	boxWith,
	type Getter,
	type ReadableBox,
	type ReadableBoxedValues,
	type RefAttachment,
	composeHandlers,
	contains,
} from '../tools/index.js';
import { getAbortSignal, untrack } from 'svelte';
import { on } from 'svelte/events';
import { createAttachmentKey } from 'svelte/attachments';
import type { PointerHandler, TextSelectionLayerImplProps } from './types.js';
import { createLayerStack } from '../layer-stack.js';
import { globalSingleton } from '../global-singleton.js';
import { isHTMLElement } from '@polumeyv/utilities/dom';

interface TextSelectionLayerStateOpts extends ReadableBoxedValues<
	Required<Omit<TextSelectionLayerImplProps, 'children' | 'preventOverflowTextSelection' | 'ref'>> & {
		ref: HTMLElement | null;
	}
> {}

const textSelectionLayers = globalSingleton('bitsTextSelectionLayers', () =>
	createLayerStack<TextSelectionLayerState, ReadableBox<boolean>>(),
);

export class TextSelectionLayerState {
	static create(opts: TextSelectionLayerStateOpts) {
		return new TextSelectionLayerState(opts);
	}
	readonly opts: TextSelectionLayerStateOpts;
	readonly domContext: DOMContext;
	#unsubSelectionLock = () => {};
	#enabledSnapshot = false;
	#onPointerDownSnapshot: PointerHandler = () => {};
	#onPointerUpSnapshot: PointerHandler = () => {};

	constructor(opts: TextSelectionLayerStateOpts) {
		this.opts = opts;
		this.domContext = new DOMContext(opts.ref);

		$effect(() => {
			const [enabled, onPointerDown, onPointerUp] = [
				this.opts.enabled.current,
				this.opts.onPointerDown.current,
				this.opts.onPointerUp.current,
			] as const;
			const signal = getAbortSignal();
			return untrack(() => {
				this.#enabledSnapshot = enabled;
				this.#onPointerDownSnapshot = onPointerDown;
				this.#onPointerUpSnapshot = onPointerUp;

				if (enabled) {
					textSelectionLayers.register(this, this.opts.enabled);
					this.#addEventListeners(signal);
				}
				return () => {
					this.#enabledSnapshot = false;
					this.#resetSelectionLock();
					textSelectionLayers.unregister(this);
				};
			});
		});
	}

	#addEventListeners(signal: AbortSignal) {
		on(this.domContext.getDocument(), 'pointerdown', this.#pointerdown, { signal });
		on(this.domContext.getDocument(), 'pointerup', composeHandlers(this.#resetSelectionLock, this.#pointerupUserHandler), { signal });
	}

	#pointerupUserHandler = (e: PointerEvent) => {
		this.#onPointerUpSnapshot(e);
	};

	#pointerdown = (e: PointerEvent) => {
		const node = this.opts.ref.current;
		const target = e.target;
		if (!isHTMLElement(node) || !isHTMLElement(target) || !this.#enabledSnapshot) return;
		/**
		 * We only lock user-selection overflow if layer is the top most layer and
		 * pointerdown occurred inside the node. You are still allowed to select text
		 * outside the node provided pointerdown occurs outside the node.
		 */
		if (!textSelectionLayers.isResponsible(this) || !contains(node, target)) return;
		this.#onPointerDownSnapshot(e);
		if (e.defaultPrevented) return;
		this.#unsubSelectionLock = preventTextSelectionOverflow(node, this.domContext.getDocument().body);
	};

	#resetSelectionLock = () => {
		this.#unsubSelectionLock();
		this.#unsubSelectionLock = () => {};
	};
}

/**
 * The text-selection-overflow lock as a spreadable Svelte attachment, replacing the renderless
 * `<TextSelectionLayer>` wrapper. Merge it onto the element that should participate in the global
 * `bitsTextSelectionLayers` stack. The element owns the lifecycle (register + document pointer
 * listeners on mount, deregister on removal). The stack and the highest-layer rule are unchanged.
 */
export function textSelectionAttachment(opts: {
	id: Getter<string>;
	onPointerDown: Getter<PointerHandler>;
	onPointerUp: Getter<PointerHandler>;
	enabled: Getter<boolean>;
}): RefAttachment<HTMLElement> {
	return {
		[createAttachmentKey()]: (node) => {
			TextSelectionLayerState.create({
				id: boxWith(opts.id),
				onPointerDown: boxWith(opts.onPointerDown),
				onPointerUp: boxWith(opts.onPointerUp),
				enabled: boxWith(opts.enabled),
				ref: boxWith(() => node),
			});
		},
	};
}

const getUserSelect = (node: HTMLElement) => node.style.userSelect || node.style.webkitUserSelect;

function preventTextSelectionOverflow(node: HTMLElement, body: HTMLElement) {
	const originalBodyUserSelect = getUserSelect(body);
	const originalNodeUserSelect = getUserSelect(node);
	setUserSelect(body, 'none');
	setUserSelect(node, 'text');
	return () => {
		setUserSelect(body, originalBodyUserSelect);
		setUserSelect(node, originalNodeUserSelect);
	};
}

function setUserSelect(node: HTMLElement, value: string) {
	node.style.userSelect = value;
	node.style.webkitUserSelect = value;
}
