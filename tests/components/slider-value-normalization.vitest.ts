import { flushSync, mount, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import SliderValueNormalizationFixture from "./slider-value-normalization.fixture.svelte";

type FixtureProps = Partial<{
	value: number | number[];
	type: "single" | "multiple";
	min: number;
	max: number;
	step: number | number[];
	autoSort: boolean;
}>;

class ResizeObserverStub {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
}

beforeEach(() => {
	Object.defineProperty(globalThis, "ResizeObserver", {
		configurable: true,
		value: ResizeObserverStub,
	});
	Object.defineProperty(window, "ResizeObserver", {
		configurable: true,
		value: ResizeObserverStub,
	});
});

afterEach(() => {
	document.body.innerHTML = "";
	vi.restoreAllMocks();
});

function renderFixture(props: FixtureProps) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(SliderValueNormalizationFixture, { props, target });
	flushSync();

	return { component, target };
}

function readOutput(testId: string) {
	const node = document.body.querySelector(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} readout to render`);
	return node.textContent;
}

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

function cleanup(component: ReturnType<typeof mount>) {
	unmount(component);
	document.body.innerHTML = "";
}

describe("Slider value normalization", () => {
	test("single mode repairs an initial undefined value to min", () => {
		const { component } = renderFixture({
			type: "single",
			min: 10,
			max: 20,
			step: 5,
		});

		try {
			expect(readOutput("value")).toBe("10");
			expect(readOutput("change-count")).toBe("1");
			expect(readOutput("last-changed")).toBe("10");
			expect(getThumbs()).toHaveLength(1);
			expect(getThumbs()[0]?.getAttribute("aria-valuenow")).toBe("10");
		} finally {
			cleanup(component);
		}
	});

	test("multiple mode repairs an initial undefined value to an empty array", () => {
		const { component } = renderFixture({
			type: "multiple",
			min: 10,
			max: 20,
			step: 5,
		});

		try {
			expect(readOutput("value")).toBe("[]");
			expect(readOutput("change-count")).toBe("0");
			expect(getThumbs()).toHaveLength(1);
			expect(getThumbs()[0]?.getAttribute("aria-valuenow")).toBeNull();
		} finally {
			cleanup(component);
		}
	});

	test("resetting values to undefined repairs them to the mode-specific fallback", () => {
		const single = renderFixture({
			type: "single",
			value: 15,
			min: 10,
			max: 20,
			step: 5,
		});

		try {
			single.component.setValue(undefined);
			flushSync();

			expect(readOutput("value")).toBe("10");
			expect(readOutput("change-count")).toBe("1");
			expect(readOutput("last-changed")).toBe("10");
		} finally {
			cleanup(single.component);
		}

		const multiple = renderFixture({
			type: "multiple",
			value: [10, 20],
			min: 10,
			max: 20,
			step: 5,
		});

		try {
			multiple.component.setValue(undefined);
			flushSync();

			expect(readOutput("value")).toBe("[]");
			expect(readOutput("change-count")).toBe("0");
		} finally {
			cleanup(multiple.component);
		}
	});

	test("explicit valid initial values are preserved", () => {
		const single = renderFixture({
			type: "single",
			value: 15,
			min: 10,
			max: 20,
			step: 5,
		});

		try {
			expect(readOutput("value")).toBe("15");
			expect(readOutput("change-count")).toBe("0");
		} finally {
			cleanup(single.component);
		}

		const multiple = renderFixture({
			type: "multiple",
			value: [10, 20],
			min: 10,
			max: 20,
			step: 5,
		});

		try {
			expect(readOutput("value")).toBe("[10,20]");
			expect(readOutput("change-count")).toBe("0");
			expect(getThumbs().map((thumb) => thumb.getAttribute("aria-valuenow"))).toEqual([
				"10",
				"20",
			]);
		} finally {
			cleanup(multiple.component);
		}
	});

	test("external invalid values snap to the nearest valid step and notify value change", () => {
		const { component } = renderFixture({
			type: "single",
			value: 10,
			min: 10,
			max: 20,
			step: 5,
		});

		try {
			component.setValue(13);
			flushSync();

			expect(readOutput("value")).toBe("15");
			expect(readOutput("change-count")).toBe("1");
			expect(readOutput("last-changed")).toBe("15");
		} finally {
			cleanup(component);
		}
	});

	test("external invalid arrays snap each value to the nearest valid step", () => {
		const { component } = renderFixture({
			type: "multiple",
			value: [10, 20],
			min: 10,
			max: 20,
			step: 5,
		});

		try {
			component.setValue([13, 18]);
			flushSync();

			expect(readOutput("value")).toBe("[15,20]");
			expect(readOutput("change-count")).toBe("1");
			expect(readOutput("last-changed")).toBe("[15,20]");
		} finally {
			cleanup(component);
		}
	});

	test("step changes repair the current value to the new step grid", () => {
		const { component } = renderFixture({
			type: "single",
			value: 15,
			min: 10,
			max: 20,
			step: 5,
		});

		try {
			component.setStep(10);
			flushSync();

			expect(readOutput("value")).toBe("10");
			expect(readOutput("change-count")).toBe("1");
			expect(readOutput("last-changed")).toBe("10");
		} finally {
			cleanup(component);
		}
	});

	test("min and max changes repair the current value to the new valid range", () => {
		const minCase = renderFixture({
			type: "single",
			value: 10,
			min: 0,
			max: 10,
			step: 5,
		});

		try {
			minCase.component.setMin(6);
			flushSync();

			expect(readOutput("value")).toBe("6");
			expect(readOutput("change-count")).toBe("1");
			expect(readOutput("last-changed")).toBe("6");
		} finally {
			cleanup(minCase.component);
		}

		const maxCase = renderFixture({
			type: "single",
			value: 15,
			min: 10,
			max: 20,
			step: 5,
		});

		try {
			maxCase.component.setMax(14);
			flushSync();

			expect(readOutput("value")).toBe("10");
			expect(readOutput("change-count")).toBe("1");
			expect(readOutput("last-changed")).toBe("10");
		} finally {
			cleanup(maxCase.component);
		}
	});

	test("keyboard interaction updates value and commits the selected value", () => {
		const { component } = renderFixture({
			type: "single",
			value: 10,
			min: 10,
			max: 20,
			step: 5,
		});

		try {
			const thumb = getThumbs()[0];
			if (!thumb) throw new Error("Expected slider thumb to render");

			keydown(thumb, "ArrowRight");

			expect(readOutput("value")).toBe("15");
			expect(readOutput("change-count")).toBe("1");
			expect(readOutput("last-changed")).toBe("15");
			expect(readOutput("commit-count")).toBe("1");
			expect(readOutput("last-committed")).toBe("15");
		} finally {
			cleanup(component);
		}
	});

	test("slider does not render hidden form inputs", () => {
		const { component } = renderFixture({
			type: "single",
			value: 10,
			min: 10,
			max: 20,
			step: 5,
		});

		try {
			expect(Array.from(getForm().querySelectorAll("input"))).toEqual([]);
			expect(Array.from(new FormData(getForm()).entries())).toEqual([]);
		} finally {
			cleanup(component);
		}
	});
});
