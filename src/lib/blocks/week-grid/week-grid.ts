/** A span of one day, in minutes from that day's midnight, half-open `[start, end)`. */
export type WeekGridSpan = { day: string; start: number; end: number };

/** `kind` is opaque to the grid: it lands on the positioned wrapper as `data-kind` for styling and hit-testing. */
export type WeekGridItem = WeekGridSpan & { id: string; kind: string };

/** An item clipped to the visible window, in lane `lane` of the `lanes` side-by-side lanes that cover the
 *  cluster of items it transitively overlaps. */
export type WeekGridPlacement = { item: WeekGridItem; start: number; end: number; lane: number; lanes: number };

/** What the item snippet gets besides the item: its rendered box height in px, so it can drop lines it cannot fit,
 *  and whether it spans the whole visible window (a full-day block), which the caller usually paints edge to edge. */
export type WeekGridBox = { height: number; full: boolean; lanes: number };

/**
 * Clip one day's items to `[from, to)` and pack them into lanes. Items that overlap only through a chain of
 * other items still share a cluster, so a pair overlapping at 9am does not narrow an unrelated item at 4pm.
 */
export const layoutDay = (items: readonly WeekGridItem[], from: number, to: number): WeekGridPlacement[] => {
	const clipped = items
		.map((item) => ({ item, start: Math.max(item.start, from), end: Math.min(item.end, to), lane: 0, lanes: 1 }))
		.filter((p) => p.end > p.start)
		.sort((a, b) => a.start - b.start || b.end - a.end);

	const placed: WeekGridPlacement[] = [];
	let cluster: WeekGridPlacement[] = [];
	let laneEnds: number[] = [];
	let clusterEnd = -Infinity;

	const closeCluster = () => {
		for (const p of cluster) p.lanes = laneEnds.length;
		placed.push(...cluster);
		cluster = [];
		laneEnds = [];
	};

	for (const p of clipped) {
		if (p.start >= clusterEnd) closeCluster();
		const free = laneEnds.findIndex((end) => end <= p.start);
		p.lane = free === -1 ? laneEnds.push(p.end) - 1 : free;
		laneEnds[p.lane] = p.end;
		cluster.push(p);
		clusterEnd = Math.max(clusterEnd, p.end);
	}
	closeCluster();
	return placed;
};

// UTC-pinned so a label reads the same on every runtime; the grid's minutes are already wall clock.
const HOUR_LABEL = new Intl.DateTimeFormat('en-US', { hour: 'numeric', timeZone: 'UTC' });
const DAY_LABEL = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' });

export const defaultHourLabel = (minute: number) => HOUR_LABEL.format(new Date(Date.UTC(2024, 0, 1, 0, minute)));

/** `YYYY-MM-DD` → `{ weekday: 'Mon', date: '4' }`, the two lines of the default day header. */
export const dayParts = (day: string) => {
	const at = new Date(`${day}T00:00:00Z`);
	return { weekday: DAY_LABEL.format(at), date: String(at.getUTCDate()) };
};
