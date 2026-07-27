import { createContext } from 'svelte';

export type AccordionType = 'single' | 'multiple';

type AccordionStateProps = {
	type: () => AccordionType;
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
	readonly props: AccordionStateProps;

	constructor(props: AccordionStateProps) {
		this.props = props;
	}

	includes(item: string): boolean {
		const value = this.props.value();
		return Array.isArray(value) ? value.includes(item) : value === item;
	}

	/** Open/close intent from an item — intercepted summary clicks and native force-opens alike. */
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
