import { boxAutoReset, type WritableBox } from './tools/index.js';
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
	readonly #search: WritableBox<string>;

	constructor(opts: TypeaheadOpts<T>) {
		this.#opts = opts;
		this.#search = boxAutoReset('', {
			afterMs: 1000,
			getWindow: opts.getWindow,
		});
	}

	get search() {
		return this.#search.current;
	}

	handleKey(key: string, candidates: T[]) {
		if (!candidates.length) return;

		this.#search.current = this.#search.current + key;

		const currentCandidate = this.#opts.getCurrentCandidate();
		const current = candidates.find((candidate) => candidate === currentCandidate);
		const currentMatch = current === undefined ? '' : this.#opts.getSearchText(current);

		const values = candidates.map((candidate) => this.#opts.getSearchText(candidate));
		const nextMatch = getNextMatch(values, this.#search.current, currentMatch);
		const newCandidate = candidates.find((candidate) => this.#opts.getSearchText(candidate) === nextMatch);
		if (newCandidate) this.#opts.onMatch(newCandidate);
		return newCandidate;
	}

	reset() {
		this.#search.current = '';
	}
}
