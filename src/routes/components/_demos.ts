import type { Component } from 'svelte';
import { componentDemos, slugsWithDemos } from '../../__registry__/components.js';

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

/**
 * Resolve the demo set for a component slug — our analogue of bits-ui's
 * `getDoc(slug)`, fitted to our N-demos-per-component shape. Returns the primary
 * demo first (the registry build sorts `demo` ahead of variants), then examples.
 */
export async function getComponentDoc(slug: string): Promise<ResolvedDemo[]> {
	const demos = componentDemos[slug as keyof typeof componentDemos] ?? [];
	const resolved = await Promise.all(
		demos.map(async (demo) => {
			const resolver = modules[demo.path];
			if (!resolver) return null;
			const mod = await resolver();
			return { key: demo.key, title: mod.title, component: mod.default };
		})
	);
	return resolved.filter((d): d is ResolvedDemo => d !== null);
}

/** slugs that have at least one demo file — used by the landing page coverage badge */
export { slugsWithDemos };
