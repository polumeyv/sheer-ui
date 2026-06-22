import { flushSync, mount, unmount } from "svelte";
import { afterEach, describe, expect, test } from "vitest";

function installDesktopViewport() {
	Object.defineProperty(window, "innerWidth", {
		configurable: true,
		value: 1024,
	});

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
	const { default: SidebarDesktopFixture } = await import("./sidebar-desktop.fixture.svelte");

	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(SidebarDesktopFixture, { target });
	flushSync();

	return { component };
}

function getDesktopSidebar() {
	const node = document.body.querySelector<HTMLElement>('[data-slot="sidebar"][data-state]');
	if (!node) throw new Error("Expected desktop sidebar to render");
	return node;
}

function getTrigger() {
	const node = document.body.querySelector<HTMLButtonElement>('[data-testid="trigger"]');
	if (!node) throw new Error("Expected sidebar trigger to render");
	return node;
}

afterEach(() => {
	document.body.innerHTML = "";
});

describe("Sidebar desktop behavior", () => {
	test("renders the desktop branch on wider screens", async () => {
		const { component } = await renderFixture();

		try {
			expect(getDesktopSidebar().dataset.state).toBe("expanded");
			expect(document.body.querySelector('[data-mobile="true"]')).toBeNull();
		} finally {
			unmount(component);
		}
	});

	test("trigger toggles the desktop open state on wider screens", async () => {
		const { component } = await renderFixture();

		try {
			getTrigger().click();
			flushSync();
			expect(getDesktopSidebar().dataset.state).toBe("collapsed");

			getTrigger().click();
			flushSync();
			expect(getDesktopSidebar().dataset.state).toBe("expanded");
		} finally {
			unmount(component);
		}
	});
});
