import { parseDate } from "@internationalized/date";
import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { el, render, text } from "../harness.js";
import DateFieldPlaceholderFixture from "./date-field-placeholder.fixture.svelte";

function getHiddenInput() {
	return document.body.querySelector<HTMLInputElement>("input[aria-hidden='true']");
}

function getForm() {
	const form = document.body.querySelector<HTMLFormElement>("form");
	if (!form) throw new Error("Expected form to render");
	return form;
}

describe("DateField placeholder", () => {
	test("assigns a deterministic default when initial placeholder is undefined", () => {
		render(DateFieldPlaceholderFixture, { minValue: parseDate("2030-01-15") });

		expect(text("placeholder")).toBe("2030-01-15");
		expect(text("value")).toBe("undefined");
	});

	test("preserves an explicit initial placeholder when no value overrides it", () => {
		render(DateFieldPlaceholderFixture, {
			placeholder: parseDate("2030-03-20"),
			minValue: parseDate("2030-01-15"),
		});

		expect(text("placeholder")).toBe("2030-03-20");
		expect(text("value")).toBe("undefined");
	});

	test("repairs the deterministic default when bound placeholder is reset to undefined", () => {
		const { component } = render(DateFieldPlaceholderFixture, { minValue: parseDate("2030-01-15") });

		expect(text("placeholder")).toBe("2030-01-15");

		component.setPlaceholder(parseDate("2030-04-10"));
		flushSync();
		expect(text("placeholder")).toBe("2030-04-10");

		component.setPlaceholder(undefined);
		flushSync();
		expect(text("placeholder")).toBe("2030-01-15");
	});

	test("syncs placeholder to the selected value", () => {
		render(DateFieldPlaceholderFixture, {
			placeholder: parseDate("2030-01-01"),
			value: parseDate("2030-01-10"),
		});

		expect(text("placeholder")).toBe("2030-01-10");
		expect(text("value")).toBe("2030-01-10");
	});

	test("segment interaction updates value without treating placeholder as submitted form data", () => {
		render(DateFieldPlaceholderFixture, {
			placeholder: parseDate("2030-01-15"),
			name: "birthday",
		});

		const month = el("segment-month");
		month.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true }));
		flushSync();

		expect(text("placeholder")).toBe("2030-01-15");
		expect(text("value")).toBe("undefined");
		expect(getHiddenInput()?.value).toBe("");
		expect(new FormData(getForm()).get("birthday")).toBe("");
	});
});
