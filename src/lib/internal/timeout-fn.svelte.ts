import type { AnyFn } from './types.js';

/**
 * A self-cancelling timeout. `start()` (re)schedules `cb` after `getInterval()` ms,
 * `stop()` clears it; auto-stops when the owning component/effect is destroyed.
 */
export function createEffectTimeout<T extends AnyFn>(cb: T, getDelay: () => number, getWindow: () => typeof globalThis = () => globalThis) {
	let timer: ReturnType<typeof setTimeout> | undefined;
	let timerWindow: typeof globalThis;

	const stop = () => {
		if (timer === undefined) return;

		timerWindow.clearTimeout(timer);
		timer = undefined;
	};

	const start = (...args: Parameters<T>) => {
		stop();

		timerWindow = getWindow();
		timer = timerWindow.setTimeout(() => {
			timer = undefined;
			cb(...args);
		}, getDelay());
	};

	$effect(() => stop);

	return {
		start,
		stop,
		// Not reactive: a plain `let`, only ever read from event handlers.
		get pending() {
			return timer !== undefined;
		},
	};
}
