import type { PointerEventType } from './DragTracker';
import type { SelectEventType } from './ScrollTo';
import type { ScrollEventType } from './ScrollAnimator';
import type { SlidesInViewEventType } from './SlidesInView';

export type CarouselEventType = keyof CarouselEventListType;

export type CarouselEventModelType<API, EventType extends keyof CarouselEventListType> = {
	api: API;
	type: CarouselEventType;
	detail: CarouselEventListType[EventType];
};

export type CarouselCreatedEventType<API> = {
	api: API;
	emit: () => boolean;
};

export type CarouselEventCallbackType<API, EventType extends keyof CarouselEventListType> = (
	api: API,
	event: CarouselEventModelType<API, EventType>,
) => boolean | void;

type EventStoreType<API> = Partial<{
	[EventType in keyof CarouselEventListType]: CarouselEventCallbackType<API, EventType>[];
}>;

export interface CarouselEventListType {
	pointerdown: PointerEventType;
	pointermove: PointerEventType;
	pointerup: PointerEventType;
	slideschanged: MutationRecord[];
	slidesinview: SlidesInViewEventType;
	select: SelectEventType;
	scroll: ScrollEventType;
	settle: null;
	destroy: null;
	reinit: null;
	resize: ResizeObserverEntry[];
	slidefocus: FocusEvent;
}

export type EventHandlerType<API> = {
	init: (carouselApi: API) => void;
	clear: () => void;
	createEvent: <EventType extends keyof CarouselEventListType>(
		type: EventType,
		detail: CarouselEventListType[EventType],
	) => CarouselCreatedEventType<API>;
	on<EventType extends keyof CarouselEventListType>(
		type: EventType,
		callback: CarouselEventCallbackType<API, EventType>,
	): EventHandlerType<API>;
	off<EventType extends keyof CarouselEventListType>(
		type: EventType,
		callback: CarouselEventCallbackType<API, EventType>,
	): EventHandlerType<API>;
};

export function EventHandler<API>(): EventHandlerType<API> {
	let eventStore: EventStoreType<API> = {};
	let api: API;

	function init(carouselApi: API): void {
		api = carouselApi;
	}

	function getStore<EventType extends keyof CarouselEventListType>(type: EventType): CarouselEventCallbackType<API, EventType>[] {
		return eventStore[type] || [];
	}

	function setStore<EventType extends keyof CarouselEventListType>(
		type: EventType,
		update: (handlers: CarouselEventCallbackType<API, EventType>[]) => CarouselEventCallbackType<API, EventType>[],
	): EventHandlerType<API> {
		eventStore = { ...eventStore, [type]: update(getStore(type)) };
		return self;
	}

	function createEventModel<EventType extends keyof CarouselEventListType>(
		type: EventType,
		detail: CarouselEventListType[EventType],
	): CarouselEventModelType<API, EventType> {
		return { api, type, detail };
	}

	function createEvent<EventType extends keyof CarouselEventListType>(
		type: EventType,
		detail: CarouselEventListType[EventType],
	): CarouselCreatedEventType<API> {
		return {
			api,
			emit: () => emit(type, detail),
		};
	}

	function emit<EventType extends keyof CarouselEventListType>(type: EventType, detail: CarouselEventListType[EventType]): boolean {
		const event = createEventModel(type, detail);
		return getStore(type).every((handler) => handler(api, event) !== false);
	}

	function on<EventType extends keyof CarouselEventListType>(
		type: EventType,
		callback: CarouselEventCallbackType<API, EventType>,
	): EventHandlerType<API> {
		setStore(type, (handlers) => {
			return handlers.includes(callback) ? handlers : [...handlers, callback];
		});

		return self;
	}

	function off<EventType extends keyof CarouselEventListType>(
		type: EventType,
		callback: CarouselEventCallbackType<API, EventType>,
	): EventHandlerType<API> {
		setStore(type, (handlers) => {
			return handlers.filter((handler) => handler !== callback);
		});

		return self;
	}

	function clear(): void {
		eventStore = {};
	}

	const self: EventHandlerType<API> = {
		init,
		clear,
		createEvent,
		on,
		off,
	};

	return self;
}
