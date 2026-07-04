import { on } from 'svelte/events';

type EventNameType = keyof DocumentEventMap | keyof WindowEventMap;
type EventHandlerType = (evt: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
type EventOptionsType = boolean | AddEventListenerOptions | undefined;
type EventRemoverType = () => void;

export type EventStoreType = {
	add: (node: EventTarget, type: EventNameType, handler: EventHandlerType, options?: EventOptionsType) => EventStoreType;
	clear: () => void;
};

export const EventStore = (): EventStoreType => {
	let listeners: EventRemoverType[] = [];

	const normalizeEventOptions = (options: EventOptionsType): AddEventListenerOptions | undefined => {
		if (typeof options === 'boolean') return { capture: options };
		return options;
	};

	const add = (
		node: EventTarget,
		type: EventNameType,
		handler: EventHandlerType,
		options: EventOptionsType = { passive: true },
	): EventStoreType => {
		let removeListener: EventRemoverType;

		if ('addEventListener' in node) {
			removeListener = on(node, type, handler, normalizeEventOptions(options));
		} else {
			const legacyMediaQueryList = <MediaQueryList>node;
			legacyMediaQueryList.addListener(handler);
			removeListener = () => legacyMediaQueryList.removeListener(handler);
		}

		listeners.push(removeListener);
		return self;
	};

	const clear = (): void => {
		listeners = listeners.filter((remove) => remove());
	};

	const self: EventStoreType = {
		add,
		clear,
	};
	return self;
};
