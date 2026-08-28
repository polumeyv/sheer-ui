<script lang="ts">
	import { join } from 'overrule';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { formatTimeRange } from '../../time.js';
	import { dayParts, defaultHourLabel, layoutDay, type WeekGridBox, type WeekGridItem, type WeekGridSpan } from './week-grid.js';

	interface Props {
		/** ISO `YYYY-MM-DD`, in whatever order they should appear; the caller decides how many fit. */
		days: readonly string[];
		/** Visible window as minutes from midnight. */
		range?: { start: number; end: number };
		items?: readonly WeekGridItem[];
		/** Open bands per day; everything else in a listed day's window is shaded closed. Omit for no shading. */
		open?: readonly WeekGridSpan[];
		now?: { day: string; minute: number } | null;
		/** Snap granularity of `onselect`, in minutes. */
		step?: number;
		hourHeight?: number;
		maxHeight?: string;
		item: Snippet<[WeekGridItem, WeekGridBox]>;
		dayHeader?: Snippet<[string]>;
		hourLabel?: (minute: number) => string;
		/** Click or click-drag on empty grid. Absent = the grid is read-only. */
		onselect?: (day: string, start: number, end: number) => void;
		/** The span a drag is reaching, shown above the draft as it moves. */
		draftLabel?: (start: number, end: number) => string;
		class?: ClassValue;
	}

	let {
		days,
		range = { start: 8 * 60, end: 20 * 60 },
		items = [],
		open,
		now = null,
		step = 15,
		hourHeight = 48,
		maxHeight = '70svh',
		item,
		dayHeader,
		hourLabel = defaultHourLabel,
		onselect,
		draftLabel = formatTimeRange,
		class: className,
	}: Props = $props();

	const span = $derived(range.end - range.start);
	const pct = (minute: number) => ((minute - range.start) / span) * 100;
	const px = (minutes: number) => (minutes / 60) * hourHeight;
	const marks = $derived(
		Array.from({ length: Math.ceil(range.end / 60) - Math.ceil(range.start / 60) }, (_, i) => (Math.ceil(range.start / 60) + i) * 60).filter(
			(minute) => minute > range.start,
		),
	);
	const timed = $derived(items.filter((i) => !i.allDay));
	const allDay = $derived(items.filter((i) => i.allDay));
	const byDay = $derived(new Map(days.map((day) => [day, layoutDay(timed.filter((i) => i.day === day), range.start, range.end)])));

	// The complement of a day's open bands inside the window, painted as the closed region.
	const closedOn = (day: string) => {
		if (!open) return [];
		const bands = open.filter((b) => b.day === day).sort((a, b) => a.start - b.start);
		const out: { start: number; end: number }[] = [];
		let cursor = range.start;
		for (const b of bands) {
			if (b.start > cursor) out.push({ start: cursor, end: Math.min(b.start, range.end) });
			cursor = Math.max(cursor, b.end);
		}
		if (cursor < range.end) out.push({ start: cursor, end: range.end });
		return out;
	};

	let drag = $state<{ pointerId: number; day: string; anchor: number; edge: number } | null>(null);
	const draft = $derived(drag && { day: drag.day, start: Math.min(drag.anchor, drag.edge), end: Math.max(drag.anchor, drag.edge) });

	const at = (e: PointerEvent) => {
		const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const minute = range.start + ((e.clientY - box.top) / box.height) * span;
		return Math.max(range.start, Math.min(range.end, Math.round(minute / step) * step));
	};

	const commit = (day: string, start: number, end: number) =>
		onselect?.(day, Math.min(start, range.end - step), end > start ? end : Math.min(start + step, range.end));
</script>

<!-- Five layers, one device each: ground (fills), structure (one hairline everywhere), objects (opaque chips ringed
     in the ground colour so the grid reads as passing behind them), overlays (the only saturated marks), chrome. -->
<div
	data-slot="week-grid"
	class={join('relative overflow-auto rounded-lg border border-border/50 bg-background text-sm', className)}
	style="max-height: {maxHeight}">
	<div class="grid" style="grid-template-columns: 3.5rem repeat({days.length}, minmax(7rem, 1fr))">
		<div data-slot="week-grid-corner" class="sticky top-0 left-0 z-40 border-b border-border/50 bg-background"></div>
		{#each days as day (day)}
			<div data-slot="week-grid-header" class="sticky top-0 z-30 flex flex-col border-b border-border/50 bg-background px-1 pt-2 pb-1">
				<div class="text-center">
					{#if dayHeader}
						{@render dayHeader(day)}
					{:else}
						{@const parts = dayParts(day)}
						<div class="text-[11px] text-muted-foreground uppercase">{parts.weekday}</div>
						<div class="text-base font-medium tabular-nums">{parts.date}</div>
					{/if}
				</div>
				{#each allDay.filter((i) => i.day === day) as entry (entry.id)}
					<div data-slot="week-grid-allday" data-kind={entry.kind} class="mt-1 h-5 overflow-hidden rounded-[4px] ring-1 ring-background">
						{@render item(entry, { height: 20 })}
					</div>
				{/each}
			</div>
		{/each}

		<div data-slot="week-grid-axis" class="sticky left-0 z-20 bg-background" style="height: {px(span)}px">
			{#each marks as minute (minute)}
				<span
					class="absolute right-2 -translate-y-1/2 text-[11px] leading-none whitespace-nowrap text-muted-foreground tabular-nums"
					style="top: {pct(minute)}%">
					{hourLabel(minute)}
				</span>
			{/each}
		</div>

		{#each days as day (day)}
			<div data-slot="week-grid-day" class="relative isolate border-l border-border/50 bg-background" style="height: {px(span)}px">
				{#each closedOn(day) as band, i (i)}
					<div class="absolute inset-x-0 bg-muted/50" style="top: {pct(band.start)}%; height: {pct(band.end) - pct(band.start)}%"></div>
				{/each}

				{#each marks as minute (minute)}
					<div class="absolute inset-x-0 border-t border-border/50" style="top: {pct(minute)}%"></div>
				{/each}

				{#if onselect}
					<button
						type="button"
						aria-label="Add on {day}"
						class="absolute inset-0 cursor-cell select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
						onpointerdown={(e) => {
							if (e.button !== 0) return;
							e.currentTarget.setPointerCapture(e.pointerId);
							const start = at(e);
							drag = { pointerId: e.pointerId, day, anchor: start, edge: start };
						}}
						onpointermove={(e) => drag?.pointerId === e.pointerId && (drag = { ...drag, edge: at(e) })}
						onpointerup={(e) => {
							if (!draft || drag?.pointerId !== e.pointerId) return;
							commit(draft.day, draft.start, draft.end);
							drag = null;
							e.currentTarget.releasePointerCapture(e.pointerId);
						}}
						onpointercancel={(e) => drag?.pointerId === e.pointerId && (drag = null)}
						onclick={(e) => e.detail === 0 && commit(day, range.start, Math.min(range.start + 60, range.end))}></button>
				{/if}

				{#each byDay.get(day) ?? [] as p (p.item.id)}
					<div
						data-slot="week-grid-item"
						data-kind={p.item.kind}
						class="absolute overflow-hidden rounded-[4px] ring-1 ring-background"
						style="top: {pct(p.start)}%; height: {pct(p.end) - pct(p.start)}%; left: {(p.lane / p.lanes) * 100}%; width: {(p.span / p.lanes) *
							100}%; z-index: {10 + p.order}">
						{@render item(p.item, { height: px(p.end - p.start) })}
					</div>
				{/each}

				{#if draft?.day === day}
					<div
						data-slot="week-grid-draft"
						class="pointer-events-none absolute inset-x-0 z-40 rounded-[4px] bg-primary/30 ring-1 ring-background"
						style="top: {pct(draft.start)}%; height: {Math.max(pct(draft.end) - pct(draft.start), 1)}%">
						<!-- Sits just above the draft so the pointer never covers it; fades in with the drag, then tracks it. -->
						<span
							data-slot="week-grid-draft-label"
							class="absolute left-1 -translate-y-[calc(100%+2px)] rounded-[4px] bg-background/90 px-1 text-[10px] leading-4 font-medium tabular-nums whitespace-nowrap text-foreground ring-1 ring-border/50 transition-opacity duration-150 starting:opacity-0">
							{draftLabel(draft.start, draft.end)}
						</span>
					</div>
				{/if}

				{#if now?.day === day && now.minute >= range.start && now.minute <= range.end}
					<div
						data-slot="week-grid-now"
						class="pointer-events-none absolute inset-x-0 z-50 border-t-2 border-destructive"
						style="top: {pct(now.minute)}%">
						<span class="absolute -top-1 -left-0.5 size-2 rounded-full bg-destructive"></span>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
