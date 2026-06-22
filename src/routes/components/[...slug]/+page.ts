import { error } from "@sveltejs/kit";
import { componentBySlug } from "../_registry.js";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
	const meta = componentBySlug.get(params.slug);
	if (!meta) error(404, `Unknown component: ${params.slug}`);
	return { meta };
};
