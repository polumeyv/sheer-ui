import { Time } from "@internationalized/date";
import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { render, text } from "../harness.js";
import TimeFieldPlaceholderFixture from "./time-field-placeholder.fixture.svelte";

function getSegment(part: "hour" | "minute" | "second") {
	const node = document.body.querySelector<HTMLElement>(`[data-part="${part}"]`);
	if (!node) throw new Error(`Expected ${part} segment to render`);
	return node;
}

function hasSegment(part: "hour" | "minute" | "second") {
	return document.body.querySelector(`[data-part="${part}"]`) !== null;
}

function getHiddenInput() {
	return document.body.querySelector<HTMLInputElement>("input[aria-hidden='true']");
}

function getForm() {
	const form = document.body.querySelector<HTMLFormElement>("form");
	if (!form) throw new Error("Expected form to render");
	return form;
}

describe("TimeField placeholder", () => {
	test("assigns a deterministic default when initial placeholder is undefined", () => {
		render(TimeFieldPlaceholderFixture);

		expect(text("placeholder")).toBe("00:00:00");
		expect(text("value")).toBe("undefined");
	});

	test("preserves an explicit initial placeholder", () => {
		render(TimeFieldPlaceholderFixture, {
			placeholder: new Time(13, 45, 30),
		});

		expect(text("placeholder")).toBe("13:45:30");
		expect(text("value")).toBe("undefined");
	});

	test("repairs the deterministic default when bound placeholder is reset to undefined", () => {
		const { component } = render(TimeFieldPlaceholderFixture);

		expect(text("placeholder")).toBe("00:00:00");

		component.setPlaceholder(new Time(8, 5, 6));
		flushSync();
		expect(text("placeholder")).toBe("08:05:06");

		component.setPlaceholder(undefined);
		flushSync();
		expect(text("placeholder")).toBe("00:00:00");
	});

	test("syncs placeholder to the selected value", () => {
		render(TimeFieldPlaceholderFixture, {
			placeholder: new Time(1, 2, 3),
			value: new Time(13, 45, 30),
		});

		expect(text("placeholder")).toBe("13:45:30");
		expect(text("value")).toBe("13:45:30");
	});

	test("partial segment interaction does not submit placeholder as form data", () => {
		render(TimeFieldPlaceholderFixture, {
			placeholder: new Time(9, 15, 30),
			granularity: "second",
			hourCycle: 24,
			name: "appointmentTime",
		});

		const hour = getSegment("hour");
		hour.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true }));
		flushSync();

		expect(text("placeholder")).toBe("09:15:30");
		expect(text("value")).toBe("undefined");
		expect(getHiddenInput()?.value).toBe("");
		expect(new FormData(getForm()).get("appointmentTime")).toBe("");
	});

	test("respects hour, minute, and second granularity", () => {
		const hour = render(TimeFieldPlaceholderFixture, {
			placeholder: new Time(9, 15, 30),
			granularity: "hour",
			hourCycle: 24,
		});

		expect(hasSegment("hour")).toBe(true);
		expect(hasSegment("minute")).toBe(false);
		expect(hasSegment("second")).toBe(false);
		hour.unmount();

		const minute = render(TimeFieldPlaceholderFixture, {
			placeholder: new Time(9, 15, 30),
			granularity: "minute",
			hourCycle: 24,
		});

		expect(hasSegment("hour")).toBe(true);
		expect(hasSegment("minute")).toBe(true);
		expect(hasSegment("second")).toBe(false);
		minute.unmount();

		render(TimeFieldPlaceholderFixture, {
			placeholder: new Time(9, 15, 30),
			granularity: "second",
			hourCycle: 24,
		});

		expect(hasSegment("hour")).toBe(true);
		expect(hasSegment("minute")).toBe(true);
		expect(hasSegment("second")).toBe(true);
	});
});
