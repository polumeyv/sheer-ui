import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { el, render, text } from "../harness.js";
import ComboboxValueRepairFixture from "./combobox-value-repair.fixture.svelte";

function getHiddenInputs(name: string) {
	return Array.from(document.body.querySelectorAll<HTMLInputElement>(`input[aria-hidden="true"][name="${name}"]`));
}

function getForm() {
	const form = document.body.querySelector<HTMLFormElement>("form");
	if (!form) throw new Error("Expected form to render");
	return form;
}

function selectItem(testId: string) {
	el(testId).dispatchEvent(new Event("pointerup", { bubbles: true, cancelable: true }));
	flushSync();
}

describe("Combobox controlled value repair", () => {
	test("single mode repairs undefined, preserves explicit values, and repairs reset values", () => {
		const { component } = render(ComboboxValueRepairFixture, { type: "single", name: "fruit" });

		expect(text("value")).toBe("");
		expect(getHiddenInputs("fruit").map((input) => input.value)).toEqual([""]);
		expect(new FormData(getForm()).get("fruit")).toBe("");

		component.setValue("alpha");
		flushSync();
		expect(text("value")).toBe("alpha");
		expect(getHiddenInputs("fruit").map((input) => input.value)).toEqual(["alpha"]);

		component.setValue(undefined);
		flushSync();
		expect(text("value")).toBe("");
		expect(getHiddenInputs("fruit").map((input) => input.value)).toEqual([""]);
	});

	test("single mode preserves an explicit initial value and user selection updates value and form data", () => {
		render(ComboboxValueRepairFixture, {
			type: "single",
			name: "fruit",
			value: "alpha",
		});

		expect(text("value")).toBe("alpha");
		expect(new FormData(getForm()).get("fruit")).toBe("alpha");

		selectItem("item-beta");
		expect(text("value")).toBe("beta");
		expect(getHiddenInputs("fruit").map((input) => input.value)).toEqual(["beta"]);
		expect(new FormData(getForm()).get("fruit")).toBe("beta");
	});

	test("multiple mode repairs undefined, preserves explicit values, and repairs reset values", () => {
		const { component } = render(ComboboxValueRepairFixture, { type: "multiple", name: "fruit" });

		expect(text("value")).toBe("[]");
		expect(getHiddenInputs("fruit")).toEqual([]);
		expect(new FormData(getForm()).getAll("fruit")).toEqual([]);

		component.setValue(["alpha"]);
		flushSync();
		expect(text("value")).toBe("[alpha]");
		expect(getHiddenInputs("fruit").map((input) => input.value)).toEqual(["alpha"]);

		component.setValue(undefined);
		flushSync();
		expect(text("value")).toBe("[]");
		expect(getHiddenInputs("fruit")).toEqual([]);
	});

	test("multiple mode preserves explicit initial values and user selection updates value and form data", () => {
		render(ComboboxValueRepairFixture, {
			type: "multiple",
			name: "fruit",
			value: ["alpha"],
		});

		expect(text("value")).toBe("[alpha]");
		expect(new FormData(getForm()).getAll("fruit")).toEqual(["alpha"]);

		selectItem("item-beta");
		expect(text("value")).toBe("[alpha,beta]");
		expect(getHiddenInputs("fruit").map((input) => input.value)).toEqual(["alpha", "beta"]);
		expect(new FormData(getForm()).getAll("fruit")).toEqual(["alpha", "beta"]);
	});
});
