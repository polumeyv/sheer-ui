import { describe, expect, test } from 'bun:test';
import { layoutDay, type WeekGridItem } from './week-grid.js';

const item = (id: string, start: number, end: number): WeekGridItem => ({ id, day: '2026-08-24', start, end, kind: 'x' });
const lanes = (items: WeekGridItem[], from = 0, to = 1440) =>
	Object.fromEntries(layoutDay(items, from, to).map((p) => [p.item.id, `${p.lane}+${p.span}/${p.lanes}`]));

describe('layoutDay', () => {
	test('gives each overlapping item its own lane and leaves disjoint items full width', () => {
		expect(lanes([item('a', 540, 600), item('b', 570, 630), item('c', 900, 960)])).toEqual({
			a: '0+1/2',
			b: '1+1/2',
			c: '0+1/1',
		});
	});

	test('reuses a lane freed by an earlier item in the same cluster', () => {
		expect(lanes([item('a', 540, 720), item('b', 540, 600), item('c', 600, 660)])).toEqual({
			a: '0+1/2',
			b: '1+1/2',
			c: '1+1/2',
		});
	});

	test('expands an item over lanes nothing overlapping it occupies', () => {
		// d still overlaps a, so it takes b's freed lane and widens over c's lane, which is empty by then.
		expect(lanes([item('a', 540, 600), item('b', 540, 570), item('c', 555, 585), item('d', 585, 660)])).toEqual({
			a: '0+1/3',
			b: '1+1/3',
			c: '2+1/3',
			d: '1+2/3',
		});
	});

	test('draws later-starting items above earlier ones', () => {
		const order = Object.fromEntries(layoutDay([item('a', 600, 700), item('b', 540, 660)], 0, 1440).map((p) => [p.item.id, p.order]));
		expect(order).toEqual({ b: 0, a: 1 });
	});

	test('clips to the window and drops items that fall outside it', () => {
		const placed = layoutDay([item('a', 400, 700), item('b', 100, 200)], 480, 660);
		expect(placed).toHaveLength(1);
		expect(placed[0]).toMatchObject({ start: 480, end: 660 });
	});
});
