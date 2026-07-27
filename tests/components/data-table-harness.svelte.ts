import { createDataTable, type ColumnDef, type DataTable } from '../../src/lib/internal/table/index.js';

export function makeTableHarness<TData>(options: {
	initial: TData[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	columns: ColumnDef<TData, any>[];
	pageSize?: number;
}) {
	let data = $state(options.initial);
	let dataReads = 0;
	let table: DataTable<TData>;
	const dispose = $effect.root(() => {
		table = createDataTable({
			data: () => {
				dataReads += 1;
				return data;
			},
			columns: options.columns,
			...(options.pageSize === undefined ? {} : { pageSize: options.pageSize }),
		});
	});
	return {
		table: table!,
		dispose,
		get dataReads() {
			return dataReads;
		},
		setData(next: TData[]) {
			data = next;
		},
	};
}
