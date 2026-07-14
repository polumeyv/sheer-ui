import { flushSync, mount, unmount } from "svelte";
import { afterEach, describe, expect, test } from "vitest";
import type { DOMContext } from "../../src/lib/internal/tools/index.js";
import {
	getDragOffsetPercentage,
	getPivotIndices,
	getResizeHandleElementIndex,
} from "../../src/lib/internal/vendor/paneforge/internal/helpers.js";
import { adjustLayoutByDelta } from "../../src/lib/internal/vendor/paneforge/internal/utils/adjust-layout.js";
import ResizableDynamicPanesFixture from "./resizable-dynamic-panes.fixture.svelte";

function createDomContext(root: ParentNode) {
	return {
		querySelector: (selector: string) => root.querySelector(selector),
		querySelectorAll: (selector: string) => root.querySelectorAll(selector),
	} as DOMContext;
}

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
	test("missing resize handles resolve to no index or pivot", () => {
		const root = document.createElement("div");
		root.innerHTML = `<div data-pane-resizer-id="present" data-pane-group-id="group"></div>`;
		const domContext = createDomContext(root);

		expect(getResizeHandleElementIndex({ groupId: "group", id: "present", domContext })).toBe(0);
		expect(getResizeHandleElementIndex({ groupId: "group", id: "missing", domContext })).toBeNull();
		expect(getPivotIndices({ groupId: "group", dragHandleId: "missing", domContext })).toBeNull();
	});

	test("an invalid drag snapshot cancels the interaction", () => {
		expect(
			getDragOffsetPercentage({
				event: new MouseEvent("mousemove", { clientX: 20 }),
				dir: "horizontal",
				initialDragState: {
					dragHandleId: "missing",
					groupSizeInPixels: 0,
					initialCursorPosition: 10,
					initialLayout: [50, 50],
				},
			}),
		).toBe(0);
	});

	test("invalid pivot indexes leave the layout unchanged", () => {
		const layout = [50, 50];

		expect(
			adjustLayoutByDelta({
				delta: 10,
				layout,
				paneConstraints: [{}, {}],
				pivotIndices: [-1, 0],
				trigger: "keyboard",
			}),
		).toBe(layout);
	});

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
