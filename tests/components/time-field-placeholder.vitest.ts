import { Time } from "@internationalized/date";
import { flushSync, mount, unmount } from "svelte";
import { describe, expect, test } from "vitest";
import TimeFieldPlaceholderFixture from "./time-field-placeholder.fixture.svelte";

type FixtureProps = Partial<{
	placeholder: Time;
	value: Time;
	granularity: "hour" | "minute" | "second";
	hourCycle: 12 | 24;
	name: string;
}>;

function renderFixture(props: FixtureProps = {}) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(TimeFieldPlaceholderFixture, { props, target });
	flushSync();

	return { component, target };
}

function read(testId: "placeholder" | "value") {
	const node = document.body.querySelector(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} readout to render`);
	return node.textContent;
}

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

function cleanup(component: ReturnType<typeof mount>) {
	unmount(component);
	document.body.innerHTML = "";
}

describe("TimeField placeholder", () => {
	test("assigns a deterministic default when initial placeholder is undefined", () => {
		const { component } = renderFixture();

		try {
			expect(read("placeholder")).toBe("00:00:00");
			expect(read("value")).toBe("undefined");
		} finally {
			cleanup(component);
		}
	});

	test("preserves an explicit initial placeholder", () => {
		const { component } = renderFixture({
			placeholder: new Time(13, 45, 30),
		});

		try {
			expect(read("placeholder")).toBe("13:45:30");
			expect(read("value")).toBe("undefined");
		} finally {
			cleanup(component);
		}
	});

	test("repairs the deterministic default when bound placeholder is reset to undefined", () => {
		const { component } = renderFixture();

		try {
			expect(read("placeholder")).toBe("00:00:00");

			component.setPlaceholder(new Time(8, 5, 6));
			flushSync();
			expect(read("placeholder")).toBe("08:05:06");

			component.setPlaceholder(undefined);
			flushSync();
			expect(read("placeholder")).toBe("00:00:00");
		} finally {
			cleanup(component);
		}
	});

	test("syncs placeholder to the selected value", () => {
		const { component } = renderFixture({
			placeholder: new Time(1, 2, 3),
			value: new Time(13, 45, 30),
		});

		try {
			expect(read("placeholder")).toBe("13:45:30");
			expect(read("value")).toBe("13:45:30");
		} finally {
			cleanup(component);
		}
	});

	test("partial segment interaction does not submit placeholder as form data", () => {
		const { component } = renderFixture({
			placeholder: new Time(9, 15, 30),
			granularity: "second",
			hourCycle: 24,
			name: "appointmentTime",
		});

		try {
			const hour = getSegment("hour");
			hour.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true }));
			flushSync();

			expect(read("placeholder")).toBe("09:15:30");
			expect(read("value")).toBe("undefined");
			expect(getHiddenInput()?.value).toBe("");
			expect(new FormData(getForm()).get("appointmentTime")).toBe("");
		} finally {
			cleanup(component);
		}
	});

	test("respects hour, minute, and second granularity", () => {
		const { component: hourComponent } = renderFixture({
			placeholder: new Time(9, 15, 30),
			granularity: "hour",
			hourCycle: 24,
		});

		try {
			expect(hasSegment("hour")).toBe(true);
			expect(hasSegment("minute")).toBe(false);
			expect(hasSegment("second")).toBe(false);
		} finally {
			cleanup(hourComponent);
		}

		const { component: minuteComponent } = renderFixture({
			placeholder: new Time(9, 15, 30),
			granularity: "minute",
			hourCycle: 24,
		});

		try {
			expect(hasSegment("hour")).toBe(true);
			expect(hasSegment("minute")).toBe(true);
			expect(hasSegment("second")).toBe(false);
		} finally {
			cleanup(minuteComponent);
		}

		const { component: secondComponent } = renderFixture({
			placeholder: new Time(9, 15, 30),
			granularity: "second",
			hourCycle: 24,
		});

		try {
			expect(hasSegment("hour")).toBe(true);
			expect(hasSegment("minute")).toBe(true);
			expect(hasSegment("second")).toBe(true);
		} finally {
			cleanup(secondComponent);
		}
	});
});
