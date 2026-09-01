import { flushSync, mount, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import FloatingLayerArrowFixture from "./floating-layer-arrow.fixture.svelte";

class ResizeObserverStub {
	static instances: ResizeObserverStub[] = [];
	readonly observe = vi.fn();
	readonly disconnect = vi.fn();

	constructor(readonly callback: ResizeObserverCallback) {
		ResizeObserverStub.instances.push(this);
	}

	trigger() {
		this.callback([], this as unknown as ResizeObserver);
	}
}

function renderFixture(props: { arrowWidth?: number; arrowHeight?: number; side?: "top" | "right" | "bottom" | "left"; arrowPadding?: number } = {}) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(FloatingLayerArrowFixture, { props, target });
	flushSync();

	return { component, target };
}

const node = (testid: string) => {
	const el = document.body.querySelector<HTMLElement>(`[data-testid="${testid}"]`);
	if (!el) throw new Error(`Expected [data-testid="${testid}"] to render`);
	return el;
};

beforeEach(() => {
	ResizeObserverStub.instances = [];

	Object.defineProperty(window, "ResizeObserver", {
		configurable: true,
		value: ResizeObserverStub,
	});

	vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function getOffsetWidth() {
		return Number(this.getAttribute("data-test-width") ?? 0);
	});

	vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function getOffsetHeight() {
		return Number(this.getAttribute("data-test-height") ?? 0);
	});
});

afterEach(() => {
	vi.restoreAllMocks();
	document.body.innerHTML = "";
});

// jsdom does not lay out anchor positioning; the contract under test is the CSS the engine emits.
describe("FloatingLayer anchor positioning", () => {
	test("the trigger carries the anchor name the content positions against", () => {
		const { component } = renderFixture();

		try {
			const anchorName = node("anchor").style.getPropertyValue("anchor-name");
			expect(anchorName).toMatch(/^--bits-anchor-/);
			const content = node("content");
			expect(content.style.getPropertyValue("position-anchor")).toBe(anchorName);
			expect(content.style.getPropertyValue("position-area")).toBe("bottom span-all");
			expect(content.style.getPropertyValue("justify-self")).toBe("anchor-center");
			expect(content.style.getPropertyValue("position-try-fallbacks")).toBe("none");
			expect(content.style.getPropertyValue("--bits-floating-anchor-width")).toBe(`anchor-size(${anchorName} width)`);
			expect(content.dataset.side).toBe("bottom");
			expect(content.dataset.align).toBe("center");
		} finally {
			unmount(component);
		}
	});

	test("the arrow height adds to the side offset and the arrow centers on the anchor", () => {
		const { component } = renderFixture({ arrowPadding: 4 });

		try {
			const content = node("content");
			// side "bottom": the gap toward the anchor is margin-top = sideOffset (0) + arrow height (8)
			expect(content.style.marginTop).toBe("8px");
			const anchorName = content.style.getPropertyValue("position-anchor");
			const arrow = node("arrow");
			expect(arrow.style.position).toBe("absolute");
			expect(arrow.style.top).toBe("0px");
			// jsdom re-serializes the calc(); the parts are what matter
			expect(arrow.style.left).toMatch(/^clamp\(4px, /);
			expect(arrow.style.left).toContain(anchorName);
			expect(arrow.style.left).toContain('center');
			expect(arrow.style.left).toContain('6px');
			expect(arrow.style.left).toContain('100%');
			expect(arrow.dataset.side).toBe("bottom");
		} finally {
			unmount(component);
		}
	});

	test("a horizontal side centers the arrow on the block axis", () => {
		const { component } = renderFixture({ side: "right" });

		try {
			const content = node("content");
			expect(content.style.getPropertyValue("position-area")).toBe("right span-all");
			expect(content.style.getPropertyValue("align-self")).toBe("anchor-center");
			expect(content.style.marginLeft).toBe("8px");
			const arrow = node("arrow");
			expect(arrow.style.left).toBe("0px");
			expect(arrow.style.top).toContain("anchor(");
		} finally {
			unmount(component);
		}
	});
});

describe("FloatingLayer arrow measurement", () => {
	test("arrow mount starts measurement and observes the arrow element", () => {
		const { component } = renderFixture();

		try {
			expect(ResizeObserverStub.instances).toHaveLength(1);
			expect(ResizeObserverStub.instances[0]?.observe).toHaveBeenCalledWith(node("arrow"));
		} finally {
			unmount(component);
		}
	});

	test("arrow resize remeasures the current arrow dimensions", () => {
		const { component } = renderFixture();

		try {
			expect(node("content").style.marginTop).toBe("8px");

			component.setArrowSize(20, 10);
			flushSync();
			ResizeObserverStub.instances[0]?.trigger();
			flushSync();

			expect(node("content").style.marginTop).toBe("10px");
			expect(node("arrow").style.left).toContain("10px");
		} finally {
			unmount(component);
		}
	});

	test("ResizeObserver disconnects when the arrow unmounts", () => {
		const { component } = renderFixture();

		try {
			const observer = ResizeObserverStub.instances[0];
			expect(observer).toBeDefined();

			component.hideArrow();
			flushSync();

			expect(observer?.disconnect).toHaveBeenCalledTimes(1);
			expect(ResizeObserverStub.instances).toHaveLength(1);
			expect(node("content").style.marginTop).toBe("0px");
		} finally {
			unmount(component);
		}
	});
});
