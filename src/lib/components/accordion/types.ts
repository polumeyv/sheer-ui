import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';
import type { WithElementRef } from '../../internal/utils.js';
import type { AccordionType } from './accordion.svelte.js';

export type AccordionRootProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
	/** 'single' keeps at most one item open (collapsible); 'multiple' lets items open independently. Read once at mount. */
	type?: AccordionType;
	/** The open item value(s) — string for `single`, string[] for `multiple`; the shape must match `type`. Bindable. */
	value?: string | string[];
};

export type AccordionItemProps = WithElementRef<SvelteHTMLElements['details'], HTMLDetailsElement> & {
	value: string;
	disabled?: boolean;
};

export type AccordionTriggerProps = WithElementRef<SvelteHTMLElements['summary']>;

export type AccordionContentProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
