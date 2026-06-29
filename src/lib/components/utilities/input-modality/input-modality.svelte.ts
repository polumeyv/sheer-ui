import { type AnyFn, executeCallbacks } from '$lib/internal/tools/index.js';
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

let globalIsKeyboard = $state(false);
let refs = 0;
let stop: AnyFn | undefined;

/**
 * Global modality: one shared, reference-counted set of capture-phase document listeners
 * (`keydown` → keyboard, `pointerdown` → pointer). Every consumer reads the same flag; listeners
 * attach on the first consumer and detach when the last one tears down.
 */
export function useGlobalInputModality(): InputModality {
	$effect(() => {
		if (refs === 0) {
			stop = executeCallbacks(
				on(document, 'pointerdown', () => (globalIsKeyboard = false), { capture: true }),
				on(document, 'keydown', () => (globalIsKeyboard = true), { capture: true }),
			);
		}
		refs++;

		return () => {
			refs--;
			if (refs === 0) {
				globalIsKeyboard = false;
				stop?.();
				stop = undefined;
			}
		};
	});

	return {
		get isKeyboard() {
			return globalIsKeyboard;
		},
		keyboard() {
			globalIsKeyboard = true;
		},
		pointer() {
			globalIsKeyboard = false;
		},
		reset() {
			globalIsKeyboard = false;
		},
	};
}
