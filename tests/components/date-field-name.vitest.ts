import { flushSync, mount, unmount } from "svelte";
import { describe, expect, test } from "vitest";
import DateFieldNameFixture from "./date-field-name.fixture.svelte";

function renderFixture() {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(DateFieldNameFixture, { target });
	flushSync();

	return { component, target };
}

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
		const { component } = renderFixture();

		try {
			expect(getDateFieldInput()?.name).toBe("birthday");
		} finally {
			unmount(component);
			document.body.innerHTML = "";
		}
	});

	test("propagates dynamic name changes", () => {
		const { component } = renderFixture();

		try {
			component.setName("appointment");
			flushSync();

			expect(getDateFieldInput()?.name).toBe("appointment");
		} finally {
			unmount(component);
			document.body.innerHTML = "";
		}
	});

	test("removes the hidden input when name is empty or undefined", () => {
		const { component } = renderFixture();

		try {
			component.setName("");
			flushSync();
			expect(getDateFieldInput()).toBeNull();

			component.setName("birthday");
			flushSync();
			expect(getDateFieldInput()?.name).toBe("birthday");

			component.setName(undefined);
			flushSync();
			expect(getDateFieldInput()).toBeNull();
		} finally {
			unmount(component);
			document.body.innerHTML = "";
		}
	});

	test("uses the current name in form submission payloads", () => {
		const { component } = renderFixture();

		try {
			expect(new FormData(getForm()).get("birthday")).toBe("2024-02-03");

			component.setName("appointment");
			flushSync();

			const formData = new FormData(getForm());
			expect(formData.get("birthday")).toBeNull();
			expect(formData.get("appointment")).toBe("2024-02-03");
		} finally {
			unmount(component);
			document.body.innerHTML = "";
		}
	});
});
