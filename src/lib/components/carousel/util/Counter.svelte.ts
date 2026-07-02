import { Limit } from './Limit';

export type CounterType = {
	get: () => number;
	set: (input: number) => CounterType;
	add: (input: number) => CounterType;
	clone: () => CounterType;
};

export function Counter(max: number, start: number, loop: boolean): CounterType {
	const { clamp } = Limit(0, max);
	const loopEnd = max + 1;
	// Reactive so index reads (selectedSnap, canGoToNext/Prev) work inside deriveds.
	// Only written on snap change (ScrollTo), never per animation frame.
	let counter = $state(normalize(start));

	function normalize(input: number): number {
		return !loop ? clamp(input) : Math.abs((loopEnd + input) % loopEnd);
	}

	function get(): number {
		return counter;
	}

	function set(input: number): CounterType {
		counter = normalize(input);
		return self;
	}

	function add(input: number): CounterType {
		return clone().set(get() + input);
	}

	function clone(): CounterType {
		return Counter(max, get(), loop);
	}

	const self: CounterType = {
		get,
		set,
		add,
		clone,
	};
	return self;
}
