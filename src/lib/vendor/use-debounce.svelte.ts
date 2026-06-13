type Getter<T> = () => T;
type MaybeGetter<T> = T | Getter<T>;
import { extract } from './extract.svelte';

type UseDebounceReturn<Args extends unknown[], Return> = ((this: unknown, ...args: Args) => Promise<Return>) & {
	cancel: () => void;
	runScheduledNow: () => Promise<void>;
	pending: boolean;
};

type DebounceContext<Return> = {
	timeout: ReturnType<typeof setTimeout> | null;
	runner: (() => Promise<void>) | null;
	resolve: (value: Return) => void;
	reject: (reason: unknown) => void;
	promise: Promise<Return>;
};

/**
 * Function that takes a callback, and returns a debounced version of it.
 * When calling the debounced function, it will wait for the specified time
 * before calling the original callback. If the debounced function is called
 * again before the time has passed, the timer will be reset.
 *
 * You can await the debounced function to get the value when it is eventually
 * called.
 *
 * The second parameter is the time to wait before calling the original callback.
 * Alternatively, it can also be a getter function that returns the time to wait.
 * @param callback The callback to call when the time has passed.
 * @param wait The length of time to wait in ms, defaults to 250.
 */
export function useDebounce<Args extends unknown[], Return>(
	callback: (...args: Args) => Return,
	wait?: MaybeGetter<number | undefined>,
): UseDebounceReturn<Args, Return> {
	// `context` holds the in-flight debounce state. It's intentionally a plain
	// variable, not `$state`: only `pending` needs to be observable, so wrapping
	// the whole context (and its promise + resolvers) in a deep reactive proxy
	// would be wasted work on every call.
	let context: DebounceContext<Return> | null = null;
	let isPending = $state(false);
	const wait$ = $derived(extract(wait, 250));

	function debounced(this: unknown, ...args: Args) {
		if (context) {
			// Old context will be reused so callers awaiting the promise will get the
			// new value
			if (context.timeout) {
				clearTimeout(context.timeout);
			}
		} else {
			// No old context, create a new one
			let resolve: (value: Return) => void;
			let reject: (reason: unknown) => void;
			const promise = new Promise<Return>((res, rej) => {
				resolve = res;
				reject = rej;
			});

			context = {
				timeout: null,
				runner: null,
				promise,
				resolve: resolve!,
				reject: reject!,
			};
		}

		context.runner = async () => {
			// Grab the context and reset it
			// -> new debounced calls will create a new context
			if (!context) return;
			const ctx = context;
			context = null;
			isPending = false;

			try {
				ctx.resolve(await callback.apply(this, args));
			} catch (error) {
				ctx.reject(error);
			}
		};

		context.timeout = setTimeout(context.runner, wait$);
		isPending = true;

		return context.promise;
	}

	debounced.cancel = async () => {
		if (!context || context.timeout === null) {
			// Wait one event loop to see if something triggered the debounced function
			await new Promise((resolve) => setTimeout(resolve, 0));
			if (!context || context.timeout === null) return;
		}

		clearTimeout(context.timeout);
		// Mark the promise as handled so a cancelled, never-awaited call can't
		// surface as an unhandled rejection. Genuine awaiters still observe it.
		void context.promise.catch(() => {});
		context.reject('Cancelled');
		context = null;
		isPending = false;
	};

	debounced.runScheduledNow = async () => {
		if (!context || !context.timeout) {
			// Wait one event loop to see if something triggered the debounced function
			await new Promise((resolve) => setTimeout(resolve, 0));
			if (!context || !context.timeout) return;
		}

		clearTimeout(context.timeout);
		context.timeout = null;
		isPending = false;

		await context.runner?.();
	};

	Object.defineProperty(debounced, 'pending', {
		enumerable: true,
		get() {
			return isPending;
		},
	});

	return debounced as unknown as UseDebounceReturn<Args, Return>;
}
