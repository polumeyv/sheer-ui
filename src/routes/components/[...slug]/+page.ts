import { error } from '@sveltejs/kit';
import { bySlug, entries as registry } from '../_registry.js';
import { getDemos } from '../_demos.js';
import type { EntryGenerator, PageLoad } from './$types';

// Statically generate every component and block page — mirrors bits-ui's `prerender = true`
// + `entries()` over the doc collections.
export const prerender = true;

export const entries: EntryGenerator = () => registry.map((entry) => ({ slug: entry.slug }));

export const load: PageLoad = async ({ params }) => {
	const meta = bySlug.get(params.slug);
	if (!meta) error(404, `Unknown slug: ${params.slug}`);
	const demos = await getDemos(params.slug);
	return { meta, demos };
};
