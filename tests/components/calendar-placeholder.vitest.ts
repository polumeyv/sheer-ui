import { parseDate, type DateValue } from "@internationalized/date";
import { flushSync, mount, unmount } from "svelte";
import { describe, expect, test } from "vitest";
import CalendarPlaceholderFixture from "./calendar-placeholder.fixture.svelte";

type CalendarValue = DateValue | DateValue[] | undefined;

type FixtureProps = Partial<{
	placeholder: DateValue;
	value: CalendarValue;
	minValue: DateValue;
	maxValue: DateValue;
	type: "single" | "multiple";
}>;

function renderFixture(props: FixtureProps = {}) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(CalendarPlaceholderFixture, { props, target });
	flushSync();

	return { component, target };
}

function read(testId: "placeholder" | "value") {
	const node = document.body.querySelector(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} readout to render`);
	return node.textContent;
}

function click(testId: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} to render`);
	node.click();
	flushSync();
}

function cleanup(component: ReturnType<typeof mount>) {
	unmount(component);
	document.body.innerHTML = "";
}

describe("Calendar placeholder and value ownership", () => {
	test("assigns a deterministic default when initial placeholder is undefined", () => {
		const { component } = renderFixture({ minValue: parseDate("2030-01-15") });

		try {
			expect(read("placeholder")).toBe("2030-01-15");
			expect(read("value")).toBe("undefined");
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
			expect(read("value")).toBe("undefined");
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

	test("syncs placeholder to the selected value", () => {
		const { component } = renderFixture({
			placeholder: parseDate("2030-01-01"),
			value: parseDate("2030-01-10"),
		});

		try {
			expect(read("placeholder")).toBe("2030-01-10");
			expect(read("value")).toBe("2030-01-10");
		} finally {
			cleanup(component);
		}
	});

	test("calendar navigation mutates placeholder without mutating selected value", () => {
		const { component } = renderFixture({
			placeholder: parseDate("2030-01-01"),
			value: parseDate("2030-01-10"),
		});

		try {
			expect(read("placeholder")).toBe("2030-01-10");
			expect(read("value")).toBe("2030-01-10");

			click("next");

			expect(read("placeholder")).toBe("2030-02-01");
			expect(read("value")).toBe("2030-01-10");

			click("prev");

			expect(read("placeholder")).toBe("2030-01-01");
			expect(read("value")).toBe("2030-01-10");
		} finally {
			cleanup(component);
		}
	});

	test("single-value reset leaves placeholder at the last selected value", () => {
		const { component } = renderFixture({
			placeholder: parseDate("2030-01-01"),
			value: parseDate("2030-01-10"),
		});

		try {
			expect(read("placeholder")).toBe("2030-01-10");
			expect(read("value")).toBe("2030-01-10");

			component.setValue(undefined);
			flushSync();

			expect(read("placeholder")).toBe("2030-01-10");
			expect(read("value")).toBe("undefined");
		} finally {
			cleanup(component);
		}
	});

	test("multiple-value reset repairs value to an empty array and keeps placeholder at the last selected value", () => {
		const { component } = renderFixture({
			type: "multiple",
			placeholder: parseDate("2030-01-01"),
			value: [parseDate("2030-01-10"), parseDate("2030-01-12")],
		});

		try {
			expect(read("placeholder")).toBe("2030-01-12");
			expect(read("value")).toBe("[2030-01-10,2030-01-12]");

			component.setValue(undefined);
			flushSync();

			expect(read("placeholder")).toBe("2030-01-12");
			expect(read("value")).toBe("[]");
		} finally {
			cleanup(component);
		}
	});
});
