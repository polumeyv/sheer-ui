/**
 * Realm-global singleton keyed on `globalThis`, so layer stacks and the id counter
 * survive multiple module-graph copies of this library in one page (e.g. two bundles).
 * Replaces the ambient `app.d.ts` globals: ambient declarations don't travel when the
 * library is consumed as workspace source, a typed accessor does.
 */
export function globalSingleton<T>(key: string, init: () => T): T {
	const globals = globalThis as unknown as Record<string, T>;
	return (globals[key] ??= init());
}
