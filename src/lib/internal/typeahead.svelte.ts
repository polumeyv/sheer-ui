import { createEffectTimeout } from './timeout-fn.svelte.js';
import { getNextMatch } from './arrays.js';

export const textContentOf = (node: HTMLElement) => node.textContent?.trim() ?? '';

type TypeaheadOpts<T> = {
	getSearchText: (candidate: T) => string;
	getCurrentCandidate: () => T | null;
	onMatch: (candidate: T) => void;
	getWindow: () => Window & typeof globalThis;
};

export class Typeahead<T> {
	readonly #opts: TypeaheadOpts<T>;
	search = $state.raw('');
	readonly #resetTimer: ReturnType<typeof createEffectTimeout<() => void>>;

	constructor(opts: TypeaheadOpts<T>) {
		this.#opts = opts;
		this.#resetTimer = createEffectTimeout(() => this.reset(), () => 1000, opts.getWindow);
	}

	handleKey(key: string, candidates: T[]) {
		if (!candidates.length) return;

		this.search += key;
		this.#resetTimer.start();

		const currentCandidate = this.#opts.getCurrentCandidate();
		const current = candidates.find((candidate) => candidate === currentCandidate);
		const currentMatch = current === undefined ? '' : this.#opts.getSearchText(current);

		const values = candidates.map((candidate) => this.#opts.getSearchText(candidate));
		const nextMatch = getNextMatch(values, this.search, currentMatch);
		const newCandidate = candidates.find((candidate) => this.#opts.getSearchText(candidate) === nextMatch);
		if (newCandidate) this.#opts.onMatch(newCandidate);
		return newCandidate;
	}

	reset() {
		this.search = '';
		this.#resetTimer.stop();
	}
}
