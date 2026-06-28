import { type PointerEventType } from './DragTracker';
import { type NumberStoreType } from './NumberStore';

export type WindowType = Window & typeof globalThis;

export type NumberStoreInputType = NumberStoreType | number;

export function mapStoreToNumber<ReturnType>(callback: (input: number) => ReturnType): (input: NumberStoreInputType) => ReturnType {
	return (input: NumberStoreInputType): ReturnType => {
		return callback(isNumber(input) ? input : input.get());
	};
}

export function isNumber(subject: unknown): subject is number {
	return typeof subject === 'number';
}

export function isBoolean(subject: unknown): subject is boolean {
	return typeof subject === 'boolean';
}

export function isObject(subject: unknown): subject is Record<string, unknown> {
	return Object.prototype.toString.call(subject) === '[object Object]';
}

export function deltaAbs(inputB: number, inputA: number): number {
	return Math.abs(inputB - inputA);
}

export function factorAbs(inputB: number, inputA: number): number {
	if (inputB === 0 || inputA === 0) return 0;
	if (Math.abs(inputB) <= Math.abs(inputA)) return 0;
	const diff = deltaAbs(Math.abs(inputB), Math.abs(inputA));
	return Math.abs(diff / inputB);
}

export function roundToTwoDecimals(input: number): number {
	return Math.round(input * 100) / 100;
}

export function arrayLast<Type>(array: Type[]): Type {
	return array[arrayLastIndex(array)];
}

export function arrayLastIndex<Type>(array: Type[]): number {
	return Math.max(0, array.length - 1);
}

export function arrayIsLastIndex<Type>(array: Type[], index: number): boolean {
	return index === arrayLastIndex(array);
}

export function arrayFromRange(end: number, start: number = 0): number[] {
	return Array.from(Array(end - start + 1), (_, index) => start + index);
}



export function objectsMergeDeep(objectA: Record<string, unknown>, objectB: Record<string, unknown>): Record<string, unknown> {
	return [objectA, objectB].reduce((mergedObjects, currentObject) => {
		Object.keys(currentObject).forEach((key) => {
			const valueA = mergedObjects[key];
			const valueB = currentObject[key];
			const areObjects = isObject(valueA) && isObject(valueB);

			mergedObjects[key] = areObjects ? objectsMergeDeep(valueA, valueB) : valueB;
		});
		return mergedObjects;
	}, {});
}

export function isMouseEvent(evt: PointerEventType, ownerWindow: WindowType): evt is MouseEvent {
	return typeof ownerWindow.MouseEvent !== 'undefined' && evt instanceof ownerWindow.MouseEvent;
}
