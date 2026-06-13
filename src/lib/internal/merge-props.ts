/**
 * Folds N prop objects left-to-right into one, with per-key rules: DOM event
 * handlers compose, same-name functions chain, `class` joins, `style` merges
 * (object or string, either direction), everything else is last-write-wins.
 *
 * Owned orchestration. `class` goes through overrule's `join`, guarded in dev (see
 * `joinClass`): this is the caller-vs-component merge site overrule's guard is built
 * for. The leaf string/style/handler helpers are still imported from the vendored
 * toolbelt — they're pure, framework-neutral functions, not the box/watch machinery;
 * relocating them is the last step of deleting the vendored toolbelt.
 *
 * Adapted from react-spectrum's mergeProps via bits-ui (see vendor NOTICE).
 */
import { guard, join } from 'overrule';
import type { ClassValue } from 'overrule';
import { composeHandlers } from '$lib/vendor/compose-handlers.js';
import { executeCallbacks } from '$lib/vendor/utils/execute-callbacks.js';
import { cssToStyleObj } from '$lib/vendor/utils/merge-props.js';
import { styleToCSS } from '$lib/vendor/utils/merge-props.js';
import type { EventCallback } from '$lib/vendor/utils/events.js';
import type { StyleProperties } from '$lib/vendor/types.js';

// `class` here is the runtime caller-vs-component merge — exactly the conflict site
// overrule's guard exists for (scan.rs punts it to "the guard's job"). Guard the join
// in dev so a consumer's class silently colliding with a component's surfaces as a
// warning; production is raw `join` — guard + tailwind-merge dead-code-eliminate out.
// Same shape as `cn` in utils.ts.
const joinClass = import.meta.env.DEV ? guard(join) : join;

type Props = Record<string, unknown>;
type PropsArg = Props | null | undefined;

type TupleTypes<T> = { [P in keyof T]: T[P] } extends { [key: number]: infer V } ? NullToObject<V> : never;
type NullToObject<T> = T extends null | undefined ? Record<never, never> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

const CLASS_VALUE_PRIMITIVE_TYPES = ['string', 'number', 'bigint', 'boolean'];

function isClassValue(value: unknown): value is ClassValue {
	if (value === null || value === undefined) return true;
	if (CLASS_VALUE_PRIMITIVE_TYPES.includes(typeof value)) return true;
	if (Array.isArray(value)) return value.every((item) => isClassValue(item));
	if (typeof value === 'object') {
		if (Object.getPrototypeOf(value) !== Object.prototype) return false;
		return true;
	}
	return false;
}

export function mergeProps<T extends PropsArg[]>(...args: T): UnionToIntersection<TupleTypes<T>> & { style?: string } {
	const result: Props = { ...args[0] };

	for (let i = 1; i < args.length; i++) {
		const props = args[i];
		if (!props) continue;

		for (const key of Object.keys(props)) {
			const a = result[key];
			const b = (props as Props)[key];

			const aIsFunction = typeof a === 'function';
			const bIsFunction = typeof b === 'function';

			// Matches the original's effective behavior: upstream wrote
			// `aIsFunction && typeof bIsFunction && …`, and `typeof bIsFunction` is
			// always the truthy string "boolean", so the real gate is just
			// `aIsFunction && isEventHandler`. composeHandlers skips a non-function b.
			if (aIsFunction && key.startsWith('on') && key === key.toLowerCase() && key.length > 2) {
				result[key] = composeHandlers(a as EventCallback, b as EventCallback);
			} else if (aIsFunction && bIsFunction) {
				result[key] = executeCallbacks(a as (...args: unknown[]) => void, b as (...args: unknown[]) => void);
			} else if (key === 'class') {
				const aIsClassValue = isClassValue(a);
				const bIsClassValue = isClassValue(b);
				if (aIsClassValue && bIsClassValue) {
					result[key] = joinClass(a, b);
				} else if (aIsClassValue) {
					result[key] = joinClass(a);
				} else if (bIsClassValue) {
					result[key] = joinClass(b);
				}
			} else if (key === 'style') {
				const aIsObject = typeof a === 'object';
				const bIsObject = typeof b === 'object';
				const aIsString = typeof a === 'string';
				const bIsString = typeof b === 'string';
				if (aIsObject && bIsObject) {
					result[key] = { ...a, ...b };
				} else if (aIsObject && bIsString) {
					result[key] = { ...a, ...cssToStyleObj(b) };
				} else if (aIsString && bIsObject) {
					result[key] = { ...cssToStyleObj(a), ...b };
				} else if (aIsString && bIsString) {
					result[key] = { ...cssToStyleObj(a), ...cssToStyleObj(b) };
				} else if (aIsObject) {
					result[key] = a;
				} else if (bIsObject) {
					result[key] = b;
				} else if (aIsString) {
					result[key] = a;
				} else if (bIsString) {
					result[key] = b;
				}
			} else {
				result[key] = b !== undefined ? b : a;
			}
		}

		// symbol keys (e.g. attachments) just override
		for (const key of Object.getOwnPropertySymbols(props)) {
			const a = (result as Record<symbol, unknown>)[key];
			const b = (props as Record<symbol, unknown>)[key];
			(result as Record<symbol, unknown>)[key] = b !== undefined ? b : a;
		}
	}

	if (typeof result.style === 'object') {
		result.style = styleToCSS(result.style as StyleProperties).replaceAll('\n', ' ');
	}

	// Svelte doesn't remove `hidden`/`disabled` when set to `false`; drop them.
	if (result.hidden === false) {
		delete result.hidden;
	}
	if (result.disabled === false) {
		delete result.disabled;
	}

	return result as UnionToIntersection<TupleTypes<T>> & { style?: string };
}
