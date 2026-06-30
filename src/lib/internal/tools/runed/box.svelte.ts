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
