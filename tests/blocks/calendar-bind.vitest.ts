import { parseDate, type DateValue } from "@internationalized/date";
import { flushSync, mount, unmount } from "svelte";
import { describe, expect, test } from "vitest";
import CalendarBindFixture from "./calendar-bind.fixture.svelte";

function renderFixture(props: { preventDeselect?: boolean; initial?: DateValue } = {}) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(CalendarBindFixture, { props, target });
	flushSync();

	return component;
}

function read(testId: "value" | "writes") {
	const node = document.body.querySelector(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} readout to render`);
	return node.textContent;
}

function clickDay(date: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-value="${date}"] [role="button"]`);
	if (!node) throw new Error(`Expected day ${date} to render`);
	node.click();
	flushSync();
}

function cleanup(component: ReturnType<typeof mount>) {
	unmount(component);
	document.body.innerHTML = "";
}

// The block exposes `bind:value` only (no onValueChange), so these pin down what a consumer gets from
// the binding alone: one write per pick, and the deselect behaviour on both sides of `preventDeselect`.
describe("Calendar block binding", () => {
	test("a pick writes the bound value exactly once", () => {
		const component = renderFixture();

		try {
			expect(read("value")).toBe("undefined");
			// Mount echoes the parent's own `undefined` back through the binding (never over a real value, next test);
			// clear those so the pick is measured alone.
			component.resetWrites();
			clickDay("2030-01-10");
			expect(read("value")).toBe("2030-01-10");
			expect(read("writes")).toBe("2030-01-10");
		} finally {
			cleanup(component);
		}
	});

	test("mount does not write over a value the parent already holds", () => {
		const component = renderFixture({ initial: parseDate("2030-01-20") });

		try {
			expect(read("value")).toBe("2030-01-20");
			expect(read("writes")).toBe("");
		} finally {
			cleanup(component);
		}
	});

	test("re-clicking the selected day deselects by default", () => {
		const component = renderFixture();

		try {
			clickDay("2030-01-10");
			clickDay("2030-01-10");
			expect(read("value")).toBe("undefined");
		} finally {
			cleanup(component);
		}
	});

	test("preventDeselect keeps the selected day on re-click", () => {
		const component = renderFixture({ preventDeselect: true });

		try {
			clickDay("2030-01-10");
			clickDay("2030-01-10");
			expect(read("value")).toBe("2030-01-10");
		} finally {
			cleanup(component);
		}
	});
});
