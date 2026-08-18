import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { render, text } from "../harness.js";
import SliderValueNormalizationFixture from "./slider-value-normalization.fixture.svelte";

function getThumbs() {
	return Array.from(document.body.querySelectorAll<HTMLElement>('[data-slot="slider-thumb"]'));
}

function getForm() {
	const form = document.body.querySelector<HTMLFormElement>("form");
	if (!form) throw new Error("Expected form to render");
	return form;
}

function keydown(node: HTMLElement, key: string) {
	node.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key }));
	flushSync();
}

describe("Slider value normalization", () => {
	test("single mode repairs an initial undefined value to min", () => {
		render(SliderValueNormalizationFixture, {
			type: "single",
			min: 10,
			max: 20,
			step: 5,
		});

		expect(text("value")).toBe("10");
		expect(text("change-count")).toBe("1");
		expect(text("last-changed")).toBe("10");
		expect(getThumbs()).toHaveLength(1);
		expect(getThumbs()[0]?.getAttribute("aria-valuenow")).toBe("10");
	});

	test("multiple mode repairs an initial undefined value to an empty array", () => {
		render(SliderValueNormalizationFixture, {
			type: "multiple",
			min: 10,
			max: 20,
			step: 5,
		});

		expect(text("value")).toBe("[]");
		expect(text("change-count")).toBe("0");
		expect(getThumbs()).toHaveLength(1);
		expect(getThumbs()[0]?.getAttribute("aria-valuenow")).toBeNull();
	});

	test("resetting values to undefined repairs them to the mode-specific fallback", () => {
		const single = render(SliderValueNormalizationFixture, {
			type: "single",
			value: 15,
			min: 10,
			max: 20,
			step: 5,
		});

		single.component.setValue(undefined);
		flushSync();

		expect(text("value")).toBe("10");
		expect(text("change-count")).toBe("1");
		expect(text("last-changed")).toBe("10");
		single.unmount();

		const multiple = render(SliderValueNormalizationFixture, {
			type: "multiple",
			value: [10, 20],
			min: 10,
			max: 20,
			step: 5,
		});

		multiple.component.setValue(undefined);
		flushSync();

		expect(text("value")).toBe("[]");
		expect(text("change-count")).toBe("0");
		multiple.unmount();
	});

	test("explicit valid initial values are preserved", () => {
		const single = render(SliderValueNormalizationFixture, {
			type: "single",
			value: 15,
			min: 10,
			max: 20,
			step: 5,
		});

		expect(text("value")).toBe("15");
		expect(text("change-count")).toBe("0");
		single.unmount();

		const multiple = render(SliderValueNormalizationFixture, {
			type: "multiple",
			value: [10, 20],
			min: 10,
			max: 20,
			step: 5,
		});

		expect(text("value")).toBe("[10,20]");
		expect(text("change-count")).toBe("0");
		expect(getThumbs().map((thumb) => thumb.getAttribute("aria-valuenow"))).toEqual([
			"10",
			"20",
		]);
		multiple.unmount();
	});

	test("external invalid values snap to the nearest valid step and notify value change", () => {
		const { component } = render(SliderValueNormalizationFixture, {
			type: "single",
			value: 10,
			min: 10,
			max: 20,
			step: 5,
		});

		component.setValue(13);
		flushSync();

		expect(text("value")).toBe("15");
		expect(text("change-count")).toBe("1");
		expect(text("last-changed")).toBe("15");
	});

	test("external invalid arrays snap each value to the nearest valid step", () => {
		const { component } = render(SliderValueNormalizationFixture, {
			type: "multiple",
			value: [10, 20],
			min: 10,
			max: 20,
			step: 5,
		});

		component.setValue([13, 18]);
		flushSync();

		expect(text("value")).toBe("[15,20]");
		expect(text("change-count")).toBe("1");
		expect(text("last-changed")).toBe("[15,20]");
	});

	test("step changes repair the current value to the new step grid", () => {
		const { component } = render(SliderValueNormalizationFixture, {
			type: "single",
			value: 15,
			min: 10,
			max: 20,
			step: 5,
		});

		component.setStep(10);
		flushSync();

		expect(text("value")).toBe("10");
		expect(text("change-count")).toBe("1");
		expect(text("last-changed")).toBe("10");
	});

	test("min and max changes repair the current value to the new valid range", () => {
		const minCase = render(SliderValueNormalizationFixture, {
			type: "single",
			value: 10,
			min: 0,
			max: 10,
			step: 5,
		});

		minCase.component.setMin(6);
		flushSync();

		expect(text("value")).toBe("6");
		expect(text("change-count")).toBe("1");
		expect(text("last-changed")).toBe("6");
		minCase.unmount();

		const maxCase = render(SliderValueNormalizationFixture, {
			type: "single",
			value: 15,
			min: 10,
			max: 20,
			step: 5,
		});

		maxCase.component.setMax(14);
		flushSync();

		expect(text("value")).toBe("10");
		expect(text("change-count")).toBe("1");
		expect(text("last-changed")).toBe("10");
		maxCase.unmount();
	});

	test("keyboard interaction updates value and commits the selected value", () => {
		render(SliderValueNormalizationFixture, {
			type: "single",
			value: 10,
			min: 10,
			max: 20,
			step: 5,
		});

		const thumb = getThumbs()[0];
		if (!thumb) throw new Error("Expected slider thumb to render");

		keydown(thumb, "ArrowRight");

		expect(text("value")).toBe("15");
		expect(text("change-count")).toBe("1");
		expect(text("last-changed")).toBe("15");
		expect(text("commit-count")).toBe("1");
		expect(text("last-committed")).toBe("15");
	});

	test("slider does not render hidden form inputs", () => {
		render(SliderValueNormalizationFixture, {
			type: "single",
			value: 10,
			min: 10,
			max: 20,
			step: 5,
		});

		expect(Array.from(getForm().querySelectorAll("input"))).toEqual([]);
		expect(Array.from(new FormData(getForm()).entries())).toEqual([]);
	});
});
