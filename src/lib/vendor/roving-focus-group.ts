import { writableProp, getWindow } from '$lib/vendor/index';
import type { ReadableProp, WritableProp } from '$lib/vendor/utils';
import { getDirectionalKeys } from './get-directional-keys';
import { kbd } from './kbd';
import type { Direction, Orientation } from '$lib/shared/index';
import { BROWSER } from '$lib/vendor/env';

type RovingFocusGroupOptions = (
	| {
			/**
			 * The attribute used to find focusable candidates.
			 */
			candidateAttr: string;
			candidateSelector?: undefined;
	  }
	| {
			/**
			 * Custom candidate selector.
			 */
			candidateSelector: string;
			candidateAttr?: undefined;
	  }
) & {
	/**
	 * The root node containing all focusable candidates.
	 */
	rootNode: WritableProp<HTMLElement | null>;

	/**
	 * Whether to loop through candidates when reaching the end.
	 */
	loop: ReadableProp<boolean>;

	/**
	 * The orientation of the roving focus group.
	 */
	orientation: ReadableProp<Orientation>;

	/**
	 * Text direction. If omitted, direction is read from the root node's computed style.
	 */
	dir?: ReadableProp<Direction>;

	/**
	 * Called when a candidate is focused.
	 */
	onCandidateFocus?: (node: HTMLElement) => void;
};

export class RovingFocusGroup {
	readonly #opts: RovingFocusGroupOptions;
	readonly #currentTabStopId = writableProp<string | null>(null);

	constructor(opts: RovingFocusGroupOptions) {
		this.#opts = opts;
	}

	getCandidateNodes() {
		const rootNode = this.#opts.rootNode.current;
		if (!BROWSER || !rootNode) return [];

		if (this.#opts.candidateSelector) {
			return Array.from(rootNode.querySelectorAll<HTMLElement>(this.#opts.candidateSelector));
		}

		if (this.#opts.candidateAttr) {
			return Array.from(rootNode.querySelectorAll<HTMLElement>(`[${this.#opts.candidateAttr}]:not([data-disabled])`));
		}

		return [];
	}

	focusFirstCandidate() {
		const items = this.getCandidateNodes();
		items[0]?.focus();
	}

	handleKeydown(node: HTMLElement | null | undefined, e: KeyboardEvent, both = false) {
		const rootNode = this.#opts.rootNode.current;
		if (!rootNode || !node) return;

		const items = this.getCandidateNodes();
		if (!items.length) return;

		const currentIndex = items.indexOf(node);
		if (currentIndex === -1) return;

		const dir = this.#opts.dir?.current ?? getWindow(node).getComputedStyle(node).direction as Direction;
		const { nextKey, prevKey } = getDirectionalKeys(dir, this.#opts.orientation.current);
		const loop = this.#opts.loop.current;

		const keyToIndex: Record<string, number> = {
			[nextKey]: currentIndex + 1,
			[prevKey]: currentIndex - 1,
			[kbd.HOME]: 0,
			[kbd.END]: items.length - 1,
		};

		if (both) {
			const altNextKey = nextKey === kbd.ARROW_DOWN ? kbd.ARROW_RIGHT : kbd.ARROW_DOWN;
			const altPrevKey = prevKey === kbd.ARROW_UP ? kbd.ARROW_LEFT : kbd.ARROW_UP;

			keyToIndex[altNextKey] = currentIndex + 1;
			keyToIndex[altPrevKey] = currentIndex - 1;
		}

		let itemIndex = keyToIndex[e.key];
		if (itemIndex === undefined) return;

		e.preventDefault();

		if (itemIndex < 0 && loop) {
			itemIndex = items.length - 1;
		} else if (itemIndex === items.length && loop) {
			itemIndex = 0;
		}

		const itemToFocus = items[itemIndex];
		if (!itemToFocus) return;

		itemToFocus.focus();
		this.#currentTabStopId.current = itemToFocus.id;
		this.#opts.onCandidateFocus?.(itemToFocus);

		return itemToFocus;
	}

	getTabIndex(node: HTMLElement | null | undefined) {
		const items = this.getCandidateNodes();
		const anyActive = this.#currentTabStopId.current !== null;

		if (node && !anyActive && items[0] === node) {
			this.#currentTabStopId.current = node.id;
			return 0;
		}

		if (node?.id === this.#currentTabStopId.current) {
			return 0;
		}

		return -1;
	}

	setCurrentTabStopId(id: string) {
		this.#currentTabStopId.current = id;
	}

	focusCurrentTabStop() {
		const currentTabStopId = this.#currentTabStopId.current;
		if (!currentTabStopId) return;

		const currentTabStop = this.#opts.rootNode.current?.querySelector(`#${currentTabStopId}`);
		if (!(currentTabStop instanceof HTMLElement)) return;

		currentTabStop.focus();
	}
}
