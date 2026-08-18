import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { render } from "../harness.js";
import DateFieldNameFixture from "./date-field-name.fixture.svelte";

function getDateFieldInput() {
	return document.body.querySelector<HTMLInputElement>("input[aria-hidden='true']");
}

function getForm() {
	const form = document.body.querySelector<HTMLFormElement>("form");
	if (!form) throw new Error("Expected form to render");
	return form;
}

describe("DateField name", () => {
	test("renders the initial name on the hidden input", () => {
		render(DateFieldNameFixture);

		expect(getDateFieldInput()?.name).toBe("birthday");
	});

	test("propagates dynamic name changes", () => {
		const { component } = render(DateFieldNameFixture);

		component.setName("appointment");
		flushSync();

		expect(getDateFieldInput()?.name).toBe("appointment");
	});

	test("removes the hidden input when name is empty or undefined", () => {
		const { component } = render(DateFieldNameFixture);

		component.setName("");
		flushSync();
		expect(getDateFieldInput()).toBeNull();

		component.setName("birthday");
		flushSync();
		expect(getDateFieldInput()?.name).toBe("birthday");

		component.setName(undefined);
		flushSync();
		expect(getDateFieldInput()).toBeNull();
	});

	test("uses the current name in form submission payloads", () => {
		const { component } = render(DateFieldNameFixture);

		expect(new FormData(getForm()).get("birthday")).toBe("2024-02-03");

		component.setName("appointment");
		flushSync();

		const formData = new FormData(getForm());
		expect(formData.get("birthday")).toBeNull();
		expect(formData.get("appointment")).toBe("2024-02-03");
	});
});
