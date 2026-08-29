import type { Component } from 'svelte';
import AlertModalDemo from './alert-modal-demo.svelte';
import HeadingDemo from './heading-demo.svelte';

// Static slug → showcase map — the blocks analogue of components' glob-driven `_demos`. Kept out of
// `load` (Components aren't serializable); the `[...slug]` page looks the demo up at render time.
const demos: Record<string, Component> = {
	'alert-modal': AlertModalDemo,
	heading: HeadingDemo,
};

export function getBlockDemo(slug: string): Component | undefined {
	return demos[slug];
}
