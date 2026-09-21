import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { mountInBody, unmount } from "../mount";
import SelectionGroupFixture from "./selection-group.fixture.svelte";

type Surface = "toggle-group" | "toolbar";
type SelectionType = "single" | "multiple";

function renderFixture(props: { surface: Surface; type: SelectionType; disabled?: boolean; rovingFocus?: boolean }) {
	return mountInBody(SelectionGroupFixture, props).component;
}

function getItem(name: string) {
	const node = document.body.querySelector<HTMLButtonElement>(`[data-testid="item-${name}"]`);
	if (!node) throw new Error(`Expected item-${name} to render`);
	return node;
}

// `.click()` is a no-op on a disabled button in jsdom, which would pass the
// disabled cases for the wrong reason — dispatch reaches the handler either way.
function click(name: string) {
	getItem(name).dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
	flushSync();
}

function press(name: string, key: string) {
	getItem(name).dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
	flushSync();
}

function readValue() {
	const node = document.body.querySelector('[data-testid="value"]');
	if (!node) throw new Error("Expected value readout to render");
	return node.textContent;
}

const surfaces: Surface[] = ["toggle-group", "toolbar"];

for (const surface of surfaces) {
	describe(`${surface} selection`, () => {
		test("single mode selects one item, deselects on a second click, and marks it as a radio", () => {
			renderFixture({ surface, type: "single" });

			expect(readValue()).toBe("");
			expect(getItem("alpha").getAttribute("data-state")).toBe("off");
			expect(getItem("alpha").getAttribute("role")).toBe("radio");
			expect(getItem("alpha").getAttribute("aria-checked")).toBe("false");
			expect(getItem("alpha").getAttribute("aria-pressed")).toBeNull();

			click("alpha");
			expect(readValue()).toBe("alpha");
			expect(getItem("alpha").getAttribute("data-state")).toBe("on");
			expect(getItem("alpha").getAttribute("aria-checked")).toBe("true");

			click("beta");
			expect(readValue()).toBe("beta");
			expect(getItem("alpha").getAttribute("data-state")).toBe("off");

			click("beta");
			expect(readValue()).toBe("");
			expect(getItem("beta").getAttribute("data-state")).toBe("off");
		});

		test("multiple mode accumulates items and marks them as pressed", () => {
			renderFixture({ surface, type: "multiple" });

			expect(readValue()).toBe("[]");
			expect(getItem("alpha").getAttribute("role")).toBeNull();
			expect(getItem("alpha").getAttribute("aria-pressed")).toBe("false");
			expect(getItem("alpha").getAttribute("aria-checked")).toBeNull();

			click("alpha");
			click("beta");
			expect(readValue()).toBe("[alpha,beta]");
			expect(getItem("alpha").getAttribute("aria-pressed")).toBe("true");
			expect(getItem("beta").getAttribute("data-state")).toBe("on");

			click("alpha");
			expect(readValue()).toBe("[beta]");
			expect(getItem("alpha").getAttribute("data-state")).toBe("off");
		});

		test("Enter and Space toggle the item they land on", () => {
			renderFixture({ surface, type: "multiple" });

			press("alpha", "Enter");
			expect(readValue()).toBe("[alpha]");

			press("beta", " ");
			expect(readValue()).toBe("[alpha,beta]");

			press("alpha", "Enter");
			expect(readValue()).toBe("[beta]");
		});

		test("a disabled group disables its items and ignores their clicks", () => {
			renderFixture({ surface, type: "multiple", disabled: true });

			expect(getItem("alpha").getAttribute("data-disabled")).toBe("");
			expect(getItem("alpha").disabled).toBe(true);

			click("alpha");
			press("beta", "Enter");
			expect(readValue()).toBe("[]");
		});

		test("a value reset to undefined repairs back to the empty selection", () => {
			const component = renderFixture({ surface, type: "multiple" });

			click("alpha");
			expect(readValue()).toBe("[alpha]");

			component.setValue(undefined);
			flushSync();
			expect(readValue()).toBe("[]");

			click("beta");
			expect(readValue()).toBe("[beta]");
		});
	});
}

describe("selection and the roving tab stop", () => {
	test("a toggle-group item takes the tab stop when it is selected", () => {
		renderFixture({ surface: "toggle-group", type: "single" });

		expect(getItem("alpha").getAttribute("tabindex")).toBe("0");

		click("gamma");
		expect(getItem("gamma").getAttribute("tabindex")).toBe("0");
		expect(getItem("alpha").getAttribute("tabindex")).toBe("-1");
	});

	test("a toolbar group item leaves the toolbar's tab stop where it is", () => {
		renderFixture({ surface: "toolbar", type: "single" });

		expect(getItem("alpha").getAttribute("tabindex")).toBe("0");

		click("gamma");
		expect(getItem("alpha").getAttribute("tabindex")).toBe("0");
		expect(getItem("gamma").getAttribute("tabindex")).toBe("-1");
	});

	test("arrows rove between toggle-group items, and rovingFocus={false} leaves every item in the tab order", () => {
		const roving = renderFixture({ surface: "toggle-group", type: "single" });
		getItem("alpha").focus();
		press("alpha", "ArrowRight");
		expect(document.activeElement).toBe(getItem("beta"));
		unmount(roving);

		renderFixture({ surface: "toggle-group", type: "single", rovingFocus: false });
		for (const name of ["alpha", "beta", "gamma"]) expect(getItem(name).getAttribute("tabindex")).toBe("0");
		getItem("alpha").focus();
		press("alpha", "ArrowRight");
		expect(document.activeElement).toBe(getItem("alpha"));
	});

	test("a toolbar group's items rove with the toolbar's other items", () => {
		renderFixture({ surface: "toolbar", type: "single" });

		const button = document.body.querySelector<HTMLButtonElement>('[data-testid="button"]');
		getItem("gamma").focus();
		press("gamma", "ArrowRight");
		expect(document.activeElement).toBe(button);

		button!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true }));
		flushSync();
		expect(document.activeElement).toBe(getItem("gamma"));
	});
});
