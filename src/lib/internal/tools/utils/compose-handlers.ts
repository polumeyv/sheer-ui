import type { EventCallback } from './events.js';
import type { ReadableBox } from '../runed/box.svelte.js';

/**
 * Composes event handlers into a single function that can be called with an event.
 * If the previous handler cancels the event using `event.preventDefault()`, the handlers
 * that follow will not be called.
 */
export function composeHandlers<E extends Event = Event, T extends Element = Element>(
	...handlers: Array<EventCallback<E> | ReadableBox<EventCallback<E>> | undefined>
): (e: E) => void {
	return function (this: T, e: E) {
		for (const handler of handlers) {
			if (!handler) continue;
			if (e.defaultPrevented) return;
			if (typeof handler === 'function') {
				handler.call(this, e);
			} else {
				handler.current?.call(this, e);
			}
		}
	};
}

/**
 * Merges event handlers into one function that calls all of them with the same event, regardless
 * of whether an earlier handler called `event.preventDefault()`. Use this instead of
 * `composeHandlers` when every handler must run unconditionally — e.g. internal bookkeeping that
 * has to stay correct even if some unrelated code already prevented default on the event.
 */
export function mergeHandlers<E extends Event = Event>(...handlers: Array<EventCallback<E> | null | undefined | false>): (e: E) => void {
	return (e: E) => {
		for (const handler of handlers) {
			if (typeof handler === 'function') handler(e);
		}
	};
}
