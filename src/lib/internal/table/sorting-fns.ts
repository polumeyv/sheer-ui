// Ported from @tanstack/table-core@8.21.3 sortingFns.ts / RowSorting.ts (MIT).

export interface RowLike {
	getValue(columnId: string): unknown;
}

export type Comparator = (rowA: RowLike, rowB: RowLike, columnId: string) => number;

export const reSplitAlphaNumeric = /([0-9]+)/gm;

const compareBasic = (a: unknown, b: unknown) => (a === b ? 0 : (a as number) > (b as number) ? 1 : -1);

const toComparableString = (value: unknown): string => {
	if (typeof value === 'number') {
		return Number.isNaN(value) || value === Infinity || value === -Infinity ? '' : String(value);
	}
	return typeof value === 'string' ? value : '';
};

// Handles numbers, mixed alphanumeric combinations, null/undefined and Infinity.
const compareAlphanumeric = (aStr: string, bStr: string): number => {
	const a = aStr.split(reSplitAlphaNumeric).filter(Boolean);
	const b = bStr.split(reSplitAlphaNumeric).filter(Boolean);

	while (a.length && b.length) {
		const aa = a.shift()!;
		const bb = b.shift()!;

		const an = parseInt(aa, 10);
		const bn = parseInt(bb, 10);

		const combo = [an, bn].sort();

		if (isNaN(combo[0]!)) {
			if (aa > bb) return 1;
			if (bb > aa) return -1;
			continue;
		}

		if (isNaN(combo[1]!)) return isNaN(an) ? -1 : 1;

		if (an > bn) return 1;
		if (bn > an) return -1;
	}

	return a.length - b.length;
};

export const basic: Comparator = (rowA, rowB, columnId) => compareBasic(rowA.getValue(columnId), rowB.getValue(columnId));

export const text: Comparator = (rowA, rowB, columnId) =>
	compareBasic(toComparableString(rowA.getValue(columnId)).toLowerCase(), toComparableString(rowB.getValue(columnId)).toLowerCase());

export const alphanumeric: Comparator = (rowA, rowB, columnId) =>
	compareAlphanumeric(toComparableString(rowA.getValue(columnId)).toLowerCase(), toComparableString(rowB.getValue(columnId)).toLowerCase());

export const datetime: Comparator = (rowA, rowB, columnId) => {
	const a = rowA.getValue(columnId) as Date;
	const b = rowB.getValue(columnId) as Date;
	// > and < instead of === so Date objects compare by time value.
	return a > b ? 1 : a < b ? -1 : 0;
};

/**
 * Picks a comparator from a sample of row values, mirroring upstream's `getAutoSortingFn` —
 * except the sample is the FIRST ten rows. Upstream's `.slice(10)` drops them instead, leaving
 * every table under 11 rows on `basic` (case-sensitive for strings).
 */
export const inferSortingFn = (rows: readonly RowLike[], columnId: string): Comparator => {
	let isString = false;

	for (const row of rows.slice(0, 10)) {
		const value = row.getValue(columnId);

		if (Object.prototype.toString.call(value) === '[object Date]') return datetime;

		if (typeof value === 'string') {
			isString = true;
			if (value.split(reSplitAlphaNumeric).length > 1) return alphanumeric;
		}
	}

	return isString ? text : basic;
};
