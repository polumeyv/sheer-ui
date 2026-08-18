import { Time } from "@internationalized/date";
import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { render, text } from "../harness.js";
import type { TimeEndpoints } from "../../src/lib/internal/date-time/types.js";
import TimeRangeFieldPlaceholderFixture from "./time-range-field-placeholder.fixture.svelte";

function time(hour: number, minute = 0, second = 0) {
	return new Time(hour, minute, second);
}

function range(start: Time | undefined, end: Time | undefined): TimeEndpoints<Time> {
	return { start, end };
}

function getSegment(side: "start" | "end", part: "hour" | "minute" | "second") {
	const node = document.body.querySelector<HTMLElement>(
		`[data-side="${side}"][data-part="${part}"]`
	);
	if (!node) throw new Error(`Expected ${side} ${part} segment to render`);
	return node;
}

function hasSegment(side: "start" | "end", part: "hour" | "minute" | "second") {
	return document.body.querySelector(`[data-side="${side}"][data-part="${part}"]`) !== null;
}

function getHiddenInput(name: string) {
	return document.body.querySelector<HTMLInputElement>(`input[aria-hidden="true"][name="${name}"]`);
}

function getForm() {
	const form = document.body.querySelector<HTMLFormElement>("form");
	if (!form) throw new Error("Expected form to render");
	return form;
}

describe("TimeRangeField placeholder and value ownership", () => {
	test("assigns a deterministic default when initial placeholder is undefined", () => {
		render(TimeRangeFieldPlaceholderFixture);

		expect(text("placeholder")).toBe("00:00:00");
		expect(text("value")).toBe("{start:undefined,end:undefined}");
		expect(getHiddenInput("startTime")?.value).toBe("");
		expect(getHiddenInput("endTime")?.value).toBe("");
	});

	test("preserves an explicit initial placeholder when no value overrides it", () => {
		render(TimeRangeFieldPlaceholderFixture, {
			placeholder: time(13, 45, 30),
		});

		expect(text("placeholder")).toBe("13:45:30");
		expect(text("value")).toBe("{start:undefined,end:undefined}");
	});

	test("repairs the deterministic default when bound placeholder is reset to undefined", () => {
		const { component } = render(TimeRangeFieldPlaceholderFixture);

		expect(text("placeholder")).toBe("00:00:00");

		component.setPlaceholder(time(8, 5, 6));
		flushSync();
		expect(text("placeholder")).toBe("08:05:06");

		component.setPlaceholder(undefined);
		flushSync();
		expect(text("placeholder")).toBe("00:00:00");
	});

	test("syncs placeholder and start/end field state from an initial complete range value", () => {
		render(TimeRangeFieldPlaceholderFixture, {
			placeholder: time(1, 2, 3),
			value: range(time(9, 15, 30), time(17, 45, 0)),
		});

		expect(text("placeholder")).toBe("09:15:30");
		expect(text("value")).toBe("{start:09:15:30,end:17:45:00}");
		expect(getHiddenInput("startTime")?.value).toBe("09:15:30");
		expect(getHiddenInput("endTime")?.value).toBe("17:45:00");
	});

	test("keeps partial range value and submits only the completed side", () => {
		render(TimeRangeFieldPlaceholderFixture, {
			placeholder: time(1, 2, 3),
			value: range(time(9, 15, 30), undefined),
		});

		expect(text("placeholder")).toBe("09:15:30");
		expect(text("value")).toBe("{start:09:15:30,end:undefined}");
		expect(getHiddenInput("startTime")?.value).toBe("09:15:30");
		expect(getHiddenInput("endTime")?.value).toBe("");
		expect(new FormData(getForm()).get("startTime")).toBe("09:15:30");
		expect(new FormData(getForm()).get("endTime")).toBe("");
	});

	test("resetting value to undefined repairs to an empty range and keeps the last placeholder", () => {
		const { component } = render(TimeRangeFieldPlaceholderFixture, {
			placeholder: time(1, 2, 3),
			value: range(time(9, 15, 30), time(17, 45, 0)),
		});

		expect(text("placeholder")).toBe("09:15:30");
		expect(text("value")).toBe("{start:09:15:30,end:17:45:00}");

		component.setValue(undefined);
		flushSync();

		expect(text("placeholder")).toBe("09:15:30");
		expect(text("value")).toBe("{start:undefined,end:undefined}");
		expect(getHiddenInput("startTime")?.value).toBe("");
		expect(getHiddenInput("endTime")?.value).toBe("");
	});

	test("partial segment input does not submit placeholder as form value", () => {
		render(TimeRangeFieldPlaceholderFixture, {
			placeholder: time(9, 15, 30),
			granularity: "second",
			hourCycle: 24,
		});

		getSegment("start", "hour").dispatchEvent(
			new KeyboardEvent("keydown", { key: "1", bubbles: true })
		);
		flushSync();

		expect(text("placeholder")).toBe("09:15:30");
		expect(text("value")).toBe("{start:undefined,end:undefined}");
		expect(getHiddenInput("startTime")?.value).toBe("");
		expect(getHiddenInput("endTime")?.value).toBe("");
		expect(new FormData(getForm()).get("startTime")).toBe("");
		expect(new FormData(getForm()).get("endTime")).toBe("");
	});

	test("complete value renders and submits both form payloads", () => {
		render(TimeRangeFieldPlaceholderFixture, {
			value: range(time(9, 15, 30), time(17, 45, 0)),
			startName: "bookingStart",
			endName: "bookingEnd",
		});

		expect(getHiddenInput("bookingStart")?.value).toBe("09:15:30");
		expect(getHiddenInput("bookingEnd")?.value).toBe("17:45:00");
		expect(new FormData(getForm()).get("bookingStart")).toBe("09:15:30");
		expect(new FormData(getForm()).get("bookingEnd")).toBe("17:45:00");
	});

	test("respects hour, minute, and second granularity for both range inputs", () => {
		const hour = render(TimeRangeFieldPlaceholderFixture, {
			placeholder: time(9, 15, 30),
			granularity: "hour",
			hourCycle: 24,
		});

		expect(hasSegment("start", "hour")).toBe(true);
		expect(hasSegment("start", "minute")).toBe(false);
		expect(hasSegment("start", "second")).toBe(false);
		expect(hasSegment("end", "hour")).toBe(true);
		expect(hasSegment("end", "minute")).toBe(false);
		expect(hasSegment("end", "second")).toBe(false);
		hour.unmount();

		const minute = render(TimeRangeFieldPlaceholderFixture, {
			placeholder: time(9, 15, 30),
			granularity: "minute",
			hourCycle: 24,
		});

		expect(hasSegment("start", "hour")).toBe(true);
		expect(hasSegment("start", "minute")).toBe(true);
		expect(hasSegment("start", "second")).toBe(false);
		expect(hasSegment("end", "hour")).toBe(true);
		expect(hasSegment("end", "minute")).toBe(true);
		expect(hasSegment("end", "second")).toBe(false);
		minute.unmount();

		render(TimeRangeFieldPlaceholderFixture, {
			placeholder: time(9, 15, 30),
			granularity: "second",
			hourCycle: 24,
		});

		expect(hasSegment("start", "hour")).toBe(true);
		expect(hasSegment("start", "minute")).toBe(true);
		expect(hasSegment("start", "second")).toBe(true);
		expect(hasSegment("end", "hour")).toBe(true);
		expect(hasSegment("end", "minute")).toBe(true);
		expect(hasSegment("end", "second")).toBe(true);
	});
});
