import type { AnyFn } from './types.js';

export class SharedState<T extends AnyFn> {
	#factory: T;
	#subscribers = 0;
	#state: ReturnType<T> | undefined = $state();
	#disposeRoot: (() => void) | undefined;

	constructor(factory: T) {
		this.#factory = factory;
	}

	#release = () => {
		this.#subscribers -= 1;

		if (this.#subscribers > 0) return;

		this.#disposeRoot?.();
		this.#disposeRoot = undefined;
		this.#state = undefined;
	};

	get(...args: Parameters<T>): ReturnType<T> {
		this.#subscribers += 1;

		this.#disposeRoot ??= $effect.root(() => {
			this.#state = this.#factory(...args);
		});

		$effect(() => this.#release);

		return this.#state!;
	}
}
