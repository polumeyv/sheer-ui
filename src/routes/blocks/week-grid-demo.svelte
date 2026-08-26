<script lang="ts">
	// Showcase for the week grid: a Mon–Fri week of open hours with overlapping items, a now marker,
	// and click-drag selection reported below the grid.
	import { WeekGrid, type WeekGridItem, type WeekGridSpan } from '#lib/blocks/week-grid/index.js';

	const days = ['2026-08-24', '2026-08-25', '2026-08-26', '2026-08-27', '2026-08-28'];
	const open: WeekGridSpan[] = days.map((day) => ({ day, start: 9 * 60, end: 17 * 60 }));
	const items: WeekGridItem[] = [
		{ id: '1', day: days[0]!, start: 9 * 60, end: 10 * 60, kind: 'appointment' },
		{ id: '2', day: days[0]!, start: 9 * 60 + 30, end: 11 * 60, kind: 'appointment' },
		{ id: '3', day: days[1]!, start: 12 * 60, end: 13 * 60, kind: 'block' },
		{ id: '4', day: days[3]!, start: 8 * 60, end: 18 * 60, kind: 'block' },
	];

	let picked = $state<string>('drag on an empty column');
</script>

<div class="flex w-full flex-col gap-4">
	<WeekGrid
		{days}
		{open}
		{items}
		range={{ start: 7 * 60, end: 19 * 60 }}
		now={{ day: days[2]!, minute: 14 * 60 + 20 }}
		onselect={(day, start, end) => (picked = `${day} ${start}–${end}`)}>
		{#snippet item(entry)}
			<div
				class="h-full overflow-hidden rounded-sm px-1.5 py-0.5 text-xs {entry.kind === 'block'
					? 'bg-muted-foreground/25 text-muted-foreground'
					: 'bg-primary text-primary-foreground'}">
				{entry.kind}
			</div>
		{/snippet}
	</WeekGrid>
	<p class="text-sm text-muted-foreground">Selected: {picked}</p>
</div>
