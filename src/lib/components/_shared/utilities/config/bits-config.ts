import { createContext } from 'svelte';
import { type ReadableProp, type ReadableProps } from '$lib/vendor/index';
import type { BitsConfigPropsWithoutChildren } from '$lib/components/_shared/utilities/config/index';

type BitsConfigStateProps = ReadableProps<BitsConfigPropsWithoutChildren>;

const [getBitsConfigContext, setBitsConfigContext] = createContext<BitsConfigState>();

function isMissingContextError(error: unknown) {
	return error instanceof Error && (error.message.includes('missing_context') || error.message.includes('/e/missing_context'));
}

function getBitsConfigContextOr<T>(fallback: T): BitsConfigState | T {
	try {
		return getBitsConfigContext();
	} catch (error) {
		if (isMissingContextError(error)) return fallback;
		throw error;
	}
}

/**
 * Creates and sets a new Bits UI configuration state that inherits from parent configs.
 */
export function useBitsConfig(opts: BitsConfigStateProps) {
	const parent = getBitsConfigContextOr(null);
	return setBitsConfigContext(new BitsConfigState(parent, opts));
}

export class BitsConfigState {
	readonly opts: Required<BitsConfigStateProps>;

	constructor(parent: BitsConfigState | null, opts: BitsConfigStateProps) {
		this.opts = {
			defaultPortalTo: resolveConfigOption(parent, opts, (config) => config.defaultPortalTo),
			defaultLocale: resolveConfigOption(parent, opts, (config) => config.defaultLocale),
		};
	}
}

/**
 * Gets the current Bits UI configuration state from the context.
 *
 * Returns a default configuration where all values are `undefined`
 * if no configuration provider is found.
 */
export function getBitsConfig() {
	return getBitsConfigContextOr(defaultBitsConfig).opts;
}

const defaultBitsConfig = new BitsConfigState(null, {});

type ConfigOptionGetter<T> = (config: BitsConfigStateProps) => ReadableProp<T> | undefined;

function resolveConfigOption<T>(
	parent: BitsConfigState | null,
	currentOpts: BitsConfigStateProps,
	getter: ConfigOptionGetter<T>,
): ReadableProp<T | undefined> {
	return {
		get current() {
			const value = getter(currentOpts)?.current;
			if (value !== undefined) return value;

			return parent ? getter(parent.opts)?.current : undefined;
		},
	};
}
