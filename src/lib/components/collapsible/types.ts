import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';
import type { WithElementRef } from '../../internal/utils.js';

export type CollapsibleRootProps = WithElementRef<SvelteHTMLElements['details'], HTMLDetailsElement> & {
	/** Whether the collapsible is open. Bindable. */
	open?: boolean;
	disabled?: boolean;
	onOpenChange?: (open: boolean) => void;
};

export type CollapsibleTriggerProps = WithElementRef<SvelteHTMLElements['summary']>;

export type CollapsibleContentProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
