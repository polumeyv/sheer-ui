import type { Component } from "svelte";
import { describe, expect, test } from "vitest";
import { render } from "../harness.js";

const demos = import.meta.glob<{ default: Component }>("/src/docs/registry/*.svelte");

// Demos that cannot mount standalone, each with the reason.
const SKIP: Record<string, string> = {
	"radio-group-tiles": "Appearance calls getTheme(), which needs initTheme() from the root layout",
	"sonner-demo": "Toaster calls getTheme(), which needs initTheme() from the root layout",
	"theme-toggle-demo": "ThemeToggle calls getTheme(), which needs initTheme() from the root layout",
};

// Demos whose primary component carries a data-slot worth pinning.
const SLOTS: Record<string, string> = {
	"progress-demo": '[data-slot="progress"]',
	"radio-group-demo": '[data-slot="radio-group"]',
	"scroll-area-demo": '[data-slot="scroll-area"]',
	"sidebar-demo": '[data-slot="sidebar-wrapper"]',
	"sheet-demo": '[data-slot="sheet-trigger"]',
};

describe("registry demos", () => {
	for (const [path, load] of Object.entries(demos)) {
		const name = path.slice(path.lastIndexOf("/") + 1, -".svelte".length);
		const skip = SKIP[name];

		test.skipIf(skip)(skip ? `${name} (skipped: ${skip})` : `${name} mounts`, async () => {
			const { default: Demo } = await load();
			const { target } = render(Demo);

			expect(target.childElementCount).toBeGreaterThan(0);
			const slot = SLOTS[name];
			if (slot) expect(document.body.querySelector(slot)).not.toBeNull();
		});
	}
});
