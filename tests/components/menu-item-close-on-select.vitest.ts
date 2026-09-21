import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { mountInBody } from "../mount";
import Fixture from "./menu-item-close-on-select.fixture.svelte";

function render() {
	return mountInBody(Fixture);
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
		render();
		click("item");
		expect(read("open")).toBe("false");
	});

	test("a checkbox item toggles and keeps the menu open", () => {
		render();
		click("checkbox");
		expect(read("checked")).toBe("true");
		expect(read("open")).toBe("true");
		click("checkbox");
		expect(read("checked")).toBe("false");
		expect(read("open")).toBe("true");
	});

	test("a radio item selects and closes the menu", () => {
		render();
		click("radio-b");
		expect(read("radio")).toBe("b");
		expect(read("open")).toBe("false");
	});

	test("preventDefault in onSelect keeps a plain item's menu open", () => {
		render();
		click("kept-item");
		expect(read("open")).toBe("true");
	});

	test("preventDefault in onSelect still toggles a checkbox item", () => {
		render();
		click("kept-checkbox");
		expect(read("kept-checked")).toBe("true");
		expect(read("open")).toBe("true");
	});

	test("a disabled checkbox item neither toggles nor closes", () => {
		render();
		click("disabled-checkbox");
		expect(read("disabled-checked")).toBe("false");
		expect(read("open")).toBe("true");
	});

	test("preventDefault in onSelect keeps a radio item's menu open and still selects it", () => {
		render();
		click("kept-radio-c");
		expect(read("radio")).toBe("c");
		expect(read("open")).toBe("true");
	});

	test("a press released on a checkbox item selects it whether or not an earlier press started there", () => {
		render();
		const node = document.body.querySelector<HTMLElement>('[data-testid="checkbox"]');
		if (!node) throw new Error("Expected checkbox to render");
		const pointer = (type: string) => {
			node.dispatchEvent(new MouseEvent(type, { bubbles: true }));
			flushSync();
		};

		// A press that starts here: the native click selects, no synthetic one doubles it.
		pointer("pointerdown");
		pointer("pointerup");
		expect(read("checked")).toBe("false");
		click("checkbox");
		expect(read("checked")).toBe("true");

		// A press that started on the trigger and was released here: no native click follows.
		pointer("pointerup");
		expect(read("checked")).toBe("false");
		expect(read("open")).toBe("true");
	});
});
