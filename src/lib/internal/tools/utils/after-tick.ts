import { tick } from 'svelte';

/** Runs `fn` after the next DOM update flushes. */
export function afterTick(fn: () => void): void {
	tick().then(fn);
}
