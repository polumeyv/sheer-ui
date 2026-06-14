<script lang="ts">
	import * as DatePicker from '$lib/booking/date-picker/index';
	import { Label } from '$lib/components/label/index';
	import { DateString } from '@polumeyv/lib/schemas';
	import { addDays, addYears, todayIn, localTimeZone } from '@polumeyv/lib/public';

	// Shared anchors so every example speaks the same branded DateString type.
	const today = todayIn(localTimeZone());
	const TRIGGER = 'w-full max-w-sm';

	// 1 — default single picker
	let value = $state<DateString | undefined>(DateString.make('2026-06-13'));

	// 2 — date of birth (no future dates, year/month dropdowns)
	let dob = $state<DateString | undefined>(undefined);
	const hundredYearsAgo = addYears(today, -100);

	// 3 — with presets (Today / Tomorrow / In a week …)
	let scheduled = $state<DateString | undefined>(undefined);

	// 4 — date range
	let range = $state<{ start?: DateString; end?: DateString }>({});

	// 5 — constrained: this week only, weekends unavailable
	let appointment = $state<DateString | undefined>(undefined);
	const weekEnd = addDays(today, 14);
	const isWeekend = (date: DateString) => {
		const day = new Date(`${date}T00:00:00Z`).getUTCDay();
		return day === 0 || day === 6;
	};
</script>

<div class="flex w-full max-w-sm flex-col gap-10">
	<!-- 1 — default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Date picker</h3>
			<p class="text-muted-foreground mt-1 text-xs">A button that opens a calendar in a popover.</p>
		</div>
		<DatePicker.DatePicker
			bind:value
			placeholder="Pick a date"
			captionLayout="dropdown"
			triggerClass={TRIGGER} />
	</section>

	<!-- 2 — date of birth -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Date of birth</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Capped at today with month and year dropdowns for fast navigation.
			</p>
		</div>
		<div class="grid gap-2">
			<Label for="dob">Date of birth</Label>
			<DatePicker.DatePicker
				bind:value={dob}
				placeholder="Select your birthday"
				captionLayout="dropdown"
				dateFormat="long"
				minValue={hundredYearsAgo}
				maxValue={today}
				triggerClass={TRIGGER} />
		</div>
	</section>

	<!-- 3 — with presets -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With presets</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Quick relative-day shortcuts above the calendar.
			</p>
		</div>
		<DatePicker.WithPresets
			bind:value={scheduled}
			placeholder="Pick a date"
			presetsPlaceholder="Quick select"
			triggerClass={TRIGGER} />
	</section>

	<!-- 4 — date range -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Date range</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Select a start and end date across two months.
			</p>
		</div>
		<DatePicker.Range
			bind:value={range}
			placeholder="Pick a date range"
			numberOfMonths={2}
			triggerClass={TRIGGER} />
	</section>

	<!-- 5 — constrained -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Constrained</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Next two weeks only, with weekends marked unavailable.
			</p>
		</div>
		<DatePicker.DatePicker
			bind:value={appointment}
			placeholder="Book an appointment"
			minValue={today}
			maxValue={weekEnd}
			isDateUnavailable={isWeekend}
			triggerClass={TRIGGER} />
	</section>
</div>
