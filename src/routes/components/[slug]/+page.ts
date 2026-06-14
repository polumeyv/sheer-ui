import { error } from '@sveltejs/kit';
import { componentBySlug } from '../../registry';

export function load({ params }) {
	const meta = componentBySlug.get(params.slug);
	if (!meta) error(404, `Unknown component: "${params.slug}"`);
	return { meta };
}
