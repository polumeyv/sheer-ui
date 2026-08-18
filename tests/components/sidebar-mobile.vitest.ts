import { describe, expect, test } from "vitest";
import { click, render, text } from "../harness.js";

function installMobileViewport() {
	Object.defineProperty(window, "innerWidth", {
		configurable: true,
		value: 375,
	});

	Object.defineProperty(window, "matchMedia", {
		configurable: true,
		value: (query: string) => ({
			matches: query.includes("max-width"),
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
	installMobileViewport();
	const { default: SidebarDesktopFixture } = await import("./sidebar-desktop.fixture.svelte");

	return render(SidebarDesktopFixture);
}

function getMobileSidebar() {
	const node = document.body.querySelector<HTMLDialogElement>('[data-mobile="true"]');
	if (!node) throw new Error("Expected mobile sidebar to render");
	return node;
}

describe("Sidebar mobile behavior", () => {
	test("trigger toggles mobile sheet state without changing desktop open state", async () => {
		await renderFixture();

		expect(getMobileSidebar().open).toBe(false);
		expect(text("open")).toBe("true");

		click("trigger");

		expect(getMobileSidebar().open).toBe(true);
		expect(text("open")).toBe("true");
	});
});
