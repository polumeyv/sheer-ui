import type { Component } from 'svelte';
import { components } from './_registry.js';

type DemoModule = {
	default: Component;
	title?: string;
};

export type ResolvedDemo = {
	/** filename key (e.g. "demo", "with-icon") — drives the {#each} key + label */
	key: string;
	/** optional display label exported by the demo module */
	title?: string;
	component: Component;
};

// Lazy glob: each demo is resolved on demand inside `load`, mirroring bits-ui's
// `import.meta.glob('/content/**/*.md')`. With the previous `eager: true` a single
// broken demo crashed this module and 500'd every component page — now a failure
// is scoped to its own slug.
const modules = import.meta.glob<DemoModule>('/src/docs/registry/*.svelte');

// Demos live flat in registry/ named `<slug>-<descriptor>.svelte` (shadcn convention; the default
// example is `<slug>-demo.svelte`). The owning slug is the longest known component slug that
// prefixes the filename — longest-first so multi-word slugs (alert-dialog, toggle-group) win over
// their shorter prefixes (alert, toggle). `demo` sorts ahead of the variants.
const slugs = components.map((c) => c.slug).sort((a, b) => b.length - a.length);
const demosBySlug = new Map<string, { key: string; path: string }[]>();
for (const path of Object.keys(modules)) {
	const name = path.slice(path.lastIndexOf('/') + 1, -'.svelte'.length);
	const slug = slugs.find((s) => name === s || name.startsWith(`${s}-`));
	if (!slug) throw new Error(`Demo file has no matching component slug: ${name}.svelte`);
	const key = name === slug ? 'demo' : name.slice(slug.length + 1);
	demosBySlug.set(slug, [...(demosBySlug.get(slug) ?? []), { key, path }].sort((a, b) => a.key.localeCompare(b.key)));
}

/**
 * Resolve the demo set for a component slug — our analogue of bits-ui's
 * `getDoc(slug)`, fitted to our N-demos-per-component shape. Returns the primary
 * demo first, then examples.
 */
export async function getComponentDoc(slug: string): Promise<ResolvedDemo[]> {
	const demos = demosBySlug.get(slug) ?? [];
	const resolved = await Promise.all(
		demos.map(async (demo) => {
			const mod = await modules[demo.path]!();
			return { key: demo.key, title: mod.title, component: mod.default };
		})
	);
	return resolved;
}

/** slugs that have at least one demo file — used by the landing page coverage badge */
export const slugsWithDemos = new Set(demosBySlug.keys());
