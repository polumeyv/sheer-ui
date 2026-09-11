import { DOMContext, type Getter, type RefAttachment } from '../tools/index.js';
import { untrack } from 'svelte';
import { on } from 'svelte/events';
import { createAttachmentKey } from 'svelte/attachments';
import type { EscapeBehaviorType } from './types.js';
import { kbd } from '../kbd.js';
import { createLayerStack } from '../layer-stack.js';
import { globalSingleton } from '../global-singleton.js';

const escapeLayers = globalSingleton('bitsEscapeLayers', () =>
	createLayerStack<EscapeLayerState, Getter<EscapeBehaviorType>>((behavior) => behavior() === 'close' || behavior() === 'ignore'),
);

interface EscapeLayerStateOpts {
	escapeKeydownBehavior: Getter<EscapeBehaviorType>;
	onEscapeKeydown: Getter<(e: KeyboardEvent) => void>;
	enabled: Getter<boolean>;
	ref: Getter<HTMLElement | null>;
}

export class EscapeLayerState {
	static create(opts: EscapeLayerStateOpts) {
		return new EscapeLayerState(opts);
	}
	readonly opts: EscapeLayerStateOpts;
	readonly domContext: DOMContext;

	constructor(opts: EscapeLayerStateOpts) {
		this.opts = opts;
		this.domContext = new DOMContext(opts.ref);

		$effect(() => {
			if (!opts.enabled()) return;

			const unsubEvents = untrack(() => {
				escapeLayers.register(this, opts.escapeKeydownBehavior);
				return on(this.domContext.getDocument(), 'keydown', this.#onkeydown, { passive: false });
			});

			return () => {
				unsubEvents();
				escapeLayers.unregister(this);
			};
		});
	}

	#onkeydown = (e: KeyboardEvent) => {
		if (e.key !== kbd.ESCAPE || !escapeLayers.isResponsible(this)) return;
		const clonedEvent = new KeyboardEvent(e.type, e);
		e.preventDefault();
		const behaviorType = this.opts.escapeKeydownBehavior();
		if (behaviorType !== 'close' && behaviorType !== 'defer-otherwise-close') return;
		this.opts.onEscapeKeydown()(clonedEvent);
	};
}

/**
 * The escape-key behavior as a spreadable Svelte attachment. Merge it into the props that
 * land on the element which should participate in the global Escape stack, instead of nesting
 * a renderless `<EscapeLayer>` wrapper. The element owns the lifecycle: on mount it registers
 * in `bitsEscapeLayers` and listens for `keydown` on its owner document; on removal it
 * deregisters and unsubscribes (via the `EscapeLayerState` effect). The stack and the
 * responsibility algorithm are unchanged.
 */
export function escapeKeydownAttachment(opts: {
	escapeKeydownBehavior: Getter<EscapeBehaviorType>;
	onEscapeKeydown: Getter<(e: KeyboardEvent) => void>;
	enabled: Getter<boolean>;
}): RefAttachment<HTMLElement> {
	return {
		[createAttachmentKey()]: (node) => {
			EscapeLayerState.create({ ...opts, ref: () => node });
		},
	};
}
