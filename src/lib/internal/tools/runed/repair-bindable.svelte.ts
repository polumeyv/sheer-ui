import { untrack } from 'svelte';

/**
 * Repair a bindable value synchronously for setup/SSR, then repair it again
 * before DOM updates whenever the tracked source changes.
 */
export function repairBindable(track: () => unknown, repair: () => void) {
	repair();

	$effect.pre(() => {
		track();
		untrack(repair);
	});
}
