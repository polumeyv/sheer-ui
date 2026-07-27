import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';
import type { Snippet } from 'svelte';
import type { WithElementRef } from '../../internal/utils.js';
import type { OpenCell } from '../../internal/open-cell.svelte.js';

export type CollapsibleRootProps = Omit<WithElementRef<SvelteHTMLElements['details'], HTMLDetailsElement>, 'children'> & {
	/**
	 * The derivation source for the collapsible's open state: the internal cell
	 * re-derives whenever this prop changes, and interactions override it until
	 * the next change. Plain value — not bindable.
	 */
	open?: boolean;
	disabled?: boolean;
	/**
	 * A caller-constructed cell (own source and, optionally, a delegate writer)
	 * used instead of building one from `open`. When given, `open` is ignored.
	 */
	state?: OpenCell;
	/** Children receive the state cell, typed and guaranteed within the tree. */
	children?: Snippet<[OpenCell]>;
};

export type CollapsibleTriggerProps = WithElementRef<SvelteHTMLElements['summary']>;

export type CollapsibleContentProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
