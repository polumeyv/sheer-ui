<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	let {
		month = 'January',
		year = 2026,
		selected = 15,
		today = 10,
		startDay = 3,
		daysInMonth = 31,
	}: {
		month?: string;
		year?: number;
		selected?: number | null;
		today?: number | null;
		startDay?: number;
		daysInMonth?: number;
	} = $props();

	const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

	const days = $derived.by(() => {
		const cells: (number | null)[] = [];
		for (let i = 0; i < startDay; i++) cells.push(null);
		for (let i = 1; i <= daysInMonth; i++) cells.push(i);
		return cells;
	});
</script>

<div class="overflow-hidden rounded-xl border bg-card shadow-sm">
	<div class="p-4 [--cell-size:--spacing(8)]">
		<!-- Nav -->
		<div class="relative flex items-center justify-center">
			<button class="absolute left-0 inline-flex size-(--cell-size) items-center justify-center rounded-md text-muted-foreground">
				<ChevronLeft class="size-4" />
			</button>
			<span class="text-sm font-medium">{month} {year}</span>
			<button class="absolute right-0 inline-flex size-(--cell-size) items-center justify-center rounded-md text-muted-foreground">
				<ChevronRight class="size-4" />
			</button>
		</div>

		<!-- Grid -->
		<div class="mt-4 flex flex-col gap-1">
			<div class="flex">
				{#each weekdays as day (day)}
					<div class="flex w-(--cell-size) items-center justify-center text-muted-foreground text-[0.8rem] font-normal">
						{day}
					</div>
				{/each}
			</div>

			{#each { length: Math.ceil(days.length / 7) } as _, week (week)}
				<div class="flex mt-2">
					{#each { length: 7 } as _, col (col)}
						{@const idx = week * 7 + col}
						{@const num = days[idx] ?? null}
						{@const isSelected = num === selected}
						{@const isToday = num === today && !isSelected}
						<div class="relative size-(--cell-size) p-0 text-center text-sm">
							{#if num}
								<div
									class="flex size-(--cell-size) items-center justify-center rounded-md font-normal select-none
									{isSelected ? 'bg-primary text-primary-foreground' : isToday ? 'bg-accent text-accent-foreground' : 'text-foreground'}">
									{num}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>
