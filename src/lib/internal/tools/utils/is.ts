import type { MaybeGetter } from '../types';

export const isFunction = (value: unknown): value is (...args: never[]) => unknown => typeof value === 'function';

export const isObject = (value: unknown): value is Record<PropertyKey, unknown> => value !== null && typeof value === 'object';

export const isElement = (value: unknown): value is Element => typeof Element !== 'undefined' && value instanceof Element;

export const get = <T>(value: MaybeGetter<T>): T => (isFunction(value) ? value() : value);
