import { type ReadableBox, type RefAttachment, type WritableBox, attachRef } from '$lib/internal/tools/index.js';
import type { RovingFocusGroup } from './roving-focus-group.js';

type MaybeReadableBoolean = boolean | ReadableBox<boolean>;

type RovingFocusItemOptions<T extends HTMLElement = HTMLElement> = {
	group: RovingFocusGroup;
	ref: WritableBox<T | null>;
	enabled?: MaybeReadableBoolean;
	both?: MaybeReadableBoolean;
	onRefChange?: (node: T | null) => void;
};

function readBoolean(value: MaybeReadableBoolean | undefined, fallback: boolean) {
	if (value === undefined) return fallback;
	return typeof value === 'boolean' ? value : value.current;
}

export class RovingFocusItem<T extends HTMLElement = HTMLElement> {
	readonly #opts: RovingFocusItemOptions<T>;
	readonly attachment: RefAttachment<T>;
	#tabIndex = $state(0);

	constructor(opts: RovingFocusItemOptions<T>) {
		this.#opts = opts;
		this.attachment = attachRef(opts.ref, opts.onRefChange);
		this.handleKeydown = this.handleKeydown.bind(this);

		$effect(() => {
			if (!readBoolean(this.#opts.enabled, true)) {
				this.#tabIndex = 0;
				return;
			}

			this.#tabIndex = this.#opts.group.getTabIndex(this.#opts.ref.current);
		});
	}

	handleKeydown(e: KeyboardEvent) {
		if (!readBoolean(this.#opts.enabled, true)) return;
		return this.#opts.group.handleKeydown(this.#opts.ref.current, e, readBoolean(this.#opts.both, false));
	}

	readonly props = $derived.by(
		() =>
			({
				tabindex: this.#tabIndex,
				...this.attachment,
			}) as const,
	);
}
