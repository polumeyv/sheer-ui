import { untrack } from 'svelte';

type WritableCurrent<T> = {
	current: T;
};

type RangeValue<T> = {
	start: T | undefined;
	end: T | undefined;
};

interface RangeCursorSyncOptions<T extends Placeholder, Placeholder, Range extends RangeValue<T>> {
	value: WritableCurrent<Range>;
	startValue: WritableCurrent<T | undefined>;
	endValue: WritableCurrent<T | undefined>;
	placeholder: WritableCurrent<Placeholder>;
}

interface CompleteRangeValueSyncOptions<T extends Placeholder, Placeholder, Range extends RangeValue<T>>
	extends RangeCursorSyncOptions<T, Placeholder, Range> {
	updateValue: (cb: (value: Range) => Range) => void;
}

function useRangeCursorSync<T extends Placeholder, Placeholder, Range extends RangeValue<T>>(
	opts: RangeCursorSyncOptions<T, Placeholder, Range>,
) {
	$effect(() => {
		const value = opts.value.current;
		untrack(() => {
			if (value.start && value.end) {
				opts.startValue.current = value.start;
				opts.endValue.current = value.end;
			} else if (value.start) {
				opts.startValue.current = value.start;
				opts.endValue.current = undefined;
			} else if (value.start === undefined && value.end === undefined) {
				opts.startValue.current = undefined;
				opts.endValue.current = undefined;
			}
		});
	});

	$effect(() => {
		const value = opts.value.current;
		untrack(() => {
			const startValue = value.start;
			if (startValue && opts.placeholder.current !== startValue) {
				opts.placeholder.current = startValue;
			}
		});
	});
}

function useCompleteRangeValueSync<T extends Placeholder, Placeholder, Range extends RangeValue<T>>(
	opts: CompleteRangeValueSyncOptions<T, Placeholder, Range>,
) {
	$effect(() => {
		const startValue = opts.startValue.current;
		const endValue = opts.endValue.current;
		untrack(() => {
			const value = opts.value.current;
			if (value.start === startValue && value.end === endValue) {
				return;
			}

			if (startValue && endValue) {
				opts.updateValue((prev) => {
					if (prev.start === startValue && prev.end === endValue) {
						return prev;
					}
					return {
						start: startValue,
						end: endValue,
					} as Range;
				});
			} else if (value.start && value.end) {
				value.start = undefined;
				value.end = undefined;
			}
		});
	});
}

export function useCompleteRangeSync<T extends Placeholder, Placeholder, Range extends RangeValue<T>>(
	opts: CompleteRangeValueSyncOptions<T, Placeholder, Range>,
) {
	useRangeCursorSync(opts);
	useCompleteRangeValueSync(opts);
}
