import { countdown } from 'handful';

/** A restartable countdown owned by the calling component (call during component init, like `$effect`).
 *  `start(durationS)` sets `.seconds` to the whole seconds of `durationS` at once, then counts it down to `0` on
 *  the second boundaries, ending any run still in progress first; `stop()` ends the current run and resets
 *  `.seconds` to `0`; the component's teardown stops it too. An ended run's pending timer is left to lapse on
 *  its own (at most a second); it writes nothing. */
export function createCountdown() {
	let seconds = $state(0);
	let run: AbortController | undefined;

	const stop = () => {
		run?.abort();
		seconds = 0;
	};
	const start = (durationS: number) => {
		stop();
		seconds = Math.max(0, Math.ceil(durationS));
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
