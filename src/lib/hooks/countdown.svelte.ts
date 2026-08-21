/** Whole seconds left until `untilMs`, one value per second, ending at `0`. The first value is yielded at once (`0`
 *  when the instant has already passed), each next one right after the second boundary it describes, so a display
 *  fed by `for await` never shows a stale number. Aborting `signal` ends the sequence without a final `0`; the
 *  pending tick's timer is left to lapse on its own (at most a second) rather than woken early. */
export async function* countdown(untilMs: number, signal?: AbortSignal): AsyncGenerator<number, void, undefined> {
	while (!signal?.aborted) {
		const seconds = Math.max(0, Math.ceil((untilMs - Date.now()) / 1000));
		yield seconds;
		if (seconds === 0) return;
		await new Promise((resolve) => setTimeout(resolve, untilMs - (seconds - 1) * 1000 - Date.now()));
	}
}

/** A restartable per-component countdown. `start(seconds)` counts `seconds` (whole seconds, read from `.seconds`)
 *  down to `0`, ending any run still in progress; `stop()` ends the current run where it stands; the owning
 *  component's teardown stops it too. */
export function createCountdown() {
	let seconds = $state(0);
	let run: AbortController | undefined;

	const stop = () => run?.abort();
	const start = (durationS: number) => {
		stop();
		const { signal } = (run = new AbortController());
		void (async () => {
			for await (const s of countdown(Date.now() + durationS * 1000, signal)) seconds = s;
		})();
	};

	$effect(() => stop);

	return {
		start,
		stop,
		get seconds() {
			return seconds;
		},
	};
}
