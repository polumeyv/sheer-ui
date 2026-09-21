import { parseDate } from "@internationalized/date";
import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { mountInBody } from "../mount";
import DateFieldPlaceholderFixture from "./date-field-placeholder.fixture.svelte";

type FixtureProps = Partial<{
	placeholder: ReturnType<typeof parseDate>;
	value: ReturnType<typeof parseDate>;
	minValue: ReturnType<typeof parseDate>;
	maxValue: ReturnType<typeof parseDate>;
	name: string;
}>;

function renderFixture(props: FixtureProps = {}) {
	return mountInBody(DateFieldPlaceholderFixture, props);
}

function read(testId: "placeholder" | "value") {
	const node = document.body.querySelector(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} readout to render`);
	return node.textContent;
}

function getSegment(part: "month" | "day" | "year") {
	const node = document.body.querySelector<HTMLElement>(`[data-testid="segment-${part}"]`);
	if (!node) throw new Error(`Expected ${part} segment to render`);
	return node;
}

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
		renderFixture({ minValue: parseDate("2030-01-15") });

		expect(read("placeholder")).toBe("2030-01-15");
		expect(read("value")).toBe("undefined");
	});

	test("preserves an explicit initial placeholder when no value overrides it", () => {
		renderFixture({
			placeholder: parseDate("2030-03-20"),
			minValue: parseDate("2030-01-15"),
		});

		expect(read("placeholder")).toBe("2030-03-20");
		expect(read("value")).toBe("undefined");
	});

	test("repairs the deterministic default when bound placeholder is reset to undefined", () => {
		const { component } = renderFixture({ minValue: parseDate("2030-01-15") });

		expect(read("placeholder")).toBe("2030-01-15");

		component.setPlaceholder(parseDate("2030-04-10"));
		flushSync();
		expect(read("placeholder")).toBe("2030-04-10");

		component.setPlaceholder(undefined);
		flushSync();
		expect(read("placeholder")).toBe("2030-01-15");
	});

	test("syncs placeholder to the selected value", () => {
		renderFixture({
			placeholder: parseDate("2030-01-01"),
			value: parseDate("2030-01-10"),
		});

		expect(read("placeholder")).toBe("2030-01-10");
		expect(read("value")).toBe("2030-01-10");
	});

	test("segment interaction updates value without treating placeholder as submitted form data", () => {
		renderFixture({
			placeholder: parseDate("2030-01-15"),
			name: "birthday",
		});

		const month = getSegment("month");
		month.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true }));
		flushSync();

		expect(read("placeholder")).toBe("2030-01-15");
		expect(read("value")).toBe("undefined");
		expect(getHiddenInput()?.value).toBe("");
		expect(new FormData(getForm()).get("birthday")).toBe("");
	});
});
