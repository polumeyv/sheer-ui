import { error } from '@sveltejs/kit';
import { componentBySlug, components } from '../_registry.js';
import { getComponentDoc } from '../_demos.js';
import type { EntryGenerator, PageLoad } from './$types';

// Statically generate every component page — mirrors bits-ui's `prerender = true`
// + `entries()` over the doc collections.
export const prerender = true;

export const entries: EntryGenerator = () => components.map((c) => ({ slug: c.slug }));

export const load: PageLoad = async ({ params }) => {
	const meta = componentBySlug.get(params.slug);
	if (!meta) error(404, `Unknown component: ${params.slug}`);
	const demos = await getComponentDoc(params.slug);
	return { meta, demos };
};
