import { createContext } from 'svelte';
import { bindableWith } from '../../internal/tools/index.js';
import { type SelectionType, SelectionValue } from '../../internal/selection.svelte.js';

export type AccordionType = SelectionType;

type AccordionStateProps = {
	type: AccordionType;
	value: () => string | string[];
	setValue: (value: string | string[]) => void;
};

/**
 * Each item is a `<details>`; this state owns the open set (bindable `value`) and
 * single-type exclusivity — not the native `name` attribute, which would unrender a
 * force-closed sibling before its closing transition can play. Items intercept summary
 * clicks and report intent here; the grid-track animation lives in ui.css.
 */
export class AccordionState {
	readonly #selection: SelectionValue;

	constructor(props: AccordionStateProps) {
		this.#selection = new SelectionValue(props.type, bindableWith(props.value, props.setValue));
	}

	includes(item: string): boolean {
		return this.#selection.includes(item);
	}

	/** Open/close intent from an item — intercepted summary clicks and native force-opens alike. */
	report(item: string, open: boolean): void {
		if (open !== this.#selection.includes(item)) this.#selection.toggle(item);
	}
}

export const [useAccordion, setAccordion] = createContext<AccordionState>();
