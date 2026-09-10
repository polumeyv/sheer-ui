---
'sheer-ui': minor
---

The data table's `sorting` and `columnFilters` are written directly and a page index only holds for the sorting and filters it was set under, so `setSorting`, `setColumnFilters` and `resetColumnFilters` are gone; `selectedRowIds` is the live `SvelteSet`, replacing `setSelectedRowIds`; a column's `filterValue` is a get/set property, replacing `setFilterValue`. The toolbar's search input no longer re-applies the filter on `change`.
