<script lang="ts">
	import { join } from 'overrule';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { dayParts, defaultHourLabel, layoutDay, type WeekGridItem, type WeekGridSpan } from './week-grid.js';

	interface Props {
		/** ISO `YYYY-MM-DD`, in whatever order they should appear; the caller decides how many fit. */
		days: readonly string[];
		/** Visible window as minutes from midnight. */
		range?: { start: number; end: number };
		items?: readonly WeekGridItem[];
		/** Bands drawn behind the items; everything outside them reads muted. */
		open?: readonly WeekGridSpan[];
		now?: { day: string; minute: number } | null;
		/** Snap granularity of `onselect`, in minutes. */
		step?: number;
		hourHeight?: number;
		maxHeight?: string;
		item: Snippet<[WeekGridItem]>;
		dayHeader?: Snippet<[string]>;
		hourLabel?: (minute: number) => string;
		/** Click or click-drag on empty grid. Absent = the grid is read-only. */
		onselect?: (day: string, start: number, end: number) => void;
		class?: ClassValue;
	}

	let {
		days,
		range = { start: 8 * 60, end: 20 * 60 },
		items = [],
		open = [],
		now = null,
		step = 15,
		hourHeight = 48,
		maxHeight = '70svh',
		item,
		dayHeader,
		hourLabel = defaultHourLabel,
		onselect,
		class: className,
	}: Props = $props();

	const span = $derived(range.end - range.start);
	const pct = (minute: number) => ((minute - range.start) / span) * 100;
	const marks = $derived(
		Array.from({ length: Math.ceil(range.end / 60) - Math.ceil(range.start / 60) }, (_, i) => (Math.ceil(range.start / 60) + i) * 60),
	);
	const byDay = $derived(new Map(days.map((day) => [day, layoutDay(items.filter((i) => i.day === day), range.start, range.end)])));

	let drag = $state<{ day: string; anchor: number; edge: number } | null>(null);
	const draft = $derived(drag && { day: drag.day, start: Math.min(drag.anchor, drag.edge), end: Math.max(drag.anchor, drag.edge) });

	const at = (e: PointerEvent) => {
		const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const minute = range.start + ((e.clientY - box.top) / box.height) * span;
		return Math.max(range.start, Math.min(range.end, Math.round(minute / step) * step));
	};

	const commit = (day: string, start: number, end: number) =>
		onselect?.(day, Math.min(start, range.end - step), end > start ? end : Math.min(start + step, range.end));
</script>

<div
	data-slot="week-grid"
	class={join('relative overflow-auto rounded-lg border bg-background text-sm', className)}
	style="max-height: {maxHeight}">
	<div class="grid" style="grid-template-columns: 4rem repeat({days.length}, minmax(5.5rem, 1fr))">
		<div data-slot="week-grid-corner" class="sticky top-0 left-0 z-40 border-b bg-background"></div>
		{#each days as day (day)}
			<div data-slot="week-grid-header" class="sticky top-0 z-30 border-b border-l bg-background px-1 py-2 text-center">
				{#if dayHeader}
					{@render dayHeader(day)}
				{:else}
					{@const parts = dayParts(day)}
					<div class="text-xs text-muted-foreground uppercase">{parts.weekday}</div>
					<div class="text-base font-medium tabular-nums">{parts.date}</div>
				{/if}
			</div>
		{/each}

		<div
			data-slot="week-grid-axis"
			class="sticky left-0 z-20 bg-background"
			style="height: {(span / 60) * hourHeight}px">
			{#each marks as minute (minute)}
				<span class="absolute right-2 text-[11px] leading-none whitespace-nowrap text-muted-foreground tabular-nums" style="top: {pct(minute)}%">
					{hourLabel(minute)}
				</span>
			{/each}
		</div>

		{#each days as day (day)}
			<div data-slot="week-grid-day" class="relative isolate border-l bg-muted" style="height: {(span / 60) * hourHeight}px">
				{#each open.filter((b) => b.day === day) as band, i (i)}
					<div class="absolute inset-x-0 bg-background" style="top: {pct(band.start)}%; height: {pct(band.end) - pct(band.start)}%">
					</div>
				{/each}

				{#each marks as minute (minute)}
					{#if minute > range.start}
						<div class="absolute inset-x-0 border-t border-border/60" style="top: {pct(minute)}%"></div>
					{/if}
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
							drag = { day, anchor: start, edge: start };
						}}
						onpointermove={(e) => drag && (drag = { ...drag, edge: at(e) })}
						onpointerup={(e) => {
							if (!draft) return;
							commit(draft.day, draft.start, draft.end);
							drag = null;
							e.currentTarget.releasePointerCapture(e.pointerId);
						}}
						onpointercancel={() => (drag = null)}
						onclick={(e) => e.detail === 0 && commit(day, range.start, Math.min(range.start + 60, range.end))}></button>
				{/if}

				{#each byDay.get(day) ?? [] as p (p.item.id)}
					<div
						data-slot="week-grid-item"
						data-kind={p.item.kind}
						class="absolute z-10 min-h-[1.125rem] px-px"
						style="top: {pct(p.start)}%; height: {pct(p.end) - pct(p.start)}%; left: {(p.lane / p.lanes) * 100}%; width: {(1 / p.lanes) *
							100}%">
						{@render item(p.item)}
					</div>
				{/each}

				{#if draft?.day === day}
					<div
						data-slot="week-grid-draft"
						class="pointer-events-none absolute inset-x-0 z-20 rounded-sm border-2 border-primary bg-primary/20"
						style="top: {pct(draft.start)}%; height: {Math.max(pct(draft.end) - pct(draft.start), 1)}%">
					</div>
				{/if}

				{#if now?.day === day && now.minute >= range.start && now.minute <= range.end}
					<div
						data-slot="week-grid-now"
						class="pointer-events-none absolute inset-x-0 z-30 border-t-2 border-destructive"
						style="top: {pct(now.minute)}%">
						<span class="absolute -top-1 -left-0.5 size-2 rounded-full bg-destructive"></span>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
