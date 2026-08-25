/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Snippet } from 'svelte';
import type { ReadableBox, WritableBox } from './box.svelte.js';
import { BROWSER } from 'esm-env';

export type Getter<T> = () => T;
export type MaybeGetter<T> = T | Getter<T>;

export const get = <T>(value: MaybeGetter<T>): T => (typeof value === 'function' ? (value as Getter<T>)() : value);

export type Box<T> = ReadableBox<T> | WritableBox<T>;

export type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

/**
 * Given a Record type T, returns a type that represents the same type, but with
 * all values wrapped in a `ReadableBox`.
 */
export type ReadableBoxedValues<T> = {
	[K in keyof T]: ReadableBox<T[K]>;
};

/**
 * Given a Record type T, returns a type that represents the same type, but with
 * all values wrapped in a `WritableBox`.
 */
export type WritableBoxedValues<T> = {
	[K in keyof T]: WritableBox<T[K]>;
};

export type WithChildren<Props = {}> = Props & {
	children?: Snippet | undefined;
};

export type WithRefProps<T = {}> = T & ReadableBoxedValues<{ id: string }> & WritableBoxedValues<{ ref: HTMLElement | null }>;

/** camelCase CSS property names from the DOM lib, plus custom properties. Values are not typed per property: every
 *  style object here ends up in overrule's `styleToString`, which takes strings anyway. */
type CSSPropertyName = {
	[K in keyof CSSStyleDeclaration]: K extends string ? (CSSStyleDeclaration[K] extends string ? K : never) : never;
}[keyof CSSStyleDeclaration];
export type StyleProperties = Partial<Record<CSSPropertyName, string | number>> & { [custom: `--${string}`]: string | number };

export type AnyFn = (...args: any[]) => any;
