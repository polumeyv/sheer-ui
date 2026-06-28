import type { AnyFn } from './types.js';

/**
 * A self-cancelling timeout. `start()` (re)schedules `cb` after `getInterval()` ms,
 * `stop()` clears it; auto-stops when the owning component/effect is destroyed.
 */
export function createEffectTimeout<T extends AnyFn>(cb: T, getDelay: () => number) {
	let timer: ReturnType<typeof setTimeout> | undefined;

	const stop = () => {
		if (timer === undefined) return;

		clearTimeout(timer);
		timer = undefined;
	};

	const start = (...args: Parameters<T>) => {
		stop();

		timer = setTimeout(() => {
			timer = undefined;
			cb(...args);
		}, getDelay());
	};

	$effect(() => stop);

	return { start, stop };
}