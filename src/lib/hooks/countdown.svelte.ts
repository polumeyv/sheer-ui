/** A restartable whole-seconds countdown for a component: `start(seconds)` shows `seconds` at once, then one less every
 *  second down to `0`, ending any run in progress; `stop()` ends the run and shows `0`; the owning component's teardown
 *  stops it too. Call during component init, like `$effect`. */
export function createCountdown() {
	let seconds = $state(0);
	let timer: ReturnType<typeof setInterval> | undefined;

	const stop = () => {
		clearInterval(timer);
		seconds = 0;
	};
	const start = (duration: number) => {
		clearInterval(timer);
		seconds = Math.max(0, Math.ceil(duration));
		if (seconds > 0)
			timer = setInterval(() => {
				seconds -= 1;
				if (seconds <= 0) clearInterval(timer);
			}, 1000);
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
