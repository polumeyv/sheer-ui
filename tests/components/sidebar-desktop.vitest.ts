import { flushSync, mount, unmount } from "svelte";
import { afterEach, describe, expect, test } from "vitest";

// The sidebar reads the viewport off the desktop panel's own computed display, not a media
// query. jsdom applies no Tailwind, so the panel computes to `block`: the desktop viewport.
async function renderFixture() {
	const { default: SidebarDesktopFixture } = await import("./sidebar-desktop.fixture.svelte");

	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(SidebarDesktopFixture, { target });
	flushSync();

	return { component };
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

afterEach(() => {
	document.body.innerHTML = "";
});

describe("Sidebar desktop behavior", () => {
	test("renders both surfaces, the sheet closed, on wider screens", async () => {
		const { component } = await renderFixture();

		try {
			expect(getDesktopSidebar().dataset.state).toBe("expanded");
			expect(document.body.querySelector<HTMLDialogElement>('[data-mobile="true"]')?.open).toBe(false);
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

	test("keyboard shortcut toggles once and does not steal editable shortcuts", async () => {
		const { component } = await renderFixture();

		try {
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
		} finally {
			unmount(component);
		}
	});
});
