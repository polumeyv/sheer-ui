import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { mountInBody } from "../mount";

// The sidebar reads the viewport off the desktop panel's own computed display, not a media
// query. jsdom applies no Tailwind, so the panel computes to `block`: the desktop viewport.
async function renderFixture() {
	const { default: SidebarDesktopFixture } = await import("./sidebar-desktop.fixture.svelte");
	return mountInBody(SidebarDesktopFixture);
}

function getDesktopSidebar() {
	// The sheet <dialog> carries data-slot="sidebar" too; the panel is the one without data-mobile.
	const node = document.body.querySelector<HTMLElement>('[data-slot="sidebar"][data-state]:not([data-mobile])');
	if (!node) throw new Error("Expected desktop sidebar to render");
	return node;
}

function getTrigger() {
	const node = document.body.querySelector<HTMLButtonElement>('[data-testid="trigger"]');
	if (!node) throw new Error("Expected sidebar trigger to render");
	return node;
}

describe("Sidebar desktop behavior", () => {
	test("renders both surfaces, the sheet closed, on wider screens", async () => {
		await renderFixture();

		expect(getDesktopSidebar().dataset.state).toBe("expanded");
		expect(document.body.querySelector<HTMLDialogElement>('[data-mobile="true"]')?.open).toBe(false);
	});

	test("trigger toggles the desktop open state on wider screens", async () => {
		await renderFixture();

		getTrigger().click();
		flushSync();
		expect(getDesktopSidebar().dataset.state).toBe("collapsed");

		getTrigger().click();
		flushSync();
		expect(getDesktopSidebar().dataset.state).toBe("expanded");
	});

	test("keyboard shortcut toggles once and does not steal editable shortcuts", async () => {
		await renderFixture();

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "b", ctrlKey: true }));
		flushSync();
		expect(getDesktopSidebar().dataset.state).toBe("collapsed");

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "b", ctrlKey: true, repeat: true }));
		flushSync();
		expect(getDesktopSidebar().dataset.state).toBe("collapsed");

		const input = document.createElement("input");
		document.body.append(input);
		input.dispatchEvent(new KeyboardEvent("keydown", { key: "b", ctrlKey: true, bubbles: true }));
		flushSync();
		expect(getDesktopSidebar().dataset.state).toBe("collapsed");
	});
});
