/**
 * A registry of active "layers" (dismissible overlays, escape-key listeners, text-selection
 * locks, ...) that answers "am I responsible for handling this event right now" — the topmost
 * registered layer whose value is in the closing set, falling back to the first-registered layer
 * if none defer. `isClosingBehavior` defaults to always-true, matching stacks that don't have a
 * behavior-type distinction at all (just "the most recently registered layer is responsible").
 *
 * Each layer type gets its own stack via its own `createLayerStack()` call — they don't compete
 * with each other for "who's on top".
 */
export interface LayerStack<TInstance, TValue> {
	register(instance: TInstance, value: TValue): void;
	unregister(instance: TInstance): void;
	isResponsible(instance: TInstance): boolean;
}

export function createLayerStack<TInstance, TValue>(
	isClosingBehavior: (value: TValue) => boolean = () => true,
): LayerStack<TInstance, TValue> {
	const layers = new Map<TInstance, TValue>();

	return {
		register(instance, value) {
			layers.set(instance, value);
		},
		unregister(instance) {
			layers.delete(instance);
		},
		isResponsible(instance) {
			const entries = [...layers];
			const topMost = entries.findLast(([, value]) => isClosingBehavior(value));
			if (topMost) return topMost[0] === instance;
			const firstEntry = entries[0];
			return firstEntry !== undefined && firstEntry[0] === instance;
		},
	};
}
