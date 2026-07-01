import type { ColumnDef, CellContext, HeaderContext } from '@tanstack/table-core';
import { renderComponent, renderSnippet } from './';
import { createRawSnippet } from 'svelte';
import { DataTableCheckbox } from './index';
import DataTableSortButton from './data-table-sort-button.svelte';

type CheckedState = boolean | 'indeterminate';

// `createRawSnippet`'s `render` returns a raw HTML string (like `{@html}`), so any cell text — which is usually
// user-controlled (names, emails, …) — must be escaped before interpolation to avoid XSS.
const ESCAPE: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ESCAPE[c]);

/**
 * Creates a selection column with checkbox for selecting rows
 */
export function selectColumn<T>(): ColumnDef<T> {
	return {
		id: 'select',
		header: ({ table }) =>
			renderComponent(DataTableCheckbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value: CheckedState) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all',
			}),
		cell: ({ row }) =>
			renderComponent(DataTableCheckbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value: CheckedState) => row.toggleSelected(!!value),
				'aria-label': 'Select row',
			}),
		enableSorting: false,
		enableHiding: false,
	};
}

/**
 * Creates a simple text header
 */
export function textHeader(label: string) {
	return () => {
		const snippet = createRawSnippet(() => ({
			render: () => `<span>${label}</span>`,
		}));
		return renderSnippet(snippet, undefined);
	};
}

type TextCellOptions = {
	bold?: boolean;
	prefix?: string;
	suffix?: string;
};

/**
 * Creates a text cell renderer
 */
export function textCell<T>(key: keyof T | ((row: T) => string | number | null | undefined), options?: TextCellOptions) {
	return ({ row }: CellContext<T, unknown>) => {
		const text = typeof key === 'function' ? key(row.original) : (row.original[key] ?? '');
		const display = `${options?.prefix ?? ''}${text}${options?.suffix ?? ''}`;
		const className = options?.bold ? 'font-medium' : '';
		const snippet = createRawSnippet<[string]>((getText) => ({
			render: () => `<span class="${className}">${escapeHtml(getText())}</span>`,
		}));
		return renderSnippet(snippet, display);
	};
}

/**
 * Creates a muted text cell renderer
 */
export function mutedCell<T>(
	key: keyof T | ((row: T) => string | number | null | undefined),
	options?: { prefix?: string; suffix?: string },
) {
	return ({ row }: CellContext<T, unknown>) => {
		const value = typeof key === 'function' ? key(row.original) : row.original[key];
		if (value == null) {
			return renderSnippet(
				createRawSnippet(() => ({
					render: () => `<span class="text-muted-foreground">-</span>`,
				})),
				undefined,
			);
		}
		return renderSnippet(
			createRawSnippet<[string]>((getText) => ({
				render: () => `<span class="text-muted-foreground">${escapeHtml(getText())}</span>`,
			})),
			`${options?.prefix ?? ''}${value}${options?.suffix ?? ''}`,
		);
	};
}

// Re-export SortButton as a convenient alias
export { DataTableSortButton as SortButton };
