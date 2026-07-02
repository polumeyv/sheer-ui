import { Limit } from './Limit';

export type CounterType = {
	get: () => number;
	set: (input: number) => void;
	normalize: (input: number) => number;
};

export const Counter = (max: number, start: number, loop: boolean): CounterType => {
	const { clamp } = Limit(0, max);
	const loopEnd = max + 1;

	// Pure index-space arithmetic: clamp when static, wrap when looping.
	const normalize = (input: number): number => (!loop ? clamp(input) : Math.abs((loopEnd + input) % loopEnd));

	// Reactive so index reads (selectedSnap, canGoToNext/Prev) work inside deriveds.
	// Only written on snap change (ScrollTo), never per animation frame.
	let counter = $state(normalize(start));

	const get = (): number => counter;

	const set = (input: number): void => {
		counter = normalize(input);
	};

	return { get, set, normalize };
};
