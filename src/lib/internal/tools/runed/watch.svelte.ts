import { untrack } from 'svelte';
import type { Getter } from '../types.js';

/**
 * Runs `effect` whenever the values read by `sources` change, with the effect body run
 * `untrack`ed so reads inside it don't become additional dependencies (Vue-style watcher,
 * as opposed to `$effect`'s "track everything read inside the callback" semantics).
 */
export function watch<T extends Array<unknown>>(
	sources: { [K in keyof T]: Getter<T[K]> },
	effect: (values: T, previousValues: { [K in keyof T]: T[K] | undefined }) => void | VoidFunction,
): void;
export function watch<T>(source: Getter<T>, effect: (value: T, previousValue: T | undefined) => void | VoidFunction): void;
export function watch<T>(
	sources: Getter<T> | Array<Getter<T>>,
	effect: (values: T | Array<T>, previousValues: T | undefined | Array<T | undefined>) => void | VoidFunction,
): void {
	let previousValues: T | undefined | Array<T | undefined> = Array.isArray(sources) ? [] : undefined;

	$effect(() => {
		const values = Array.isArray(sources) ? sources.map((source) => source()) : sources();

		const cleanup = untrack(() => effect(values, previousValues));
		previousValues = values;
		return cleanup;
	});
}
