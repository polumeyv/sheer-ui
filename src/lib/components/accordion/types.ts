import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';
import type { WithElementRef } from '../../internal/utils.js';
import type { AccordionType } from './accordion.svelte.js';

export type AccordionRootProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
	/** 'single' groups the items' `<details>` by name so the browser enforces one-open. */
	type?: AccordionType;
	/** The open item value(s) — string for single, string[] for multiple. Bindable. */
	value?: string | string[];
};

export type AccordionItemProps = WithElementRef<SvelteHTMLElements['details'], HTMLDetailsElement> & {
	value: string;
	disabled?: boolean;
};

export type AccordionTriggerProps = WithElementRef<SvelteHTMLElements['summary']>;

export type AccordionContentProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
