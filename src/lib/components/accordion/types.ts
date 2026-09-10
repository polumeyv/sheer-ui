import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';
import type { WithElementRef } from '../../internal/utils.js';
import type { SelectionType } from '../../internal/selection.svelte.js';

export type AccordionRootProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
	/** 'single' keeps one item open: opening an item closes the open one. Fixed at mount. */
	type?: SelectionType;
	/** The open item value(s) — string for single, string[] for multiple. Bindable. */
	value?: string | string[];
};

export type AccordionItemProps = WithElementRef<SvelteHTMLElements['details'], HTMLDetailsElement> & {
	value: string;
	disabled?: boolean;
};

export type AccordionTriggerProps = WithElementRef<SvelteHTMLElements['summary']>;

export type AccordionContentProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
