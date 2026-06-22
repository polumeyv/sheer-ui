import { getContext, setContext } from 'svelte';
import type { SonnerState } from '../toast-state.svelte.js';

class Context<T> {
	readonly #key: symbol;

	constructor(name: string) {
		this.#key = Symbol(name);
	}

	get() {
		return getContext<T>(this.#key);
	}

	set(value: T) {
		return setContext(this.#key, value);
	}
}

export const sonnerContext = new Context<SonnerState>('<Toaster/>');
