import { DOMContext, type Box, type ReadableBox, type ReadableBoxedValues } from '$lib/internal/tools/index.js';
import { untrack } from 'svelte';
import { on } from 'svelte/events';
import type { EscapeBehaviorType, EscapeLayerImplProps } from './types.js';
import { kbd } from '$lib/internal/kbd.js';

globalThis.bitsEscapeLayers ??= new Map<EscapeLayerState, ReadableBox<EscapeBehaviorType>>();

interface EscapeLayerStateOpts extends ReadableBoxedValues<Required<Omit<EscapeLayerImplProps, 'children' | 'ref'>>> {
	ref: Box<HTMLElement | null>;
}

export class EscapeLayerState {
	static create(opts: EscapeLayerStateOpts) {
		return new EscapeLayerState(opts);
	}
	readonly opts: EscapeLayerStateOpts;
	readonly domContext: DOMContext;

	constructor(opts: EscapeLayerStateOpts) {
		this.opts = opts;
		this.domContext = new DOMContext(this.opts.ref);

		$effect(() => {
			if (!opts.enabled.current) return;

			const unsubEvents = untrack(() => {
				globalThis.bitsEscapeLayers.set(this, opts.escapeKeydownBehavior);
				return on(this.domContext.getDocument(), 'keydown', this.#onkeydown, { passive: false });
			});

			return () => {
				unsubEvents();
				globalThis.bitsEscapeLayers.delete(this);
			};
		});
	}

	#onkeydown = (e: KeyboardEvent) => {
		if (e.key !== kbd.ESCAPE || !isResponsibleEscapeLayer(this)) return;
		const clonedEvent = new KeyboardEvent(e.type, e);
		e.preventDefault();
		const behaviorType = this.opts.escapeKeydownBehavior.current;
		if (behaviorType !== 'close' && behaviorType !== 'defer-otherwise-close') return;
		this.opts.onEscapeKeydown.current(clonedEvent);
	};
}

function isResponsibleEscapeLayer(instance: EscapeLayerState) {
	const layersArr = [...globalThis.bitsEscapeLayers];
	/**
	 * We first check if we can find a top layer with `close` or `ignore`.
	 * If that top layer was found and matches the provided node, then the node is
	 * responsible for the escape. Otherwise, we know that all layers defer so
	 * the first layer is the responsible one.
	 */
	const topMostLayer = layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === 'close' || behaviorType === 'ignore');
	if (topMostLayer) return topMostLayer[0] === instance;
	const [firstLayerNode] = layersArr[0]!;
	return firstLayerNode === instance;
}
