import { parseDate, type DateValue } from "@internationalized/date";
import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import type { DateRange } from "../../src/lib/shared/date/types.js";
import { mountInBody } from "../mount";
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
	return mountInBody(DateRangeFieldPlaceholderFixture, props);
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

describe("DateRangeField placeholder and value ownership", () => {
	test("assigns a deterministic default when initial placeholder is undefined", () => {
		renderFixture({ minValue: parseDate("2030-01-15") });

		expect(read("placeholder")).toBe("2030-01-15");
		expect(read("value")).toBe("{start:undefined,end:undefined}");
		expect(getHiddenInput("startDate")?.value).toBe("");
		expect(getHiddenInput("endDate")?.value).toBe("");
	});

	test("preserves an explicit initial placeholder when no value overrides it", () => {
		renderFixture({
			placeholder: parseDate("2030-03-20"),
			minValue: parseDate("2030-01-15"),
		});

		expect(read("placeholder")).toBe("2030-03-20");
		expect(read("value")).toBe("{start:undefined,end:undefined}");
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

	test("syncs placeholder and start/end field state from an initial complete range value", () => {
		renderFixture({
			placeholder: parseDate("2030-01-01"),
			value: range("2030-01-10", "2030-01-12"),
		});

		expect(read("placeholder")).toBe("2030-01-10");
		expect(read("value")).toBe("{start:2030-01-10,end:2030-01-12}");
		expect(getHiddenInput("startDate")?.value).toBe("2030-01-10");
		expect(getHiddenInput("endDate")?.value).toBe("2030-01-12");
	});

	test("keeps partial range value and submits only the completed side", () => {
		renderFixture({
			placeholder: parseDate("2030-01-01"),
			value: range("2030-01-10", undefined),
		});

		expect(read("placeholder")).toBe("2030-01-10");
		expect(read("value")).toBe("{start:2030-01-10,end:undefined}");
		expect(getHiddenInput("startDate")?.value).toBe("2030-01-10");
		expect(getHiddenInput("endDate")?.value).toBe("");
		expect(new FormData(getForm()).get("startDate")).toBe("2030-01-10");
		expect(new FormData(getForm()).get("endDate")).toBe("");
	});

	test("resetting value to undefined repairs to an empty range and keeps the last placeholder", () => {
		const { component } = renderFixture({
			placeholder: parseDate("2030-01-01"),
			value: range("2030-01-10", "2030-01-12"),
		});

		expect(read("placeholder")).toBe("2030-01-10");
		expect(read("value")).toBe("{start:2030-01-10,end:2030-01-12}");

		component.setValue(undefined);
		flushSync();

		expect(read("placeholder")).toBe("2030-01-10");
		expect(read("value")).toBe("{start:undefined,end:undefined}");
		expect(getHiddenInput("startDate")?.value).toBe("");
		expect(getHiddenInput("endDate")?.value).toBe("");
	});

	test("partial segment input does not submit placeholder as form value", () => {
		renderFixture({ placeholder: parseDate("2030-01-15") });

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
	});

	test("complete value renders and submits both form payloads", () => {
		renderFixture({
			value: range("2030-01-10", "2030-01-12"),
			startName: "bookingStart",
			endName: "bookingEnd",
		});

		expect(getHiddenInput("bookingStart")?.value).toBe("2030-01-10");
		expect(getHiddenInput("bookingEnd")?.value).toBe("2030-01-12");
		expect(new FormData(getForm()).get("bookingStart")).toBe("2030-01-10");
		expect(new FormData(getForm()).get("bookingEnd")).toBe("2030-01-12");
	});
});
