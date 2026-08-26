/** A span of one day, in minutes from that day's midnight, half-open `[start, end)`. */
export type WeekGridSpan = { day: string; start: number; end: number };

/** `kind` is opaque to the grid: it lands on the positioned wrapper as `data-kind` for styling and hit-testing.
 *  An `allDay` item is drawn as a chip under that day's header, never in the time grid. */
export type WeekGridItem = WeekGridSpan & { id: string; kind: string; allDay?: boolean };

/** An item clipped to the visible window: lane `lane` of the cluster's `lanes`, widened over `span` lanes that
 *  nothing overlapping occupies, and drawn above earlier-starting items (`order`). */
export type WeekGridPlacement = { item: WeekGridItem; start: number; end: number; lane: number; lanes: number; span: number; order: number };

/** What the item snippet gets besides the item: the rendered box height in px, so it can drop what it cannot fit. */
export type WeekGridBox = { height: number };

/**
 * Clip one day's items to `[from, to)`, pack them into lanes, then let each item expand rightward into lanes no
 * overlapping item uses. Items that overlap only through a chain of other items still share a cluster, so a pair
 * at 9am does not narrow an unrelated item at 4pm.
 */
export const layoutDay = (items: readonly WeekGridItem[], from: number, to: number): WeekGridPlacement[] => {
	const clipped = items
		.map((item) => ({ item, start: Math.max(item.start, from), end: Math.min(item.end, to), lane: 0, lanes: 1, span: 1, order: 0 }))
		.filter((p) => p.end > p.start)
		.sort((a, b) => a.start - b.start || b.end - a.end);

	const placed: WeekGridPlacement[] = [];
	let cluster: WeekGridPlacement[] = [];
	let laneEnds: number[] = [];
	let clusterEnd = -Infinity;

	const closeCluster = () => {
		const lanes = laneEnds.length;
		for (const p of cluster) {
			p.lanes = lanes;
			while (
				p.lane + p.span < lanes &&
				!cluster.some((q) => q.lane === p.lane + p.span && q.start < p.end && p.start < q.end)
			)
				p.span++;
		}
		placed.push(...cluster);
		cluster = [];
		laneEnds = [];
	};

	clipped.forEach((p, order) => {
		p.order = order;
		if (p.start >= clusterEnd) closeCluster();
		const free = laneEnds.findIndex((end) => end <= p.start);
		p.lane = free === -1 ? laneEnds.push(p.end) - 1 : free;
		laneEnds[p.lane] = p.end;
		cluster.push(p);
		clusterEnd = Math.max(clusterEnd, p.end);
	});
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
