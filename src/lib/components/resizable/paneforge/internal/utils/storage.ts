import { LOCAL_STORAGE_DEBOUNCE_INTERVAL } from '../constants.js';
import type { PaneState } from '../../paneforge.svelte.js';

export interface PaneConfigState {
	expandToSizes: { [paneId: string]: number };
	layout: number[];
}

export interface SerializedPaneGroupState {
	[paneIds: string]: PaneConfigState;
}

export interface PaneGroupStorage {
	getItem: (name: string) => string | null;
	setItem: (name: string, value: string) => void;
}

/**
 * Initializes the storage object with the appropriate getItem
 * and setItem functions depending on the environment (browser or not).
 */
export const initializeStorage = (storageObject: PaneGroupStorage): void => {
	try {
		if (typeof localStorage === 'undefined') throw new TypeError('localStorage is not supported in this environment');
		storageObject.getItem = (name) => localStorage.getItem(name);
		storageObject.setItem = (name, value) => localStorage.setItem(name, value);
	} catch (err) {
		console.error(err);
		storageObject.getItem = () => null;
		storageObject.setItem = () => {};
	}
};

const getPaneGroupKey = (autoSaveId: string) => `paneforge:${autoSaveId}`;

/** Key derived from pane order + constraints, stable across reorderings of the array. */
const getPaneKey = (panes: PaneState[]) =>
	panes
		.map(({ opts, constraints }) =>
			opts.order.current ? `${opts.order.current}:${JSON.stringify(constraints)}` : JSON.stringify(constraints),
		)
		.sort()
		.join(',');

/** Loads the serialized pane group state from storage, or null if missing/corrupt. */
const loadSerializedPaneGroupState = (autoSaveId: string, storage: PaneGroupStorage): SerializedPaneGroupState | null => {
	try {
		const parsed = JSON.parse(storage.getItem(getPaneGroupKey(autoSaveId)) || '');
		if (typeof parsed === 'object' && parsed !== null) return parsed as SerializedPaneGroupState;
	} catch {
		// noop
	}
	return null;
};

/** Loads the pane group state from storage, or null if not found. */
export const loadPaneGroupState = (autoSaveId: string, panesArray: PaneState[], storage: PaneGroupStorage): PaneConfigState | null =>
	(loadSerializedPaneGroupState(autoSaveId, storage) || {})[getPaneKey(panesArray)] || null;

/** Saves the pane group state to storage. */
export const savePaneGroupState = (
	autoSaveId: string,
	panesArray: PaneState[],
	paneSizesBeforeCollapse: Map<string, number>,
	sizes: number[],
	storage: PaneGroupStorage,
): void => {
	const state = loadSerializedPaneGroupState(autoSaveId, storage) || {};
	state[getPaneKey(panesArray)] = {
		expandToSizes: Object.fromEntries(paneSizesBeforeCollapse),
		layout: sizes,
	};

	try {
		storage.setItem(getPaneGroupKey(autoSaveId), JSON.stringify(state));
	} catch (error) {
		console.error(error);
	}
};

/** Returns a debounced version of the given function. */
const debounce = <A extends unknown[]>(callback: (...args: A) => void, durationMs = 10) => {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	return (...args: A) => {
		if (timeoutId !== null) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => callback(...args), durationMs);
	};
};

const debounceMap: { [key: string]: typeof savePaneGroupState } = {};

/**
 * Updates the values in storage based on the current state of the pane group.
 * Debounced to limit the frequency of storage writes.
 */
export const updateStorageValues = ({
	autoSaveId,
	layout,
	storage,
	panesArray,
	paneSizeBeforeCollapse,
}: {
	autoSaveId: string;
	layout: number[];
	storage: PaneGroupStorage;
	panesArray: PaneState[];
	paneSizeBeforeCollapse: Map<string, number>;
}) => {
	if (layout.length === 0 || layout.length !== panesArray.length) return;

	const debouncedSave = (debounceMap[autoSaveId] ??= debounce(savePaneGroupState, LOCAL_STORAGE_DEBOUNCE_INTERVAL));

	// Clone mutable data before passing to the debounced function,
	// else we risk saving a stale combination of mutable and immutable values.
	debouncedSave(autoSaveId, [...panesArray], new Map(paneSizeBeforeCollapse), layout, storage);
};
