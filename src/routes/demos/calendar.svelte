<script lang="ts">
	import * as Calendar from '$lib/booking/calendar/index';
	import { DateString } from '@polumeyv/lib/schemas';

	// Shared class string, factored out so each example stays copy-paste sized.
	const CAL = 'rounded-md border shadow-sm';

	// 1 — default single select
	let value = $state<DateString | undefined>(DateString.make('2026-06-13'));

	// 2 — dropdown month + year caption
	let dropdownValue = $state<DateString | undefined>(DateString.make('1995-06-13'));

	// 3 — constrained: min today, weekends disabled, max 90 days out
	const today = DateString.make('2026-06-14');
	const maxDate = DateString.make('2026-09-12');
	let bookingValue = $state<DateString | undefined>(undefined);
	function isWeekend(date: DateString): boolean {
		const dow = new Date(`${date}T00:00:00`).getUTCDay();
		return dow === 0 || dow === 6;
	}
</script>

<div class="flex flex-col gap-10">
	<!-- 1 — default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">Single date selection, bound to state.</p>
		</div>
		<Calendar.Calendar type="single" bind:value class={CAL} />
	</section>

	<!-- 2 — dropdown caption -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Month & year dropdowns</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				captionLayout="dropdown" swaps the label for navigable selects.
			</p>
		</div>
		<Calendar.Calendar
			type="single"
			bind:value={dropdownValue}
			captionLayout="dropdown"
			class={CAL} />
	</section>

	<!-- 3 — constrained / disabled dates -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Constrained</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				minValue/maxValue range with weekends disabled via isDateDisabled.
			</p>
		</div>
		<Calendar.Calendar
			type="single"
			bind:value={bookingValue}
			minValue={today}
			maxValue={maxDate}
			isDateDisabled={isWeekend}
			class={CAL} />
	</section>
</div>
