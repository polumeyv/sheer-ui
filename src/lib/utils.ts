import { guard, join } from 'overrule';

export type { ClassValue } from 'overrule';
export type ClassDictionary = Record<string, unknown>;

/**
 * Plain class join — conflict resolution is an authoring-time invariant, not a
 * runtime feature. Base/variant/caller classes must never set the same property
 * for the same modifier prefix (use trailing `!` for deliberate overrides). The
 * dev-only guard warns on violations; variants.test.ts guards the library.
 * This is overrule, the package this file's first version grew into.
 */
export const cn = import.meta.env.DEV ? guard(join) : join;

type VariantsSchema = Record<string, Record<string, string>>;

/**
 * Minimal replacement for tailwind-variants' tv(): plain string concatenation,
 * no conflict merging. Variant strings MUST stay disjoint from base (no CSS
 * property set by both for the same modifier prefix) — enforced exhaustively
 * by components/variants.test.ts.
 */
export function tv<S extends VariantsSchema>(config: { base?: string; variants?: S; defaultVariants?: { [K in keyof S]?: keyof S[K] } }) {
	return (props?: { [K in keyof S]?: keyof S[K] | null | undefined } & { class?: string }): string => {
		let out = config.base ?? '';
		for (const key in config.variants) {
			// undefined → defaultVariants; explicit null → axis opted out (no classes emitted)
			const raw = props?.[key];
			const selected = raw === undefined ? config.defaultVariants?.[key] : raw;
			const classes = selected != null ? config.variants[key][selected as string] : undefined;
			if (classes) out += ' ' + classes;
		}
		if (props?.class) out += ' ' + props.class;
		return out;
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VariantProps<T extends (props?: any) => string> = Omit<NonNullable<Parameters<T>[0]>, 'class'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
