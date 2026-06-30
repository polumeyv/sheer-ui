import { error } from '@sveltejs/kit';
import { blockBySlug, blocks } from '../_registry.js';
import type { EntryGenerator, PageLoad } from './$types';

// Statically generate every block page, mirroring the components route.
export const prerender = true;

export const entries: EntryGenerator = () => blocks.map((b) => ({ slug: b.slug }));

export const load: PageLoad = ({ params }) => {
	const meta = blockBySlug.get(params.slug);
	if (!meta) error(404, `Unknown block: ${params.slug}`);
	return { meta };
};
