/**
 * The timer seam for the dismissible (interact-outside) layer.
 *
 * The layer decides "am I the responsible top layer for this outside pointer event" across a
 * few timers: a 1ms registration gate, a 10ms interact-outside debounce, and a 20ms reset. That
 * timing is the fragile part, so — mirroring the {@link AfterAnimationsRunner} seam that
 * `PresenceManager` injects — the timers are funnelled through this small contract. The default
 * adapter {@link realTimers} is the real global timers, byte-for-byte the behaviour before the
 * seam existed; tests inject a manual/fake clock to drive the windows deterministically.
 */

export type TimerHandle = ReturnType<typeof setTimeout>;

// oxlint-disable-next-line no-explicit-any -- variadic debounce, matches the original signature
export interface Debounced<T extends (...args: any[]) => any> {
	(...args: Parameters<T>): void;
	destroy(): void;
}

/** The whole timer surface the dismissible layer needs; `debounce` is built on top of it. */
export interface Timers {
	setTimeout(fn: () => void, ms: number): TimerHandle;
	clearTimeout(handle: TimerHandle | undefined): void;
}

/**
 * The layer's debounce — the *same* logic it has always used, with the timer pair parameterised,
 * so the real and fake clocks run identical code and a fake clock just supplies fake time.
 */
// oxlint-disable-next-line no-explicit-any -- variadic debounce, matches the original signature
export function debounce<T extends (...args: any[]) => any>(timers: Timers, fn: T, wait: number): Debounced<T> {
	let timeout: TimerHandle | undefined;

	const debounced = ((...args: Parameters<T>) => {
		timers.clearTimeout(timeout);
		timeout = timers.setTimeout(() => fn(...args), wait);
	}) as Debounced<T>;

	debounced.destroy = () => timers.clearTimeout(timeout);

	return debounced;
}

/** Default adapter. Wrapped, not referenced: a detached `window.setTimeout` throws Illegal invocation. */
export const realTimers: Timers = {
	setTimeout: (fn, ms) => setTimeout(fn, ms),
	clearTimeout: (handle) => clearTimeout(handle),
};
