import { parseDate, type DateValue } from "@internationalized/date";
import { flushSync, mount, unmount } from "svelte";
import { describe, expect, test } from "vitest";
import type { DateRange } from "../../src/lib/shared/date/types.js";
import RangeCalendarPlaceholderFixture from "./range-calendar-placeholder.fixture.svelte";

type FixtureProps = Partial<{
	placeholder: DateValue;
	value: DateRange;
	minValue: DateValue;
	maxValue: DateValue;
}>;

function range(start: string | undefined, end: string | undefined): DateRange {
	return {
		start: start ? parseDate(start) : undefined,
		end: end ? parseDate(end) : undefined,
	};
}

function renderFixture(props: FixtureProps = {}) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(RangeCalendarPlaceholderFixture, { props, target });
	flushSync();

	return { component, target };
}

function read(testId: "placeholder" | "value") {
	const node = document.body.querySelector(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} readout to render`);
	return node.textContent;
}

function getDay(date: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-testid="day-${date}"]`);
	if (!node) throw new Error(`Expected ${date} day to render`);
	return node;
}

function click(testId: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} to render`);
	node.click();
	flushSync();
}

function clickDay(date: string) {
	getDay(date).click();
	flushSync();
}

function cleanup(component: ReturnType<typeof mount>) {
	unmount(component);
	document.body.innerHTML = "";
}

describe("RangeCalendar placeholder and value ownership", () => {
	test("assigns a deterministic default when initial placeholder is undefined", () => {
		const { component } = renderFixture({ minValue: parseDate("2030-01-15") });

		try {
			expect(read("placeholder")).toBe("2030-01-15");
			expect(read("value")).toBe("{start:undefined,end:undefined}");
		} finally {
			cleanup(component);
		}
	});

	test("preserves an explicit initial placeholder when no value overrides it", () => {
		const { component } = renderFixture({
			placeholder: parseDate("2030-03-20"),
			minValue: parseDate("2030-01-15"),
		});

		try {
			expect(read("placeholder")).toBe("2030-03-20");
			expect(read("value")).toBe("{start:undefined,end:undefined}");
		} finally {
			cleanup(component);
		}
	});

	test("repairs the deterministic default when bound placeholder is reset to undefined", () => {
		const { component } = renderFixture({ minValue: parseDate("2030-01-15") });

		try {
			expect(read("placeholder")).toBe("2030-01-15");

			component.setPlaceholder(parseDate("2030-04-10"));
			flushSync();
			expect(read("placeholder")).toBe("2030-04-10");

			component.setPlaceholder(undefined);
			flushSync();
			expect(read("placeholder")).toBe("2030-01-15");
		} finally {
			cleanup(component);
		}
	});

	test("syncs placeholder and internal start/end state from an initial complete range value", () => {
		const { component } = renderFixture({
			placeholder: parseDate("2030-01-01"),
			value: range("2030-01-10", "2030-01-12"),
		});

		try {
			expect(read("placeholder")).toBe("2030-01-10");
			expect(read("value")).toBe("{start:2030-01-10,end:2030-01-12}");
			expect(getDay("2030-01-10").hasAttribute("data-selection-start")).toBe(true);
			expect(getDay("2030-01-12").hasAttribute("data-selection-end")).toBe(true);
			expect(getDay("2030-01-11").hasAttribute("data-range-middle")).toBe(true);
		} finally {
			cleanup(component);
		}
	});

	test("calendar navigation mutates placeholder without mutating selected range value", () => {
		const { component } = renderFixture({
			placeholder: parseDate("2030-01-01"),
			value: range("2030-01-10", "2030-01-12"),
		});

		try {
			expect(read("placeholder")).toBe("2030-01-10");
			expect(read("value")).toBe("{start:2030-01-10,end:2030-01-12}");

			click("next");

			expect(read("placeholder")).toBe("2030-02-01");
			expect(read("value")).toBe("{start:2030-01-10,end:2030-01-12}");

			click("prev");

			expect(read("placeholder")).toBe("2030-01-01");
			expect(read("value")).toBe("{start:2030-01-10,end:2030-01-12}");
		} finally {
			cleanup(component);
		}
	});

	test("resetting value to undefined repairs to an empty range and keeps the last placeholder", () => {
		const { component } = renderFixture({
			placeholder: parseDate("2030-01-01"),
			value: range("2030-01-10", "2030-01-12"),
		});

		try {
			expect(read("placeholder")).toBe("2030-01-10");
			expect(read("value")).toBe("{start:2030-01-10,end:2030-01-12}");

			component.setValue(undefined);
			flushSync();

			expect(read("placeholder")).toBe("2030-01-10");
			expect(read("value")).toBe("{start:undefined,end:undefined}");
			expect(getDay("2030-01-10").hasAttribute("data-selection-start")).toBe(false);
			expect(getDay("2030-01-12").hasAttribute("data-selection-end")).toBe(false);
		} finally {
			cleanup(component);
		}
	});

	test("partial range selection writes only the selected start into value", () => {
		const { component } = renderFixture({ placeholder: parseDate("2030-01-01") });

		try {
			clickDay("2030-01-10");

			expect(read("placeholder")).toBe("2030-01-10");
			expect(read("value")).toBe("{start:2030-01-10,end:undefined}");
			expect(getDay("2030-01-10").hasAttribute("data-selection-start")).toBe(true);
			expect(getDay("2030-01-10").hasAttribute("data-range-end")).toBe(true);
		} finally {
			cleanup(component);
		}
	});

	test("range selection completes value through the day selection path", () => {
		const { component } = renderFixture({ placeholder: parseDate("2030-01-01") });

		try {
			clickDay("2030-01-10");
			clickDay("2030-01-12");

			expect(read("placeholder")).toBe("2030-01-10");
			expect(read("value")).toBe("{start:2030-01-10,end:2030-01-12}");
			expect(getDay("2030-01-10").hasAttribute("data-selection-start")).toBe(true);
			expect(getDay("2030-01-12").hasAttribute("data-selection-end")).toBe(true);
			expect(getDay("2030-01-11").hasAttribute("data-range-middle")).toBe(true);
		} finally {
			cleanup(component);
		}
	});
});
