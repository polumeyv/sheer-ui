import { parseDate, type DateValue } from "@internationalized/date";
import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { mountInBody } from "../mount";
import CalendarPlaceholderFixture from "./calendar-placeholder.fixture.svelte";

type CalendarValue = DateValue | DateValue[] | undefined;

type FixtureProps = Partial<{
	placeholder: DateValue;
	value: CalendarValue;
	minValue: DateValue;
	maxValue: DateValue;
	type: "single" | "multiple";
}>;

function renderFixture(props: FixtureProps = {}) {
	return mountInBody(CalendarPlaceholderFixture, props);
}

function read(testId: "placeholder" | "value") {
	const node = document.body.querySelector(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} readout to render`);
	return node.textContent;
}

function click(testId: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} to render`);
	node.click();
	flushSync();
}

describe("Calendar placeholder and value ownership", () => {
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

	test("calendar navigation mutates placeholder without mutating selected value", () => {
		renderFixture({
			placeholder: parseDate("2030-01-01"),
			value: parseDate("2030-01-10"),
		});

		expect(read("placeholder")).toBe("2030-01-10");
		expect(read("value")).toBe("2030-01-10");

		click("next");

		expect(read("placeholder")).toBe("2030-02-01");
		expect(read("value")).toBe("2030-01-10");

		click("prev");

		expect(read("placeholder")).toBe("2030-01-01");
		expect(read("value")).toBe("2030-01-10");
	});

	test("single-value reset leaves placeholder at the last selected value", () => {
		const { component } = renderFixture({
			placeholder: parseDate("2030-01-01"),
			value: parseDate("2030-01-10"),
		});

		expect(read("placeholder")).toBe("2030-01-10");
		expect(read("value")).toBe("2030-01-10");

		component.setValue(undefined);
		flushSync();

		expect(read("placeholder")).toBe("2030-01-10");
		expect(read("value")).toBe("undefined");
	});

	test("multiple-value reset repairs value to an empty array and keeps placeholder at the last selected value", () => {
		const { component } = renderFixture({
			type: "multiple",
			placeholder: parseDate("2030-01-01"),
			value: [parseDate("2030-01-10"), parseDate("2030-01-12")],
		});

		expect(read("placeholder")).toBe("2030-01-12");
		expect(read("value")).toBe("[2030-01-10,2030-01-12]");

		component.setValue(undefined);
		flushSync();

		expect(read("placeholder")).toBe("2030-01-12");
		expect(read("value")).toBe("[]");
	});
});
