/**
 * The timer seam for the dismissible (interact-outside) layer.
 *
 * The layer decides "am I the responsible top layer for this outside pointer event" across a
 * few timers: a 1ms registration gate, a 10ms interact-outside debounce, and a 20ms reset. That
 * timing is the fragile part, so — mirroring the {@link AfterAnimationsRunner} seam that
 * `PresenceManager` injects — the timers are funnelled through this small contract. The default
 * adapter {@link realScheduler} is the real global timers, byte-for-byte the behaviour before the
 * seam existed; tests inject a manual/fake clock to drive the windows deterministically.
 */

export type TimerHandle = ReturnType<typeof setTimeout>;

// oxlint-disable-next-line no-explicit-any -- variadic debounce, matches the original signature
export interface Debounced<T extends (...args: any[]) => any> {
	(...args: Parameters<T>): void;
	destroy(): void;
}

/** The minimal timer surface the dismissible layer needs. */
export interface Scheduler {
	setTimeout(fn: () => void, ms: number): TimerHandle;
	clearTimeout(handle: TimerHandle | undefined): void;
	// oxlint-disable-next-line no-explicit-any -- variadic debounce, matches the original signature
	debounce<T extends (...args: any[]) => any>(fn: T, wait?: number): Debounced<T>;
}

/**
 * Builds the `debounce` factory over a pair of timer primitives. This is the *same* logic the
 * layer has always used — only `setTimeout`/`clearTimeout` are parameterised — so the real and
 * fake adapters run identical debounce code; a fake clock just supplies fake time.
 */
export function makeDebounce(timers: Pick<Scheduler, 'setTimeout' | 'clearTimeout'>) {
	// oxlint-disable-next-line no-explicit-any -- variadic debounce, matches the original signature
	return function debounce<T extends (...args: any[]) => any>(fn: T, wait = 500): Debounced<T> {
		let timeout: TimerHandle | undefined;

		const debounced = ((...args: Parameters<T>) => {
			timers.clearTimeout(timeout);
			timeout = timers.setTimeout(() => fn(...args), wait);
		}) as Debounced<T>;

		debounced.destroy = () => timers.clearTimeout(timeout);

		return debounced;
	};
}

const realTimers: Pick<Scheduler, 'setTimeout' | 'clearTimeout'> = {
	setTimeout: (fn, ms) => setTimeout(fn, ms),
	clearTimeout: (handle) => clearTimeout(handle),
};

/** Default adapter: the real global timers, exactly as the layer used before this seam. */
export const realScheduler: Scheduler = {
	setTimeout: realTimers.setTimeout,
	clearTimeout: realTimers.clearTimeout,
	debounce: makeDebounce(realTimers),
};
