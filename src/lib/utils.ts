import { twMerge } from 'tailwind-merge';

export type ClassDictionary = Record<string, unknown>;
export type ClassValue = ClassValue[] | ClassDictionary | string | number | bigint | null | boolean | undefined;

function join(inputs: ClassValue[]): string {
	let out = '';
	for (const input of inputs) {
		if (!input || input === true) continue;
		let part = '';
		if (typeof input === 'object') {
			if (Array.isArray(input)) part = join(input);
			else for (const key in input) if (input[key]) part += (part ? ' ' : '') + key;
		} else {
			part = String(input);
		}
		if (part) out += (out ? ' ' : '') + part;
	}
	return out;
}

const reportedConflicts = new Set<string>();

/**
 * Plain class join — conflict resolution is an authoring-time invariant, not a
 * runtime feature. Base/variant/caller classes must never set the same property
 * for the same modifier prefix (use trailing `!` for deliberate overrides). The
 * dev-only assertion below flags violations; variants.test.ts guards the library.
 */
export function cn(...inputs: ClassValue[]): string {
	const joined = join(inputs);
	if (import.meta.env.DEV) {
		const merged = twMerge(joined);
		if (merged.length !== joined.length) {
			const kept = new Set(merged.split(' '));
			const dropped = [...new Set(joined.split(/\s+/))].filter((c) => c && !kept.has(c));
			if (dropped.length > 0) {
				const signature = dropped.sort().join(' ');
				if (!reportedConflicts.has(signature)) {
					reportedConflicts.add(signature);
					console.warn(`[cn] conflicting classes "${dropped.join(' ')}" are now unresolved (cascade decides) in "${joined}" — fix the caller (see tailwind-merge-removal plan)`);
				}
			}
		}
	}
	return joined;
}

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
