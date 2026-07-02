import { mergeDisposers } from '$lib/internal/tools/index.js';
import { SharedState } from '$lib/internal/shared-state.svelte.js';
import { on } from 'svelte/events';

/**
 * The active input modality — keyboard or pointer. Same shape whether it's tracked globally from
 * document events or locally from a component's own handlers; only the source of truth differs.
 */
export type InputModality = {
	readonly isKeyboard: boolean;
	keyboard(): void;
	pointer(): void;
	reset(): void;
};

/**
 * Local modality: a reactive flag the consumer drives from its own handlers. No listeners — use this
 * when the component already sees every event it cares about and only needs the vocabulary.
 */
export function createInputModality(): InputModality {
	let isKeyboard = $state(false);
	return {
		get isKeyboard() {
			return isKeyboard;
		},
		keyboard() {
			isKeyboard = true;
		},
		pointer() {
			isKeyboard = false;
		},
		reset() {
			isKeyboard = false;
		},
	};
}

/**
 * Global modality: one shared, reference-counted set of capture-phase document listeners
 * (`keydown` → keyboard, `pointerdown` → pointer), reused via `SharedState` so listeners attach on
 * the first consumer and detach when the last one tears down.
 */
const globalInputModality = new SharedState((): InputModality => {
	let isKeyboard = $state(false);

	const stop = mergeDisposers(
		on(document, 'pointerdown', () => (isKeyboard = false), { capture: true }),
		on(document, 'keydown', () => (isKeyboard = true), { capture: true }),
	);
	$effect(() => stop);

	return {
		get isKeyboard() {
			return isKeyboard;
		},
		keyboard() {
			isKeyboard = true;
		},
		pointer() {
			isKeyboard = false;
		},
		reset() {
			isKeyboard = false;
		},
	};
});

export function useGlobalInputModality(): InputModality {
	return globalInputModality.get();
}
