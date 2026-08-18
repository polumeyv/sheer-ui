import { flushSync, mount, unmount } from "svelte";
import { describe, expect, test } from "vitest";
import SelectionGroupFixture from "./selection-group.fixture.svelte";

type Surface = "toggle-group" | "toolbar";
type SelectionType = "single" | "multiple";

function renderFixture(props: { surface: Surface; type: SelectionType; disabled?: boolean }) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(SelectionGroupFixture, { props, target });
	flushSync();

	return component;
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

function cleanup(component: ReturnType<typeof mount>) {
	unmount(component);
	document.body.innerHTML = "";
}

const surfaces: Surface[] = ["toggle-group", "toolbar"];

for (const surface of surfaces) {
	describe(`${surface} selection`, () => {
		test("single mode selects one item, deselects on a second click, and marks it as a radio", () => {
			const component = renderFixture({ surface, type: "single" });

			try {
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
			} finally {
				cleanup(component);
			}
		});

		test("multiple mode accumulates items and marks them as pressed", () => {
			const component = renderFixture({ surface, type: "multiple" });

			try {
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
			} finally {
				cleanup(component);
			}
		});

		test("Enter and Space toggle the item they land on", () => {
			const component = renderFixture({ surface, type: "multiple" });

			try {
				press("alpha", "Enter");
				expect(readValue()).toBe("[alpha]");

				press("beta", " ");
				expect(readValue()).toBe("[alpha,beta]");

				press("alpha", "Enter");
				expect(readValue()).toBe("[beta]");
			} finally {
				cleanup(component);
			}
		});

		test("a disabled group disables its items and ignores their clicks", () => {
			const component = renderFixture({ surface, type: "multiple", disabled: true });

			try {
				expect(getItem("alpha").getAttribute("data-disabled")).toBe("");
				expect(getItem("alpha").disabled).toBe(true);

				click("alpha");
				press("beta", "Enter");
				expect(readValue()).toBe("[]");
			} finally {
				cleanup(component);
			}
		});

		test("a value reset to undefined repairs back to the empty selection", () => {
			const component = renderFixture({ surface, type: "multiple" });

			try {
				click("alpha");
				expect(readValue()).toBe("[alpha]");

				component.setValue(undefined);
				flushSync();
				expect(readValue()).toBe("[]");

				click("beta");
				expect(readValue()).toBe("[beta]");
			} finally {
				cleanup(component);
			}
		});
	});
}

describe("selection and the roving tab stop", () => {
	test("a toggle-group item takes the tab stop when it is selected", () => {
		const component = renderFixture({ surface: "toggle-group", type: "single" });

		try {
			expect(getItem("alpha").getAttribute("tabindex")).toBe("0");

			click("gamma");
			expect(getItem("gamma").getAttribute("tabindex")).toBe("0");
			expect(getItem("alpha").getAttribute("tabindex")).toBe("-1");
		} finally {
			cleanup(component);
		}
	});

	test("a toolbar group item leaves the toolbar's tab stop where it is", () => {
		const component = renderFixture({ surface: "toolbar", type: "single" });

		try {
			expect(getItem("alpha").getAttribute("tabindex")).toBe("0");

			click("gamma");
			expect(getItem("alpha").getAttribute("tabindex")).toBe("0");
			expect(getItem("gamma").getAttribute("tabindex")).toBe("-1");
		} finally {
			cleanup(component);
		}
	});
});
