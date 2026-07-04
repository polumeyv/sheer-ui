import { type NumberStoreInputType, mapStoreToNumber } from './utils';

export type NumberStoreType = {
	get: () => number;
	set: (input: NumberStoreInputType) => void;
	add: (input: NumberStoreInputType) => void;
	subtract: (input: NumberStoreInputType) => void;
	plus: (input: NumberStoreInputType) => number;
	minus: (input: NumberStoreInputType) => number;
};

export const NumberStore = (initialValue: number): NumberStoreType => {
	let value = initialValue || 0;

	const get = (): number => value;

	const set = (input: number): void => {
		value = input;
	};

	const add = (input: number): void => {
		value += input;
	};

	const subtract = (input: number): void => {
		add(-input);
	};

	const plus = (input: number): number => value + input;

	const minus = (input: number): number => plus(-input);

	const self: NumberStoreType = {
		get,
		set: mapStoreToNumber(set),
		add: mapStoreToNumber(add),
		subtract: mapStoreToNumber(subtract),
		plus: mapStoreToNumber(plus),
		minus: mapStoreToNumber(minus),
	};
	return self;
};
