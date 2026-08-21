import { countdown } from 'handful';

/** handful's countdown with a `$state` sink: `start(seconds)` / `stop()`, `.seconds` for the template; the owning
 *  component's teardown stops it. Call during component init, like `$effect`. */
export function createCountdown() {
	let seconds = $state(0);
	const c = countdown((s) => (seconds = s));
	$effect(() => c.stop);
	return {
		start: c.start,
		stop: c.stop,
		get seconds() {
			return seconds;
		},
	};
}
