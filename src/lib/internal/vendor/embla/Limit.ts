import { type NumberStoreInputType, mapStoreToNumber } from './utils';

export type LimitType = {
	min: number;
	max: number;
	length: number;
	clamp: (input: NumberStoreInputType) => number;
	pastAnyBound: (input: NumberStoreInputType) => boolean;
	pastMaxBound: (input: NumberStoreInputType) => boolean;
	pastMinBound: (input: NumberStoreInputType) => boolean;
	removeOffset: (input: NumberStoreInputType) => number;
};

export const Limit = (min: number = 0, max: number = 0): LimitType => {
	const length = Math.abs(min - max);

	const pastMinBound = (input: number): boolean => input < min;

	const pastMaxBound = (input: number): boolean => input > max;

	const pastAnyBound = (input: number): boolean => pastMinBound(input) || pastMaxBound(input);

	const clamp = (input: number): number => {
		if (!pastAnyBound(input)) return input;
		return pastMinBound(input) ? min : max;
	};

	const removeOffset = (input: number): number => {
		if (!length) return input;
		return input - length * Math.ceil((input - max) / length);
	};

	const self: LimitType = {
		length,
		max,
		min,
		clamp: mapStoreToNumber(clamp),
		pastAnyBound: mapStoreToNumber(pastAnyBound),
		pastMaxBound: mapStoreToNumber(pastMaxBound),
		pastMinBound: mapStoreToNumber(pastMinBound),
		removeOffset: mapStoreToNumber(removeOffset),
	};
	return self;
};
