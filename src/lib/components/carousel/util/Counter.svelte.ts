import { Limit } from './Limit';

export type CounterType = {
	get: () => number;
	set: (input: number) => CounterType;
	add: (input: number) => CounterType;
	clone: () => CounterType;
};

export const Counter = (max: number, start: number, loop: boolean): CounterType => {
	const { clamp } = Limit(0, max);
	const loopEnd = max + 1;

	const normalize = (input: number): number => (!loop ? clamp(input) : Math.abs((loopEnd + input) % loopEnd));

	// Reactive so index reads (selectedSnap, canGoToNext/Prev) work inside deriveds.
	// Only written on snap change (ScrollTo), never per animation frame.
	let counter = $state(normalize(start));

	const get = (): number => counter;

	const set = (input: number): CounterType => {
		counter = normalize(input);
		return self;
	};

	const add = (input: number): CounterType => clone().set(get() + input);

	const clone = (): CounterType => Counter(max, get(), loop);

	const self: CounterType = {
		get,
		set,
		add,
		clone,
	};
	return self;
};
