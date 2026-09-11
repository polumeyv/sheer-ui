import { beforeEach, describe, expect, test } from "vitest";
import { mountInBody } from "../mount";

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

beforeEach(() => {
	Object.defineProperty(window, "matchMedia", {
		configurable: true,
		value: (query: string) => ({
			matches: query.includes("max-width") ? false : true,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {},
			removeListener: () => {},
			dispatchEvent: () => false,
		}),
	});

	class ResizeObserverStub {
		observe() {}
		unobserve() {}
		disconnect() {}
	}

	Object.defineProperty(window, "ResizeObserver", {
		configurable: true,
		value: ResizeObserverStub,
	});
	Object.defineProperty(globalThis, "ResizeObserver", {
		configurable: true,
		value: ResizeObserverStub,
	});
});

describe("registry demos", () => {
	for (const demo of cases) {
		test(`${demo.name} renders its primary component`, async () => {
			const { default: Demo } = await demo.load();
			mountInBody(Demo);

			expect(document.body.querySelector(demo.selector)).not.toBeNull();
		});
	}
});
