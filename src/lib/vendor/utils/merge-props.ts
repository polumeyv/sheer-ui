/**
 * Modified from https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/utils/src/mergeProps.ts (see NOTICE.txt for source)
 */
import { join, type ClassValue } from 'overrule';
import { executeCallbacks } from '$lib/vendor/utils/execute-callbacks';
import type { EventCallback } from '$lib/internal/events.js';
import { composeHandlers } from '../compose-handlers';
import parse from 'style-to-object';
import type { StyleProperties } from '$lib/vendor/types';
import { camelCase, pascalCase } from './strings';
type Props = Record<string, unknown>;

type PropsArg = Props | null | undefined;

// Source: https://stackoverflow.com/questions/51603250/typescript-3-parameter-list-intersection-type/51604379#51604379
type TupleTypes<T> = { [P in keyof T]: T[P] } extends { [key: number]: infer V } ? NullToObject<V> : never;

type NullToObject<T> = T extends null | undefined ? {} : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type AnyFn = (...args: unknown[]) => void;

type StyleObj = Record<string, unknown>;

/**
 * Given a list of prop objects, merges them into a single object.
 * - Automatically composes event handlers (e.g. `onclick`, `oninput`, etc.)
 * - Chains regular functions with the same name so they are called in order
 * - Merges class strings with overrule's `join`
 * - Merges style objects and converts them to strings
 * - Handles a bug with Svelte where setting the `hidden` attribute to `false` doesn't remove it
 * - Overrides other values with the last one
 */
export function mergeProps<T extends PropsArg[]>(
	...args: T
): UnionToIntersection<TupleTypes<T>> & {
	style?: string;
} {
	const result: Props = { ...args[0] };

	for (let i = 1; i < args.length; i++) {
		const props = args[i];
		if (!props) continue;

		// Handle string keys
		for (const key of Object.keys(props)) {
			const a = result[key];
			const b = (props as Record<string, unknown>)[key];

			if (typeof a === 'function' && typeof b === 'function') {
				// all-lowercase `on*` = DOM event handler (onclick); camelCase `on*` = component callback (onValueChange)
				key.startsWith('on') && key.length > 2 && key === key.toLowerCase()
					? (result[key] = composeHandlers(a as EventCallback, b as EventCallback))
					: (result[key] = executeCallbacks(a as AnyFn, b as AnyFn));
			} else if (key === 'class') result[key] = join(a as ClassValue, b as ClassValue);
			else if (key === 'style') {
				// normalize each side to a style object (strings parsed, null/non-objects dropped),
				// then spread a then b so b wins on conflicts
				const aObj = typeof a === 'string' ? cssToStyleObj(a) : a && typeof a === 'object' ? (a as StyleObj) : null;
				const bObj = typeof b === 'string' ? cssToStyleObj(b) : b && typeof b === 'object' ? (b as StyleObj) : null;

				if (aObj && bObj) result[key] = { ...aObj, ...bObj };
				else if (bObj) result[key] = bObj;
				else if (aObj) result[key] = aObj;
			} else {
				// override other values
				result[key] = b !== undefined ? b : a;
			}
		}

		// handle symbol keys (mostly for `Attachments`)
		for (const key of Object.getOwnPropertySymbols(props as object)) {
			const a = (result as Record<symbol, unknown>)[key];
			const b = (props as Record<symbol, unknown>)[key];
			// for matching symbols, we just override
			(result as Record<symbol, unknown>)[key] = b !== undefined ? b : a;
		}
	}

	// convert style object to string
	if (typeof result.style === 'object') {
		result.style = styleToCSS(result.style as StyleProperties).replaceAll('\n', ' ');
	}

	// handle weird svelte bug where `hidden` is not removed when set to `false`
	if (result.hidden === false) {
		delete result.hidden;
	}

	// handle weird svelte bug where `disabled` is not removed when set to `false`
	if (result.disabled === false) {
		delete result.disabled;
	}

	return result as UnionToIntersection<TupleTypes<T>> & { style?: string };
}

export function cssToStyleObj(css?: string | null): StyleProperties {
	if (!css) return {};
	const styleObj: Record<string, unknown> = {};

	parse(css, (n, v) => {
		if (n.startsWith('-moz-') || n.startsWith('-webkit-') || n.startsWith('-ms-') || n.startsWith('-o-')) {
			styleObj[pascalCase(n)] = v;
			return;
		}
		if (n.startsWith('--')) {
			styleObj[n] = v;
			return;
		}
		styleObj[camelCase(n)] = v;
	});

	return styleObj;
}

function createParser(matcher: string | RegExp, replacer: (match: string) => string) {
	const regex = RegExp(matcher, 'g');
	return (str: string): string => {
		// throw an error if not a string
		if (typeof str !== 'string') {
			throw new TypeError(`expected an argument of type string, but got ${typeof str}`);
		}

		// if no match between string and matcher
		if (!str.match(regex)) return str;

		// executes the replacer function for each match
		return str.replace(regex, replacer);
	};
}

export function styleToCSS(styleObj: object) {
	if (!styleObj || typeof styleObj !== 'object' || Array.isArray(styleObj)) {
		throw new TypeError(`expected an argument of type object, but got ${typeof styleObj}`);
	}
	return Object.keys(styleObj)
		.map(
			(property) =>
				`${createParser(/[A-Z]/, (match) => `-${match.toLowerCase()}`)(property)}: ${styleObj[property as keyof typeof styleObj]};`,
		)
		.join('\n');
}

export const srOnlyStyles: StyleProperties = {
	position: 'absolute',
	width: '1px',
	height: '1px',
	padding: '0',
	margin: '-1px',
	overflow: 'hidden',
	clip: 'rect(0, 0, 0, 0)',
	whiteSpace: 'nowrap',
	borderWidth: '0',
	transform: 'translateX(-100%)',
};