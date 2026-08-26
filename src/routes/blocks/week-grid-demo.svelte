<script lang="ts">
	// Playground for the week grid: every prop is a control, plus item presets that exercise lane packing,
	// midnight-crossing spans, whole-day bands, and read-only vs selectable grids.
	import { WeekGrid, type WeekGridItem, type WeekGridSpan } from '#lib/blocks/week-grid/index.js';
	import { Button } from '#lib/components/button/index.js';
	import { Switch } from '#lib/components/switch/index.js';

	const WEEK = ['2026-08-24', '2026-08-25', '2026-08-26', '2026-08-27', '2026-08-28', '2026-08-29', '2026-08-30'];
	const h = (hours: number, minutes = 0) => hours * 60 + minutes;

	const PRESETS = {
		'typical week': [
			{ id: 'a1', day: WEEK[0]!, start: h(9), end: h(10), kind: 'appointment' },
			{ id: 'a2', day: WEEK[0]!, start: h(11, 30), end: h(12, 15), kind: 'appointment' },
			{ id: 'b1', day: WEEK[0]!, start: h(12, 15), end: h(13), kind: 'block' },
			{ id: 'a3', day: WEEK[1]!, start: h(10), end: h(11), kind: 'appointment' },
			{ id: 'a4', day: WEEK[1]!, start: h(14), end: h(15, 30), kind: 'appointment' },
			{ id: 'c1', day: WEEK[1]!, start: h(16), end: h(16, 45), kind: 'cancelled' },
			{ id: 'b2', day: WEEK[2]!, start: 0, end: 1440, kind: 'block', allDay: true },
			{ id: 'a5', day: WEEK[3]!, start: h(9, 30), end: h(10, 30), kind: 'appointment' },
			{ id: 'b3', day: WEEK[3]!, start: h(13), end: h(14), kind: 'block' },
			{ id: 'a6', day: WEEK[4]!, start: h(15), end: h(16), kind: 'appointment' },
			{ id: 'g1', day: WEEK[4]!, start: h(12), end: h(13, 30), kind: 'busy' },
		],
		'heavy overlap': [
			{ id: 'o1', day: WEEK[1]!, start: h(9), end: h(12), kind: 'block' },
			{ id: 'o2', day: WEEK[1]!, start: h(9, 30), end: h(10, 30), kind: 'appointment' },
			{ id: 'o3', day: WEEK[1]!, start: h(10), end: h(11), kind: 'appointment' },
			{ id: 'o4', day: WEEK[1]!, start: h(10, 15), end: h(11, 45), kind: 'busy' },
			{ id: 'o5', day: WEEK[1]!, start: h(11), end: h(12), kind: 'appointment' },
			{ id: 'o6', day: WEEK[1]!, start: h(15), end: h(16), kind: 'appointment' },
			{ id: 'o7', day: WEEK[3]!, start: h(9), end: h(9, 15), kind: 'appointment' },
			{ id: 'o8', day: WEEK[3]!, start: h(9, 15), end: h(9, 30), kind: 'appointment' },
			{ id: 'o9', day: WEEK[3]!, start: h(9, 30), end: h(9, 45), kind: 'appointment' },
		],
		'edges': [
			{ id: 'e1', day: WEEK[0]!, start: h(22), end: 1440, kind: 'block' },
			{ id: 'e2', day: WEEK[1]!, start: 0, end: h(1, 30), kind: 'block' },
			{ id: 'e3', day: WEEK[2]!, start: h(5), end: h(6), kind: 'appointment' },
			{ id: 'e4', day: WEEK[2]!, start: h(23, 45), end: 1440, kind: 'appointment' },
			{ id: 'e5', day: WEEK[4]!, start: h(12), end: h(12, 5), kind: 'appointment' },
			{ id: 'e6', day: WEEK[5]!, start: 0, end: 1440, kind: 'busy', allDay: true },
			{ id: 'e7', day: WEEK[5]!, start: 0, end: 1440, kind: 'block', allDay: true },
		],
		empty: [],
	} satisfies Record<string, WeekGridItem[]>;

	const RANGES = {
		'full day': { start: 0, end: 1440 },
		'7 – 19': { start: h(7), end: h(19) },
		'9 – 17': { start: h(9), end: h(17) },
	};

	let dayCount = $state<1 | 3 | 5 | 7>(7);
	let preset = $state<keyof typeof PRESETS>('typical week');
	let rangeKey = $state<keyof typeof RANGES>('7 – 19');
	let step = $state<15 | 30 | 60>(15);
	let hourHeight = $state(48);
	let bounded = $state(true);
	let showOpen = $state(true);
	let showNow = $state(true);
	let selectable = $state(true);
	let customHeader = $state(false);
	let use24h = $state(false);

	const days = $derived(WEEK.slice(0, dayCount));
	const items = $derived(PRESETS[preset]);
	const range = $derived(RANGES[rangeKey]);
	const open = $derived<WeekGridSpan[] | undefined>(
		showOpen
			? days.flatMap((day, i) =>
					i === 5 || i === 6
						? []
						: i === 2
							? [
									{ day, start: h(8), end: h(12) },
									{ day, start: h(13), end: h(18) },
								]
							: [{ day, start: h(9), end: h(17) }],
				)
			: undefined,
	);
	const now = $derived(showNow ? { day: WEEK[2]!, minute: h(14, 20) } : null);

	const hour24 = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
	const label24 = (minute: number) => hour24.format(new Date(minute * 60_000));

	let log = $state<string[]>([]);
	const time = (minute: number) => `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;

	// Objects are opaque tints mixed against the page; the grid rings each in the page colour, so no outlines here.
	const KIND_CLASS: Record<string, string> = {
		appointment: 'bg-[color-mix(in_oklab,var(--color-primary)_18%,var(--color-background))] text-foreground shadow-[inset_3px_0_0_var(--color-primary)]',
		cancelled: 'bg-muted text-muted-foreground line-through',
		block: 'bg-[color-mix(in_oklab,var(--color-muted-foreground)_18%,var(--color-background))] text-muted-foreground',
		busy: 'bg-[color-mix(in_oklab,var(--color-chart-2)_18%,var(--color-background))] text-muted-foreground shadow-[inset_3px_0_0_var(--color-chart-2)]',
	};
</script>

{#snippet choice<T extends string | number>(name: string, options: readonly T[], value: T, set: (v: T) => void)}
	<div class="flex flex-wrap items-center gap-1.5">
		<span class="w-20 text-xs text-muted-foreground">{name}</span>
		{#each options as option (option)}
			<Button size="sm" variant={option === value ? 'default' : 'outline'} onclick={() => set(option)}>{option}</Button>
		{/each}
	</div>
{/snippet}

{#snippet todayRing(day: string)}
	{@const date = new Date(`${day}T00:00:00Z`)}
	<div class="text-xs text-muted-foreground uppercase">{date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })}</div>
	<div
		class="mx-auto grid size-7 place-items-center rounded-full text-base font-medium tabular-nums {day === WEEK[2]
			? 'bg-primary text-primary-foreground'
			: ''}">
		{date.getUTCDate()}
	</div>
{/snippet}

{#snippet flag(name: string, checked: boolean, set: (v: boolean) => void)}
	<div class="flex items-center gap-2">
		<Switch id={name} {checked} onCheckedChange={set} />
		<label for={name} class="text-xs select-none">{name}</label>
	</div>
{/snippet}

<div class="flex w-full flex-col gap-4">
	<div class="grid gap-2 rounded-lg border p-3">
		{@render choice('days', [1, 3, 5, 7] as const, dayCount, (v) => (dayCount = v))}
		{@render choice('items', Object.keys(PRESETS) as (keyof typeof PRESETS)[], preset, (v) => (preset = v))}
		{@render choice('range', Object.keys(RANGES) as (keyof typeof RANGES)[], rangeKey, (v) => (rangeKey = v))}
		{@render choice('step', [15, 30, 60] as const, step, (v) => (step = v))}
		{@render choice('hour height', [32, 48, 72] as const, hourHeight, (v) => (hourHeight = v))}
		<div class="mt-1 flex flex-wrap gap-x-5 gap-y-2">
			{@render flag('open hours', showOpen, (v) => (showOpen = v))}
			{@render flag('now marker', showNow, (v) => (showNow = v))}
			{@render flag('selectable', selectable, (v) => (selectable = v))}
			{@render flag('custom header', customHeader, (v) => (customHeader = v))}
			{@render flag('24-hour labels', use24h, (v) => (use24h = v))}
			{@render flag('max height', bounded, (v) => (bounded = v))}
		</div>
	</div>

	<WeekGrid
		{days}
		{open}
		{items}
		{range}
		{now}
		{step}
		{hourHeight}
		maxHeight={bounded ? '60svh' : 'none'}
		hourLabel={use24h ? label24 : undefined}
		dayHeader={customHeader ? todayRing : undefined}
		onselect={selectable ? (day, start, end) => (log = [`${day} ${time(start)} – ${time(end)}`, ...log].slice(0, 5)) : undefined}>
		{#snippet item(entry, box)}
			<div class="flex h-full flex-col overflow-hidden px-1.5 text-[11px] leading-[1.15] whitespace-nowrap {KIND_CLASS[entry.kind]}">
				{#if entry.allDay}
					<span class="truncate py-0.5 text-xs font-medium">{entry.kind}</span>
				{:else if box.height < 14}
					<!-- fill only -->
				{:else if box.height < 20}
					<span class="truncate text-[10px] leading-[12px]">{entry.kind}</span>
				{:else if box.height < 34}
					<span class="truncate py-0.5"><span class="text-xs font-medium">{entry.kind}</span> · {time(entry.start)} – {time(entry.end)}</span>
				{:else}
					<span class="truncate pt-0.5 text-xs font-medium">{entry.kind}</span>
					<span class="truncate">{time(entry.start)} – {time(entry.end)}</span>
				{/if}
			</div>
		{/snippet}
	</WeekGrid>

	<div class="text-sm text-muted-foreground">
		{#if !selectable}
			Read-only: no <code>onselect</code>, so the grid has no selection layer.
		{:else if log.length === 0}
			Click or drag on an empty column; selections snap to {step} minutes.
		{:else}
			{#each log as entry, i (entry + i)}<div>{entry}</div>{/each}
		{/if}
	</div>
</div>
