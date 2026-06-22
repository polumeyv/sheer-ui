import { parseDate } from "@internationalized/date";
import { flushSync, mount, unmount } from "svelte";
import { describe, expect, test } from "vitest";
import DatePickerPlaceholderFixture from "./date-picker-placeholder.fixture.svelte";

type FixtureProps = Partial<{
	placeholder: ReturnType<typeof parseDate>;
	value: ReturnType<typeof parseDate>;
	minValue: ReturnType<typeof parseDate>;
	maxValue: ReturnType<typeof parseDate>;
}>;

function renderFixture(props: FixtureProps = {}) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(DatePickerPlaceholderFixture, { props, target });
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

describe("DatePicker placeholder", () => {
	test("assigns a deterministic default when initial placeholder is undefined", () => {
		const { component } = renderFixture({ minValue: parseDate("2030-01-15") });

		try {
			expect(read("placeholder")).toBe("2030-01-15");
			expect(read("value")).toBe("undefined");
		} finally {
			cleanup(component);
		}
	});

	test("preserves an explicit initial placeholder", () => {
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

	test("reassigns the deterministic default when bound placeholder is reset to undefined", () => {
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

	test("calendar navigation mutates bound placeholder", () => {
		const { component } = renderFixture({ placeholder: parseDate("2030-01-01") });

		try {
			expect(read("placeholder")).toBe("2030-01-01");

			click("next");
			expect(read("placeholder")).toBe("2030-02-01");

			click("prev");
			expect(read("placeholder")).toBe("2030-01-01");
		} finally {
			cleanup(component);
		}
	});

	test("calendar navigation does not mutate selected value after value syncs placeholder", () => {
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
		} finally {
			cleanup(component);
		}
	});
});
