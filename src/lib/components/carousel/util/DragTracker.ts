import { type AxisOptionType, type AxisType } from './Axis';
import { isMouseEvent, type WindowType } from './utils';

type PointerCoordType = keyof Touch | keyof MouseEvent;
export type PointerEventType = TouchEvent | MouseEvent;

export type DragTrackerType = {
	init: (ownerWindow: WindowType) => void;
	pointerDown: (evt: PointerEventType) => number;
	pointerMove: (evt: PointerEventType) => number;
	pointerUp: (evt: PointerEventType) => number;
	readPoint: (evt: PointerEventType, evtAxis?: AxisOptionType) => number;
};

export const DragTracker = (axis: AxisType): DragTrackerType => {
	const logInterval = 170;

	let windowInstance: WindowType;
	let startEvent: PointerEventType;
	let lastEvent: PointerEventType;

	const init = (ownerWindow: WindowType): void => {
		windowInstance = ownerWindow;
	};

	const readTime = (evt: PointerEventType): number => evt.timeStamp;

	const readPoint = (evt: PointerEventType, evtAxis?: AxisOptionType): number => {
		const property = evtAxis || axis.scroll;
		const coord: PointerCoordType = `client${property === 'x' ? 'X' : 'Y'}`;
		return (isMouseEvent(evt, windowInstance) ? evt : evt.touches[0]!)[coord];
	};

	const pointerDown = (evt: PointerEventType): number => {
		startEvent = evt;
		lastEvent = evt;
		return readPoint(evt);
	};

	const pointerMove = (evt: PointerEventType): number => {
		const diff = readPoint(evt) - readPoint(lastEvent);
		const expired = readTime(evt) - readTime(startEvent) > logInterval;

		lastEvent = evt;
		if (expired) startEvent = evt;
		return diff;
	};

	const pointerUp = (evt: PointerEventType): number => {
		if (!startEvent || !lastEvent) return 0;
		const diffDrag = readPoint(lastEvent) - readPoint(startEvent);
		const diffTime = readTime(evt) - readTime(startEvent);
		const expired = readTime(evt) - readTime(lastEvent) > logInterval;
		const force = diffDrag / diffTime;
		const isFlick = diffTime && !expired && Math.abs(force) > 0.1;

		return isFlick ? force : 0;
	};

	const self: DragTrackerType = {
		init,
		pointerDown,
		pointerMove,
		pointerUp,
		readPoint,
	};
	return self;
};
