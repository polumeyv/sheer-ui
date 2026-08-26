/**
 * Full, app-ready compositions (the "blocks"), as opposed to the headless components in
 * `../components/_registry`. Showcased under `/blocks`. The sidebar and the `[...slug]` route both
 * read from here; each entry's `slug` names its `<slug>-demo.svelte` showcase in this directory.
 *
 * Blocks are few and each has a single live showcase, so this is a static list — unlike the
 * glob-driven component demos in `../components/_demos` (which reject a non-component slug outright).
 */
export type BlockMeta = {
	/** URL segment + `<slug>-demo.svelte` showcase prefix */
	slug: string;
	/** Display name */
	name: string;
	/** One-line summary shown under the heading and on the landing cards */
	description: string;
	/** Preview at the page's full width; for blocks whose layout only reads at real size. */
	wide?: boolean;
};

export const blocks: BlockMeta[] = [
	{
		slug: 'alert-modal',
		name: 'Alert Modal',
		description: 'A store-driven confirm / acknowledge modal built on the native <dialog> element.',
	},
	{
		slug: 'week-grid',
		name: 'Week Grid',
		description: 'A day/week time grid: open bands, lane-packed items, a now marker, and click-drag selection.',
		wide: true,
	},
	{
		slug: 'heading',
		name: 'Heading',
		description: 'A page heading: title row plus an optional tab nav.',
	},
];

export const blockBySlug = new Map(blocks.map((b) => [b.slug, b]));
