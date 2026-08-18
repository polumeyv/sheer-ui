import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { click, render } from "../harness.js";
import SidebarDesktopFixture from "./sidebar-desktop.fixture.svelte";

Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });

function getDesktopSidebar() {
	const node = document.body.querySelector<HTMLElement>('[data-slot="sidebar"][data-state]');
	if (!node) throw new Error("Expected desktop sidebar to render");
	return node;
}

describe("Sidebar desktop behavior", () => {
	test("renders the desktop branch on wider screens", () => {
		render(SidebarDesktopFixture);

		expect(getDesktopSidebar().dataset.state).toBe("expanded");
		expect(document.body.querySelector('[data-mobile="true"]')).toBeNull();
	});

	test("trigger toggles the desktop open state on wider screens", () => {
		render(SidebarDesktopFixture);

		click("trigger");
		expect(getDesktopSidebar().dataset.state).toBe("collapsed");

		click("trigger");
		expect(getDesktopSidebar().dataset.state).toBe("expanded");
	});

	test("keyboard shortcut toggles once and does not steal editable shortcuts", () => {
		render(SidebarDesktopFixture);

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
