import type { RowLike } from './sorting-fns.js';

export const includesString = (row: RowLike, columnId: string, filterValue: unknown): boolean => {
	const search = String(filterValue).toLowerCase();
	const value = row.getValue(columnId);
	return value != null && String(value).toLowerCase().includes(search);
};

// A cleared filter input drops its entry entirely, so `columnFilters.length` keeps meaning "is filtered".
export const shouldAutoRemoveFilter = (value: unknown): boolean => value === undefined || value === '';
