import { createContext } from 'svelte';

export type RadioGroupContext = {
	/** Shared <input> name; native radios group by name (roving focus + single selection). */
	readonly name: string;
	readonly value: string;
	readonly disabled: boolean;
	readonly readonly: boolean;
	readonly required: boolean;
	select: (value: string) => void;
};

export const [getRadioGroupContext, setRadioGroupContext] = createContext<RadioGroupContext>();
