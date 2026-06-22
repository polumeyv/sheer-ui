
import type { Component } from "svelte";
import { componentDemos, slugsWithDemos } from "../../__registry__/components.js";

type DemoModule = {
	default: Component;
	title?: string;
};

export type Demo = {
	/** owning component slug */
	slug: string;
	/** filename key (used for the {#each} key + ordering) */
	key: string;
	/** optional display label */
	title?: string;
	component: Component;
};

const modules = import.meta.glob<DemoModule>("/src/lib/registry/examples/**/*.svelte", {
	eager: true,
});

const bySlug = new Map<string, Demo[]>();

for (const [slug, demos] of Object.entries(componentDemos)) {
	const list: Demo[] = [];
	for (const demo of demos) {
		const mod = modules[demo.path];
		if (!mod) continue;
		list.push({ slug, key: demo.key, title: mod.title, component: mod.default });
	}
	bySlug.set(slug, list);
}

export function demosFor(slug: string): Demo[] {
	return bySlug.get(slug) ?? [];
}

/** slugs that have at least one demo file — used to flag coverage gaps */
export { slugsWithDemos };
