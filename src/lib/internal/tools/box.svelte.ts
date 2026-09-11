import { untrack } from 'svelte';

/** What a vendored engine reads a reactive option through. Any object with a `current` qualifies. */
export type ReadableBox<T> = {
	readonly current: T;
};

export type WritableBox<T> = {
	current: T;
};

export function boxWith<T>(getter: () => T): ReadableBox<T>;
export function boxWith<T>(getter: () => T, setter: (v: T) => void): WritableBox<T>;
export function boxWith<T>(getter: () => T, setter?: (v: T) => void) {
	if (setter) {
		return {
			get current() {
				return getter();
			},
			set current(v: T) {
				setter(v);
			},
		};
	}

	return {
		get current() {
			return getter();
		},
	};
}

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
