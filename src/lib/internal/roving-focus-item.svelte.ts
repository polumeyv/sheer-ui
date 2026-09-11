import { type Getter, type RefAttachment, attachRef } from './tools/index.js';
import type { RovingFocusGroup } from './roving-focus-group.svelte.js';

type RovingFocusItemOptions<T extends HTMLElement = HTMLElement> = {
	group: RovingFocusGroup;
	ref: Getter<T | null>;
	/** Receives the node from the attachment; the owner keeps it wherever its `ref` reads from. */
	setRef: (node: T | null) => void;
	/** Whether arrow keys move from this item; absent means always. */
	enabled?: Getter<boolean>;
	onRefChange?: (node: T | null) => void;
};

export class RovingFocusItem<T extends HTMLElement = HTMLElement> {
	readonly #opts: RovingFocusItemOptions<T>;
	readonly attachment: RefAttachment<T>;
	#tabIndex = $state(0);

	constructor(opts: RovingFocusItemOptions<T>) {
		this.#opts = opts;
		this.attachment = attachRef<T>(opts.setRef, opts.onRefChange);
		this.handleKeydown = this.handleKeydown.bind(this);

		$effect(() => {
			if (!(this.#opts.enabled?.() ?? true)) {
				this.#tabIndex = 0;
				return;
			}

			this.#tabIndex = this.#opts.group.getTabIndex(this.#opts.ref());
		});
	}

	handleKeydown(e: KeyboardEvent) {
		if (!(this.#opts.enabled?.() ?? true)) return;
		return this.#opts.group.handleKeydown(this.#opts.ref(), e);
	}

	readonly props = $derived.by(
		() =>
			({
				tabindex: this.#tabIndex,
				...this.attachment,
			}) as const,
	);
}
