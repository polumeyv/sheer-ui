/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Snippet } from 'svelte';
import type * as CSS from 'csstype';
import type { WritableProp } from './utils';
export type { Getter, MaybeGetter, ReadableProp, WritableProp, ReadableProps, WritableProps, WithRefProps } from './utils';
export type { RefAttachment } from './attach-ref';

export type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return;

export type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

export type WithChild<
	/**
	 * The props that the component accepts.
	 */
	Props extends Record<PropertyKey, unknown> = {},
	/**
	 * The props that are passed to the `child` and `children` snippets. The `ElementProps` are
	 * merged with these props for the `child` snippet.
	 */
	SnippetProps extends Record<PropertyKey, unknown> = { _default: never },
	/**
	 * The underlying DOM element being rendered. You can bind to this prop to
	 * programatically interact with the element.
	 */
	Ref = HTMLElement,
> = Omit<Props, 'child' | 'children'> & {
	child?: SnippetProps extends { _default: never }
		? Snippet<[{ props: Record<string, unknown> }]>
		: Snippet<[SnippetProps & { props: Record<string, unknown> }]>;
	children?: SnippetProps extends { _default: never } ? Snippet : Snippet<[SnippetProps]>;
	style?: StyleProperties | string | null | undefined;
	ref?: Ref | null | undefined;
};

export type WithChildNoChildrenSnippetProps<
	/**
	 * The props that the component accepts.
	 */
	Props extends Record<PropertyKey, unknown> = {},
	/**
	 * The props that are passed to the `child` and `children` snippets. The `ElementProps` are
	 * merged with these props for the `child` snippet.
	 */
	SnippetProps extends Record<PropertyKey, unknown> = { _default: never },
	/**
	 * The underlying DOM element being rendered. You can bind to this prop to
	 * programmatically interact with the element.
	 */
	Ref = HTMLElement,
> = Omit<Props, 'child' | 'children'> & {
	child?: SnippetProps extends { _default: never }
		? Snippet<[{ props: Record<string, unknown> }]>
		: Snippet<[SnippetProps & { props: Record<string, unknown> }]>;
	children?: Snippet;
	style?: StyleProperties | string | null | undefined;
	ref?: Ref | null | undefined;
};

export type WithChildren<Props = {}> = Props & {
	children?: Snippet | undefined;
};

/**
 * Constructs a new type by omitting properties from type
 * 'T' that exist in type 'U'.
 *
 * @template T - The base object type from which properties will be omitted.
 * @template U - The object type whose properties will be omitted from 'T'.
 * @example
 * type Result = Without<{ a: number; b: string; }, { b: string; }>;
 * // Result type will be { a: number; }
 */
export type Without<T extends object, U extends object> = Omit<T, keyof U>;

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export type StyleProperties = CSS.Properties & {
	// Allow any CSS Custom Properties
	[str: `--${string}`]: any;
};

export type AnyFn = (...args: any[]) => any;

export type OnChangeFn<T> = (value: T) => void;

export type ElementRef = WritableProp<HTMLElement | null>;

export type Arrayable<T> = T[] | T;

export type Fn = () => void;

export type BitsEvent<T extends Event = Event, U extends HTMLElement = HTMLElement> = T & {
	currentTarget: U;
};

export type BitsPointerEvent<T extends HTMLElement = HTMLElement> = BitsEvent<PointerEvent, T>;
export type BitsKeyboardEvent<T extends HTMLElement = HTMLElement> = BitsEvent<KeyboardEvent, T>;
export type BitsMouseEvent<T extends HTMLElement = HTMLElement> = BitsEvent<MouseEvent, T>;
export type BitsFocusEvent<T extends HTMLElement = HTMLElement> = BitsEvent<FocusEvent, T>;
export type BitsInputEvent<T extends HTMLElement = HTMLElement> = BitsEvent<InputEvent, T>;
