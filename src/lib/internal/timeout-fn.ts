import { onDestroy } from 'svelte';
import type { AnyFn } from './types.js';

/**
 * A self-cancelling timeout. `start()` (re)schedules `cb` after `getInterval()` ms,
 * `stop()` clears it; auto-stops when the owning component is destroyed.
 */
export function timeoutFn<T extends AnyFn>(cb: T, getInterval: () => number) {
	let timer: number | null = null;

	const stop = () => {
		if (timer === null) return;
		window.clearTimeout(timer);
		timer = null;
	};

	const start = (...args: Parameters<T> | []) => {
		stop();
		timer = window.setTimeout(() => {
			timer = null;
			cb(...args);
		}, getInterval());
	};

	onDestroy(stop);

	return { start, stop };
}
