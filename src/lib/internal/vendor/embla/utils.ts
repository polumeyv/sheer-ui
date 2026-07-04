import { type PointerEventType } from './DragTracker';
import { type NumberStoreType } from './NumberStore';

export type WindowType = Window & typeof globalThis;

export type NumberStoreInputType = NumberStoreType | number;

export const isNumber = (subject: unknown): subject is number => typeof subject === 'number';

export const isObject = (subject: unknown): subject is Record<string, unknown> =>
	Object.prototype.toString.call(subject) === '[object Object]';

export const mapStoreToNumber =
	<ReturnType>(callback: (input: number) => ReturnType): ((input: NumberStoreInputType) => ReturnType) =>
	(input) =>
		callback(isNumber(input) ? input : input.get());

// Clamped to 0 so empty arrays index to slot 0 rather than -1 (Counter max, start locations).
export const arrayLastIndex = (array: unknown[]): number => Math.max(0, array.length - 1);

export const arrayIsLastIndex = (array: unknown[], index: number): boolean => index === arrayLastIndex(array);

export const arrayFromRange = (end: number, start: number = 0): number[] =>
	Array.from({ length: end - start + 1 }, (_, index) => start + index);

export const objectsMergeDeep = (objectA: Record<string, unknown>, objectB: Record<string, unknown>): Record<string, unknown> => {
	const merged: Record<string, unknown> = { ...objectA };

	for (const [key, valueB] of Object.entries(objectB)) {
		const valueA = merged[key];

		merged[key] = isObject(valueA) && isObject(valueB) ? objectsMergeDeep(valueA, valueB) : valueB;
	}

	return merged;
};

export const isMouseEvent = (evt: PointerEventType, ownerWindow: WindowType): evt is MouseEvent =>
	typeof ownerWindow.MouseEvent !== 'undefined' && evt instanceof ownerWindow.MouseEvent;
