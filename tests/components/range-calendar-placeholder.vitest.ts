import { parseDate } from "@internationalized/date";
import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { click, el, render, text } from "../harness.js";
import type { DateRange } from "../../src/lib/internal/date-time/types.js";
import RangeCalendarPlaceholderFixture from "./range-calendar-placeholder.fixture.svelte";

function range(start: string | undefined, end: string | undefined): DateRange {
	return {
		start: start ? parseDate(start) : undefined,
		end: end ? parseDate(end) : undefined,
	};
}

function getDay(date: string) {
	return el(`day-${date}`);
}

function clickDay(date: string) {
	click(`day-${date}`);
}

describe("RangeCalendar placeholder and value ownership", () => {
	test("assigns a deterministic default when initial placeholder is undefined", () => {
		render(RangeCalendarPlaceholderFixture, { minValue: parseDate("2030-01-15") });

		expect(text("placeholder")).toBe("2030-01-15");
		expect(text("value")).toBe("{start:undefined,end:undefined}");
	});

	test("preserves an explicit initial placeholder when no value overrides it", () => {
		render(RangeCalendarPlaceholderFixture, {
			placeholder: parseDate("2030-03-20"),
			minValue: parseDate("2030-01-15"),
		});

		expect(text("placeholder")).toBe("2030-03-20");
		expect(text("value")).toBe("{start:undefined,end:undefined}");
	});

	test("repairs the deterministic default when bound placeholder is reset to undefined", () => {
		const { component } = render(RangeCalendarPlaceholderFixture, { minValue: parseDate("2030-01-15") });

		expect(text("placeholder")).toBe("2030-01-15");

		component.setPlaceholder(parseDate("2030-04-10"));
		flushSync();
		expect(text("placeholder")).toBe("2030-04-10");

		component.setPlaceholder(undefined);
		flushSync();
		expect(text("placeholder")).toBe("2030-01-15");
	});

	test("syncs placeholder and internal start/end state from an initial complete range value", () => {
		render(RangeCalendarPlaceholderFixture, {
			placeholder: parseDate("2030-01-01"),
			value: range("2030-01-10", "2030-01-12"),
		});

		expect(text("placeholder")).toBe("2030-01-10");
		expect(text("value")).toBe("{start:2030-01-10,end:2030-01-12}");
		expect(getDay("2030-01-10").hasAttribute("data-selection-start")).toBe(true);
		expect(getDay("2030-01-12").hasAttribute("data-selection-end")).toBe(true);
		expect(getDay("2030-01-11").hasAttribute("data-range-middle")).toBe(true);
	});

	test("calendar navigation mutates placeholder without mutating selected range value", () => {
		render(RangeCalendarPlaceholderFixture, {
			placeholder: parseDate("2030-01-01"),
			value: range("2030-01-10", "2030-01-12"),
		});

		expect(text("placeholder")).toBe("2030-01-10");
		expect(text("value")).toBe("{start:2030-01-10,end:2030-01-12}");

		click("next");

		expect(text("placeholder")).toBe("2030-02-01");
		expect(text("value")).toBe("{start:2030-01-10,end:2030-01-12}");

		click("prev");

		expect(text("placeholder")).toBe("2030-01-01");
		expect(text("value")).toBe("{start:2030-01-10,end:2030-01-12}");
	});

	test("resetting value to undefined repairs to an empty range and keeps the last placeholder", () => {
		const { component } = render(RangeCalendarPlaceholderFixture, {
			placeholder: parseDate("2030-01-01"),
			value: range("2030-01-10", "2030-01-12"),
		});

		expect(text("placeholder")).toBe("2030-01-10");
		expect(text("value")).toBe("{start:2030-01-10,end:2030-01-12}");

		component.setValue(undefined);
		flushSync();

		expect(text("placeholder")).toBe("2030-01-10");
		expect(text("value")).toBe("{start:undefined,end:undefined}");
		expect(getDay("2030-01-10").hasAttribute("data-selection-start")).toBe(false);
		expect(getDay("2030-01-12").hasAttribute("data-selection-end")).toBe(false);
	});

	test("partial range selection writes only the selected start into value", () => {
		render(RangeCalendarPlaceholderFixture, { placeholder: parseDate("2030-01-01") });

		clickDay("2030-01-10");

		expect(text("placeholder")).toBe("2030-01-10");
		expect(text("value")).toBe("{start:2030-01-10,end:undefined}");
		expect(getDay("2030-01-10").hasAttribute("data-selection-start")).toBe(true);
		expect(getDay("2030-01-10").hasAttribute("data-range-end")).toBe(true);
	});

	test("range selection completes value through the day selection path", () => {
		render(RangeCalendarPlaceholderFixture, { placeholder: parseDate("2030-01-01") });

		clickDay("2030-01-10");
		clickDay("2030-01-12");

		expect(text("placeholder")).toBe("2030-01-10");
		expect(text("value")).toBe("{start:2030-01-10,end:2030-01-12}");
		expect(getDay("2030-01-10").hasAttribute("data-selection-start")).toBe(true);
		expect(getDay("2030-01-12").hasAttribute("data-selection-end")).toBe(true);
		expect(getDay("2030-01-11").hasAttribute("data-range-middle")).toBe(true);
	});
});
