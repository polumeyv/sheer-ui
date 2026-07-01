import { flushSync, mount, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

const cases = [
	{
		name: "progress",
		load: () => import("../../src/lib/registry/progress-demo.svelte"),
		selector: '[data-slot="progress"]',
	},
	{
		name: "radio group",
		load: () => import("../../src/lib/registry/radio-group-demo.svelte"),
		selector: '[data-slot="radio-group"]',
	},
	{
		name: "scroll area",
		load: () => import("../../src/lib/registry/scroll-area-demo.svelte"),
		selector: '[data-slot="scroll-area"]',
	},
	{
		name: "sidebar",
		load: () => import("../../src/lib/registry/sidebar-demo.svelte"),
		selector: '[data-slot="sidebar-wrapper"]',
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

afterEach(() => {
	document.body.innerHTML = "";
});

describe("registry demos", () => {
	for (const demo of cases) {
		test(`${demo.name} renders its primary component`, async () => {
			const { default: Demo } = await demo.load();
			const target = document.createElement("div");
			document.body.append(target);

			const component = mount(Demo, { target });
			flushSync();

			try {
				expect(document.body.querySelector(demo.selector)).not.toBeNull();
			} finally {
				unmount(component);
			}
		});
	}
});
