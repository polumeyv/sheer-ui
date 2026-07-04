import { globalSingleton } from './global-singleton.js';

const counter = globalSingleton('bitsIdCounter', () => ({ current: 0 }));

/**
 * Generates a unique ID based on a global counter.
 */
export function useId(prefix = "bits") {
	counter.current++;
	return `${prefix}-${counter.current}`;
}
