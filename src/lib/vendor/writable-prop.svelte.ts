import type { WritableProp } from './utils.js';

/**
 * A standalone writable reactive cell exposed as a `{ current }` accessor — the
 * box-free replacement for the old `simpleBox`/`box()`. Backed by `$state`, so
 * reads of `.current` inside a `$derived`/`$effect`/template track it and writes
 * trigger updates. Use for state a class owns itself (no external getter to defer
 * to); for props handed in from a component, build the accessor inline from
 * `$props()` instead.
 */
export function writableProp<T>(initial: T): WritableProp<T>;
export function writableProp<T>(): WritableProp<T | undefined>;
export function writableProp(initial?: unknown) {
	let current = $state(initial);
	return {
		get current() {
			return current as unknown;
		},
		set current(v: unknown) {
			current = v;
		},
	};
}
