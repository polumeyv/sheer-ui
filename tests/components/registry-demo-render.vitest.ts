import { describe, expect, test } from "vitest";
import { render } from "../harness.js";

const cases = [
	{
		name: "progress",
		load: () => import("../../src/docs/registry/progress-demo.svelte"),
		selector: '[data-slot="progress"]',
	},
	{
		name: "radio group",
		load: () => import("../../src/docs/registry/radio-group-demo.svelte"),
		selector: '[data-slot="radio-group"]',
	},
	{
		name: "scroll area",
		load: () => import("../../src/docs/registry/scroll-area-demo.svelte"),
		selector: '[data-slot="scroll-area"]',
	},
	{
		name: "sidebar",
		load: () => import("../../src/docs/registry/sidebar-demo.svelte"),
		selector: '[data-slot="sidebar-wrapper"]',
	},
	{
		name: "date picker",
		load: () => import("../../src/docs/registry/date-picker-demo.svelte"),
		selector: "button",
	},
	{
		name: "date picker with presets",
		load: () => import("../../src/docs/registry/date-picker-presets.svelte"),
		selector: "button",
	},
	{
		name: "sheet",
		load: () => import("../../src/docs/registry/sheet-demo.svelte"),
		selector: '[data-slot="sheet-trigger"]',
	},
] as const;

describe("registry demos", () => {
	for (const demo of cases) {
		test(`${demo.name} renders its primary component`, async () => {
			const { default: Demo } = await demo.load();
			render(Demo);

			expect(document.body.querySelector(demo.selector)).not.toBeNull();
		});
	}
});
