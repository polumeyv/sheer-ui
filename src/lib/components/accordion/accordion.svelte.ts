import { createContext } from 'svelte';

export type AccordionType = 'single' | 'multiple';

type AccordionStateProps = {
	type: () => AccordionType;
	value: () => string | string[];
	setValue: (value: string | string[]) => void;
};

/**
 * The browser owns the accordion behavior: each item is a `<details>`, single-open
 * exclusivity comes from the shared `name` attribute, and open/close animation is
 * the `::details-content` transition in ui.css. This state only mirrors the DOM's
 * open set into the bindable `value` prop (ontoggle → report) and back (external
 * writes flow through each item's reactive `open` attribute).
 */
export class AccordionState {
	readonly props: AccordionStateProps;
	readonly #name: string;

	constructor(props: AccordionStateProps, name: string) {
		this.props = props;
		this.#name = name;
	}

	/** `name` for the items' `<details>` — set only for single type, where the browser enforces one-open. */
	get name(): string | undefined {
		return this.props.type() === 'single' ? this.#name : undefined;
	}

	includes(item: string): boolean {
		const value = this.props.value();
		return Array.isArray(value) ? value.includes(item) : value === item;
	}

	/** ontoggle writeback from an item's `<details>` (fires on user toggles and name-group force-closes alike). */
	report(item: string, open: boolean): void {
		const value = this.props.value();
		if (Array.isArray(value)) {
			if (open && !value.includes(item)) this.props.setValue([...value, item]);
			else if (!open && value.includes(item)) this.props.setValue(value.filter((v) => v !== item));
		} else if (open) {
			if (value !== item) this.props.setValue(item);
		} else if (value === item) {
			this.props.setValue('');
		}
	}
}

export const [useAccordion, setAccordion] = createContext<AccordionState>();
