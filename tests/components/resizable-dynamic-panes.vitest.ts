import { flushSync, mount, unmount } from "svelte";
import { afterEach, describe, expect, test } from "vitest";
import ResizableDynamicPanesFixture from "./resizable-dynamic-panes.fixture.svelte";

function renderFixture() {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(ResizableDynamicPanesFixture, { props: {}, target });
	flushSync();

	return { component, target };
}

function getByTestId(testId: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected element with data-testid="${testId}" to render`);
	return node;
}

function pressEnter(node: HTMLElement) {
	node.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
	flushSync();
}

afterEach(() => {
	document.body.innerHTML = "";
});

describe("Resizable pane registration", () => {
	test("Enter on a resize handle collapses the pane before it", () => {
		const { component } = renderFixture();

		try {
			expect(component.getLayout()).toEqual([50, 50]);

			pressEnter(getByTestId("handle-a"));

			expect(component.getLayout()[0]).toBe(5);
			expect(getByTestId("pane-a").hasAttribute("data-collapsed")).toBe(true);
		} finally {
			unmount(component);
		}
	});

	test("resize handles carry aria values", () => {
		const { component } = renderFixture();

		try {
			expect(getByTestId("handle-a").getAttribute("aria-valuenow")).toBe("50");
		} finally {
			unmount(component);
		}
	});

	test("a dynamically added resize handle gets aria values", () => {
		const { component } = renderFixture();

		try {
			component.addThirdPane();
			flushSync();

			expect(getByTestId("handle-b").getAttribute("aria-valuenow")).not.toBeNull();
		} finally {
			unmount(component);
		}
	});

	test("Enter works on a resize handle added after initial mount", () => {
		const { component } = renderFixture();

		try {
			component.addThirdPane();
			flushSync();

			expect(component.getLayout()).toHaveLength(3);

			pressEnter(getByTestId("handle-b"));

			expect(component.getLayout()[1]).toBe(5);
			expect(getByTestId("pane-b").hasAttribute("data-collapsed")).toBe(true);
		} finally {
			unmount(component);
		}
	});
});
