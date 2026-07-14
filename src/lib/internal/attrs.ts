export const boolToStr = (condition: boolean): 'true' | 'false' => condition ? 'true' : 'false';

export const boolToStrTrueOrUndef = (condition: boolean): 'true' | undefined => condition ? 'true' : undefined;

export const boolToEmptyStrOrUndef = (condition: boolean): '' | undefined => condition ? '' : undefined;

export const boolToTrueOrUndef = (condition: boolean): true | undefined => condition ? true : undefined;

export const getDataOpenClosed = (condition: boolean): 'open' | 'closed' => condition ? 'open' : 'closed';

export type TransitionState = 'starting' | 'ending' | 'idle' | undefined;

export function getDataTransitionAttrs(state: TransitionState): {
	'data-starting-style'?: '';
	'data-ending-style'?: '';
} {
	if (state === 'starting') return { 'data-starting-style': '' };
	if (state === 'ending') return { 'data-ending-style': '' };
	return {};
}

export const getAriaChecked = (checked: boolean, indeterminate: boolean): 'true' | 'false' | 'mixed' =>
	indeterminate ? 'mixed' : checked ? 'true' : 'false';

export type BitsAttrsConfig<T extends readonly string[]> = {
	component: string;
	parts: T;
	getVariant?: () => string | null;
};

export type CreateBitsAttrsReturn<T extends readonly string[]> = {
	[K in T[number]]: string;
} & {
	selector: (part: T[number]) => string;
	getAttr: (part: T[number], variant?: string) => string;
};

export class BitsAttrs<T extends readonly string[]> {
	readonly #variant: string | null;
	readonly #prefix: string;
	attrs: Record<T[number], string>;

	constructor(config: BitsAttrsConfig<T>) {
		this.#variant = config.getVariant ? config.getVariant() : null;
		this.#prefix = this.#variant ? `data-${this.#variant}-` : `data-${config.component}-`;

		this.getAttr = this.getAttr.bind(this);
		this.selector = this.selector.bind(this);

		this.attrs = Object.fromEntries(config.parts.map((part) => [part, this.getAttr(part)])) as Record<T[number], string>;
	}

	getAttr(part: T[number], variantOverride?: string): string {
		if (variantOverride) return `data-${variantOverride}-${part}`;
		return `${this.#prefix}${part}`;
	}

	selector(part: T[number], variantOverride?: string): string {
		return `[${this.getAttr(part, variantOverride)}]`;
	}
}

export function createBitsAttrs<const T extends readonly string[]>(
	config: Omit<BitsAttrsConfig<T>, 'parts'> & { parts: T },
): CreateBitsAttrsReturn<T> {
	const bitsAttrs = new BitsAttrs(config);

	return {
		...bitsAttrs.attrs,
		selector: bitsAttrs.selector,
		getAttr: bitsAttrs.getAttr,
	} as CreateBitsAttrsReturn<T>;
}
