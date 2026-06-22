import type { Getter, MaybeGetter } from '$lib/internal/toolbelt.js';

export const get = <T>(value: MaybeGetter<T>): T => (typeof value === 'function' ? (value as Getter<T>)() : value);

export const getFloatingContentCSSVars = (name: string): Record<string, string> => {
	const prefix = `--bits-${name}`;

	return {
		[`${prefix}-content-transform-origin`]: 'var(--bits-floating-transform-origin)',
		[`${prefix}-content-available-width`]: 'var(--bits-floating-available-width)',
		[`${prefix}-content-available-height`]: 'var(--bits-floating-available-height)',
		[`${prefix}-anchor-width`]: 'var(--bits-floating-anchor-width)',
		[`${prefix}-anchor-height`]: 'var(--bits-floating-anchor-height)',
	};
};
