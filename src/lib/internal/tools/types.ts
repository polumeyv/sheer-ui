/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Snippet } from 'svelte';
import type * as CSS from 'csstype';
import type { ReadableBox, WritableBox } from './runed/box.svelte.js';
import { BROWSER } from '@polumeyv/utilities/env';

export type Getter<T> = () => T;
export type MaybeGetter<T> = T | Getter<T>;
export type MaybeBoxOrGetter<T> = T | Getter<T> | ReadableBox<T>;
export type MaybeElementGetter<T extends Element = HTMLElement> = MaybeGetter<T | null | undefined>;

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

export type ConfigurableWindow = {
	/** Provide a custom `window` object to use in place of the global `window` object. */
	window?: typeof globalThis & Window;
};

export const defaultWindow = BROWSER && typeof window !== 'undefined' ? window : undefined;

export type WithChildren<Props = {}> = Props & {
	children?: Snippet | undefined;
};

export type WithRefProps<T = {}> = T & ReadableBoxedValues<{ id: string }> & WritableBoxedValues<{ ref: HTMLElement | null }>;

export type StyleProperties = CSS.Properties & {
	// Allow any CSS Custom Properties
	[str: `--${string}`]: any;
};

export type AnyFn = (...args: any[]) => any;
