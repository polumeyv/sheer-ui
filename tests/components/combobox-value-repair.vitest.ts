import { flushSync, mount, unmount } from "svelte";
import { describe, expect, test } from "vitest";
import ComboboxValueRepairFixture from "./combobox-value-repair.fixture.svelte";

type FixtureProps = Partial<{
	value: string | string[];
	type: "single" | "multiple";
	name: string;
}>;

function renderFixture(props: FixtureProps) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(ComboboxValueRepairFixture, { props, target });
	flushSync();

	return { component, target };
}

function readValue() {
	const node = document.body.querySelector('[data-testid="value"]');
	if (!node) throw new Error("Expected value readout to render");
	return node.textContent;
}

function getHiddenInputs(name: string) {
	return Array.from(document.body.querySelectorAll<HTMLInputElement>(`input[aria-hidden="true"][name="${name}"]`));
}

function getForm() {
	const form = document.body.querySelector<HTMLFormElement>("form");
	if (!form) throw new Error("Expected form to render");
	return form;
}

function selectItem(testId: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} to render`);
	node.dispatchEvent(new Event("pointerup", { bubbles: true, cancelable: true }));
	flushSync();
}

function cleanup(component: ReturnType<typeof mount>) {
	unmount(component);
	document.body.innerHTML = "";
}

describe("Combobox controlled value repair", () => {
	test("single mode repairs undefined, preserves explicit values, and repairs reset values", () => {
		const { component } = renderFixture({ type: "single", name: "fruit" });

		try {
			expect(readValue()).toBe("");
			expect(getHiddenInputs("fruit").map((input) => input.value)).toEqual([""]);
			expect(new FormData(getForm()).get("fruit")).toBe("");

			component.setValue("alpha");
			flushSync();
			expect(readValue()).toBe("alpha");
			expect(getHiddenInputs("fruit").map((input) => input.value)).toEqual(["alpha"]);

			component.setValue(undefined);
			flushSync();
			expect(readValue()).toBe("");
			expect(getHiddenInputs("fruit").map((input) => input.value)).toEqual([""]);
		} finally {
			cleanup(component);
		}
	});

	test("single mode preserves an explicit initial value and user selection updates value and form data", () => {
		const { component } = renderFixture({
			type: "single",
			name: "fruit",
			value: "alpha",
		});

		try {
			expect(readValue()).toBe("alpha");
			expect(new FormData(getForm()).get("fruit")).toBe("alpha");

			selectItem("item-beta");
			expect(readValue()).toBe("beta");
			expect(getHiddenInputs("fruit").map((input) => input.value)).toEqual(["beta"]);
			expect(new FormData(getForm()).get("fruit")).toBe("beta");
		} finally {
			cleanup(component);
		}
	});

	test("multiple mode repairs undefined, preserves explicit values, and repairs reset values", () => {
		const { component } = renderFixture({ type: "multiple", name: "fruit" });

		try {
			expect(readValue()).toBe("[]");
			expect(getHiddenInputs("fruit")).toEqual([]);
			expect(new FormData(getForm()).getAll("fruit")).toEqual([]);

			component.setValue(["alpha"]);
			flushSync();
			expect(readValue()).toBe("[alpha]");
			expect(getHiddenInputs("fruit").map((input) => input.value)).toEqual(["alpha"]);

			component.setValue(undefined);
			flushSync();
			expect(readValue()).toBe("[]");
			expect(getHiddenInputs("fruit")).toEqual([]);
		} finally {
			cleanup(component);
		}
	});

	test("multiple mode preserves explicit initial values and user selection updates value and form data", () => {
		const { component } = renderFixture({
			type: "multiple",
			name: "fruit",
			value: ["alpha"],
		});

		try {
			expect(readValue()).toBe("[alpha]");
			expect(new FormData(getForm()).getAll("fruit")).toEqual(["alpha"]);

			selectItem("item-beta");
			expect(readValue()).toBe("[alpha,beta]");
			expect(getHiddenInputs("fruit").map((input) => input.value)).toEqual(["alpha", "beta"]);
			expect(new FormData(getForm()).getAll("fruit")).toEqual(["alpha", "beta"]);
		} finally {
			cleanup(component);
		}
	});
});
