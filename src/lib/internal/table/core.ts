import type { ColumnDef, ColumnSort } from './types.js';
import type { Comparator, RowLike } from './sorting-fns.js';

/** Id resolution priority ported from upstream: explicit `id` → `accessorKey` (dots → underscores) → string `header`. */
export const resolveColumnId = <TData, TValue>(def: ColumnDef<TData, TValue>): string => {
	const id = def.id ?? def.accessorKey?.replaceAll('.', '_') ?? (typeof def.header === 'string' ? def.header : undefined);
	if (id === undefined) throw new Error('Column definition needs an id, an accessorKey or a string header');
	return id;
};

export const makeAccessor = <TData>(def: ColumnDef<TData, unknown>): ((original: TData, index: number) => unknown) | undefined => {
	if (def.accessorFn) return def.accessorFn;
	const key = def.accessorKey;
	if (key === undefined) return undefined;
	if (!key.includes('.')) return (original) => (original as Record<string, unknown>)[key];
	const path = key.split('.');
	return (original) =>
		path.reduce<unknown>((value, part) => (value == null ? undefined : (value as Record<string, unknown>)[part]), original);
};

/**
 * Stable multi-key sort: ties break on the next sorting entry, then on row index. Entries whose
 * column can't sort (per `comparatorFor`) are skipped. Returns the input array untouched when
 * nothing applies, so downstream deriveds keep referential equality.
 */
export const sortRows = <TRow extends RowLike & { index: number }>(
	rows: readonly TRow[],
	sorting: readonly ColumnSort[],
	comparatorFor: (columnId: string) => Comparator | undefined,
): readonly TRow[] => {
	const active = sorting.flatMap((entry) => {
		const comparator = comparatorFor(entry.id);
		return comparator ? [{ ...entry, comparator }] : [];
	});
	if (active.length === 0 || rows.length === 0) return rows;

	return [...rows].sort((rowA, rowB) => {
		for (const { id, desc, comparator } of active) {
			const result = comparator(rowA, rowB, id);
			if (result !== 0) return desc ? -result : result;
		}
		return rowA.index - rowB.index;
	});
};

export const facetCounts = (rows: readonly RowLike[], columnId: string): Map<unknown, number> => {
	const counts = new Map<unknown, number>();
	for (const row of rows) {
		const value = row.getValue(columnId);
		counts.set(value, (counts.get(value) ?? 0) + 1);
	}
	return counts;
};
