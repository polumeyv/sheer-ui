import { parseDate, type DateValue } from "@internationalized/date";
import { flushSync, mount, unmount } from "svelte";
import { describe, expect, test } from "vitest";
import type { DateRange } from "../../src/lib/shared/date/types.js";
import DateRangeFieldPlaceholderFixture from "./date-range-field-placeholder.fixture.svelte";

type FixtureProps = Partial<{
	placeholder: DateValue;
	value: DateRange;
	minValue: DateValue;
	maxValue: DateValue;
	startName: string;
	endName: string;
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

	const component = mount(DateRangeFieldPlaceholderFixture, { props, target });
	flushSync();

	return { component, target };
}

function read(testId: "placeholder" | "value") {
	const node = document.body.querySelector(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} readout to render`);
	return node.textContent;
}

function getSegment(testId: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} segment to render`);
	return node;
}

function getHiddenInput(name: string) {
	return document.body.querySelector<HTMLInputElement>(`input[aria-hidden="true"][name="${name}"]`);
}

function getForm() {
	const form = document.body.querySelector<HTMLFormElement>("form");
	if (!form) throw new Error("Expected form to render");
	return form;
}

function cleanup(component: ReturnType<typeof mount>) {
	unmount(component);
	document.body.innerHTML = "";
}

describe("DateRangeField placeholder and value ownership", () => {
	test("assigns a deterministic default when initial placeholder is undefined", () => {
		const { component } = renderFixture({ minValue: parseDate("2030-01-15") });

		try {
			expect(read("placeholder")).toBe("2030-01-15");
			expect(read("value")).toBe("{start:undefined,end:undefined}");
			expect(getHiddenInput("startDate")?.value).toBe("");
			expect(getHiddenInput("endDate")?.value).toBe("");
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

	test("syncs placeholder and start/end field state from an initial complete range value", () => {
		const { component } = renderFixture({
			placeholder: parseDate("2030-01-01"),
			value: range("2030-01-10", "2030-01-12"),
		});

		try {
			expect(read("placeholder")).toBe("2030-01-10");
			expect(read("value")).toBe("{start:2030-01-10,end:2030-01-12}");
			expect(getHiddenInput("startDate")?.value).toBe("2030-01-10");
			expect(getHiddenInput("endDate")?.value).toBe("2030-01-12");
		} finally {
			cleanup(component);
		}
	});

	test("keeps partial range value and submits only the completed side", () => {
		const { component } = renderFixture({
			placeholder: parseDate("2030-01-01"),
			value: range("2030-01-10", undefined),
		});

		try {
			expect(read("placeholder")).toBe("2030-01-10");
			expect(read("value")).toBe("{start:2030-01-10,end:undefined}");
			expect(getHiddenInput("startDate")?.value).toBe("2030-01-10");
			expect(getHiddenInput("endDate")?.value).toBe("");
			expect(new FormData(getForm()).get("startDate")).toBe("2030-01-10");
			expect(new FormData(getForm()).get("endDate")).toBe("");
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
			expect(getHiddenInput("startDate")?.value).toBe("");
			expect(getHiddenInput("endDate")?.value).toBe("");
		} finally {
			cleanup(component);
		}
	});

	test("partial segment input does not submit placeholder as form value", () => {
		const { component } = renderFixture({ placeholder: parseDate("2030-01-15") });

		try {
			getSegment("start-segment-month-0").dispatchEvent(
				new KeyboardEvent("keydown", { key: "1", bubbles: true })
			);
			flushSync();

			expect(read("placeholder")).toBe("2030-01-15");
			expect(read("value")).toBe("{start:undefined,end:undefined}");
			expect(getHiddenInput("startDate")?.value).toBe("");
			expect(getHiddenInput("endDate")?.value).toBe("");
			expect(new FormData(getForm()).get("startDate")).toBe("");
			expect(new FormData(getForm()).get("endDate")).toBe("");
		} finally {
			cleanup(component);
		}
	});

	test("complete value renders and submits both form payloads", () => {
		const { component } = renderFixture({
			value: range("2030-01-10", "2030-01-12"),
			startName: "bookingStart",
			endName: "bookingEnd",
		});

		try {
			expect(getHiddenInput("bookingStart")?.value).toBe("2030-01-10");
			expect(getHiddenInput("bookingEnd")?.value).toBe("2030-01-12");
			expect(new FormData(getForm()).get("bookingStart")).toBe("2030-01-10");
			expect(new FormData(getForm()).get("bookingEnd")).toBe("2030-01-12");
		} finally {
			cleanup(component);
		}
	});
});
