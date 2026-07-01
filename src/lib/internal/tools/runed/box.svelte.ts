const BoxSymbol = Symbol('box');
const isWritableSymbol = Symbol('is-writable');

export type ReadableBox<T> = {
	readonly [BoxSymbol]: true;
	readonly current: T;
};

export type WritableBox<T> = ReadableBox<T> & {
	readonly [isWritableSymbol]: true;
	current: T;
};

function createWritableBox<T>(): WritableBox<T | undefined>;
function createWritableBox<T>(initialValue: T): WritableBox<T>;
function createWritableBox(initialValue?: unknown) {
	let current = $state(initialValue);

	return {
		[BoxSymbol]: true,
		[isWritableSymbol]: true,
		get current() {
			return current as unknown;
		},
		set current(v: unknown) {
			current = v;
		},
	};
}

/**
 * Creates a readonly box.
 *
 * @param getter Function to get the value of the box.
 * @returns A box with a `current` property whose value is the result of the getter.
 */
function boxWith<T>(getter: () => T): ReadableBox<T>;

/**
 * Creates a writable box.
 *
 * @param getter Function to get the value of the box.
 * @param setter Function to set the value of the box.
 * @returns A box with a `current` property which can be set to a new value.
 */
function boxWith<T>(getter: () => T, setter: (v: T) => void): WritableBox<T>;

function boxWith<T>(getter: () => T, setter?: (v: T) => void) {
	if (setter) {
		return {
			[BoxSymbol]: true,
			[isWritableSymbol]: true,
			get current() {
				return getter();
			},
			set current(v: T) {
				setter(v);
			},
		};
	}

	return {
		[BoxSymbol]: true,
		get current() {
			return getter();
		},
	};
}

export const box = Object.assign(createWritableBox, { with: boxWith });
export const simpleBox = createWritableBox;

export { boxWith };

type BoxAutoResetOptions<T> = {
	afterMs?: number;
	onChange?: (value: T) => void;
	getWindow: () => Window & typeof globalThis;
};

const defaultBoxAutoResetOptions: Partial<BoxAutoResetOptions<unknown>> = {
	afterMs: 10000,
	onChange: () => {},
};

/**
 * Creates a box which will be reset to the default value after some time.
 *
 * @param defaultValue The value which will be set.
 * @param afterMs      A zero-or-greater delay in milliseconds.
 */
export function boxAutoReset<T>(defaultValue: T, options: BoxAutoResetOptions<T>): WritableBox<T> {
	const { afterMs, onChange, getWindow } = { ...defaultBoxAutoResetOptions, ...options };

	let timeout: number | null = null;
	let value = $state(defaultValue);

	function resetAfter() {
		return getWindow().setTimeout(() => {
			value = defaultValue;
			onChange?.(defaultValue);
		}, afterMs);
	}

	$effect(() => {
		return () => {
			if (timeout) getWindow().clearTimeout(timeout);
		};
	});

	return boxWith(
		() => value,
		(v) => {
			value = v;
			onChange?.(v);
			if (timeout) getWindow().clearTimeout(timeout);
			timeout = resetAfter();
		},
	);
}
