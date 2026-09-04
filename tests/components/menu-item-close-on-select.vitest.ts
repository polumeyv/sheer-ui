import { flushSync, mount, unmount } from "svelte";
import { describe, expect, test } from "vitest";
import Fixture from "./menu-item-close-on-select.fixture.svelte";

function render() {
	const target = document.createElement("div");
	document.body.append(target);
	const component = mount(Fixture, { target });
	flushSync();
	return () => {
		unmount(component);
		document.body.innerHTML = "";
	};
}

function read(testId: string) {
	const node = document.body.querySelector(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} to render`);
	return node.textContent;
}

function click(testId: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} to render`);
	node.click();
	flushSync();
}

describe("menu item close on select", () => {
	test("a plain item closes the menu", () => {
		const cleanup = render();
		click("item");
		expect(read("open")).toBe("false");
		cleanup();
	});

	test("a checkbox item toggles and keeps the menu open", () => {
		const cleanup = render();
		click("checkbox");
		expect(read("checked")).toBe("true");
		expect(read("open")).toBe("true");
		click("checkbox");
		expect(read("checked")).toBe("false");
		expect(read("open")).toBe("true");
		cleanup();
	});

	test("a radio item selects and closes the menu", () => {
		const cleanup = render();
		click("radio-b");
		expect(read("radio")).toBe("b");
		expect(read("open")).toBe("false");
		cleanup();
	});

	test("preventDefault in onSelect keeps a plain item's menu open", () => {
		const cleanup = render();
		click("kept-item");
		expect(read("open")).toBe("true");
		cleanup();
	});

	test("preventDefault in onSelect keeps a radio item's menu open and still selects it", () => {
		const cleanup = render();
		click("kept-radio-c");
		expect(read("radio")).toBe("c");
		expect(read("open")).toBe("true");
		cleanup();
	});
});
