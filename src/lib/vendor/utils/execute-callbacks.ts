/**
 * Combines callbacks into one function that invokes each with the same args.
 * @template Args The argument types the callbacks accept.
 * @param callbacks Callbacks to execute (nullish entries are skipped).
 * @returns A function that calls every callback with the same arguments.
 */
export const executeCallbacks =
	<Args extends unknown[]>(...callbacks: (((...args: Args) => void) | undefined)[]) =>
	(...args: Args): void => {
		for (const callback of callbacks) callback?.(...args);
	};
