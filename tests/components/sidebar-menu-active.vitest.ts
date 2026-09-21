import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { mountInBody } from "../mount";

function installDesktopViewport() {
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
}

async function renderFixture() {
	installDesktopViewport();
	const { default: SidebarMenuActiveFixture } = await import("./sidebar-menu-active.fixture.svelte");
	return mountInBody(SidebarMenuActiveFixture);
}

function getItem(testId: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} menu item to render`);
	return node;
}

describe("Sidebar menu active state", () => {
	test("updates data-active when isActive changes", async () => {
		const { component } = await renderFixture();

		expect(getItem("accordion").dataset.active).toBe("true");
		expect(getItem("card").dataset.active).toBe("false");

		component.setActive("card");
		flushSync();

		expect(getItem("accordion").dataset.active).toBe("false");
		expect(getItem("card").dataset.active).toBe("true");
	});
});
