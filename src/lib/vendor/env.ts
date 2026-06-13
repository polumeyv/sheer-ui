/** Inlined replacement for `esm-env` (the only two values bits-ui reads). */
export const BROWSER = typeof document !== 'undefined';
export const DEV: boolean =
	typeof process !== 'undefined' && typeof process.env?.NODE_ENV === 'string'
		? process.env.NODE_ENV !== 'production'
		: !!import.meta.env?.DEV;
