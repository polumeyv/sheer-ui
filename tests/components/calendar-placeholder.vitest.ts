import { parseDate } from "@internationalized/date";
import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { click, render, text } from "../harness.js";
import CalendarPlaceholderFixture from "./calendar-placeholder.fixture.svelte";

describe("Calendar placeholder and value ownership", () => {
	test("assigns a deterministic default when initial placeholder is undefined", () => {
		render(CalendarPlaceholderFixture, { minValue: parseDate("2030-01-15") });

		expect(text("placeholder")).toBe("2030-01-15");
		expect(text("value")).toBe("undefined");
	});

	test("preserves an explicit initial placeholder when no value overrides it", () => {
		render(CalendarPlaceholderFixture, {
			placeholder: parseDate("2030-03-20"),
			minValue: parseDate("2030-01-15"),
		});

		expect(text("placeholder")).toBe("2030-03-20");
		expect(text("value")).toBe("undefined");
	});

	test("repairs the deterministic default when bound placeholder is reset to undefined", () => {
		const { component } = render(CalendarPlaceholderFixture, { minValue: parseDate("2030-01-15") });

		expect(text("placeholder")).toBe("2030-01-15");

		component.setPlaceholder(parseDate("2030-04-10"));
		flushSync();
		expect(text("placeholder")).toBe("2030-04-10");

		component.setPlaceholder(undefined);
		flushSync();
		expect(text("placeholder")).toBe("2030-01-15");
	});

	test("syncs placeholder to the selected value", () => {
		render(CalendarPlaceholderFixture, {
			placeholder: parseDate("2030-01-01"),
			value: parseDate("2030-01-10"),
		});

		expect(text("placeholder")).toBe("2030-01-10");
		expect(text("value")).toBe("2030-01-10");
	});

	test("calendar navigation mutates placeholder without mutating selected value", () => {
		render(CalendarPlaceholderFixture, {
			placeholder: parseDate("2030-01-01"),
			value: parseDate("2030-01-10"),
		});

		expect(text("placeholder")).toBe("2030-01-10");
		expect(text("value")).toBe("2030-01-10");

		click("next");

		expect(text("placeholder")).toBe("2030-02-01");
		expect(text("value")).toBe("2030-01-10");

		click("prev");

		expect(text("placeholder")).toBe("2030-01-01");
		expect(text("value")).toBe("2030-01-10");
	});

	test("single-value reset leaves placeholder at the last selected value", () => {
		const { component } = render(CalendarPlaceholderFixture, {
			placeholder: parseDate("2030-01-01"),
			value: parseDate("2030-01-10"),
		});

		expect(text("placeholder")).toBe("2030-01-10");
		expect(text("value")).toBe("2030-01-10");

		component.setValue(undefined);
		flushSync();

		expect(text("placeholder")).toBe("2030-01-10");
		expect(text("value")).toBe("undefined");
	});

	test("multiple-value reset repairs value to an empty array and keeps placeholder at the last selected value", () => {
		const { component } = render(CalendarPlaceholderFixture, {
			type: "multiple",
			placeholder: parseDate("2030-01-01"),
			value: [parseDate("2030-01-10"), parseDate("2030-01-12")],
		});

		expect(text("placeholder")).toBe("2030-01-12");
		expect(text("value")).toBe("[2030-01-10,2030-01-12]");

		component.setValue(undefined);
		flushSync();

		expect(text("placeholder")).toBe("2030-01-12");
		expect(text("value")).toBe("[]");
	});
});
