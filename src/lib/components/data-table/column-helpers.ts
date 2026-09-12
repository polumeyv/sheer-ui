import type { ColumnDef, CellContext } from '../../internal/table/types.js';
import { renderComponent, renderSnippet } from './render-helpers.js';
import { text } from './text.svelte';
import DataTableCheckbox from './data-table-checkbox.svelte';
import DataTableSortButton from './data-table-sort-button.svelte';
import type { CheckedState } from '../menu/utils.js';

/**
 * Creates a selection column with checkbox for selecting rows
 */
export function selectColumn<T>(): ColumnDef<T> {
	return {
		id: 'select',
		header: ({ table }) =>
			renderComponent(DataTableCheckbox, {
				checked: table.isAllPageRowsSelected,
				indeterminate: table.isSomePageRowsSelected && !table.isAllPageRowsSelected,
				onCheckedChange: (value: CheckedState) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all',
			}),
		cell: ({ row }) =>
			renderComponent(DataTableCheckbox, {
				checked: row.isSelected,
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
	return () => renderSnippet(text, { value: label });
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
		const value = typeof key === 'function' ? key(row.original) : (row.original[key] ?? '');
		return renderSnippet(text, {
			value: `${options?.prefix ?? ''}${value}${options?.suffix ?? ''}`,
			class: options?.bold ? 'font-medium' : '',
		});
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
		return renderSnippet(text, {
			value: value == null ? '-' : `${options?.prefix ?? ''}${value}${options?.suffix ?? ''}`,
			class: 'text-muted-foreground',
		});
	};
}

// Re-export SortButton as a convenient alias
export { DataTableSortButton as SortButton };
