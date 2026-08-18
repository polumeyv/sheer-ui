import { flushSync } from "svelte";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { el, render } from "../harness.js";
import FloatingLayerArrowFixture from "./floating-layer-arrow.fixture.svelte";

const floatingMocks = vi.hoisted(() => ({
	autoUpdate: vi.fn(),
	computePosition: vi.fn(),
}));

vi.mock("@floating-ui/dom", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@floating-ui/dom")>();

	return {
		...actual,
		autoUpdate: floatingMocks.autoUpdate,
		computePosition: floatingMocks.computePosition,
	};
});

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

let arrowWidthReads: number[] = [];
let arrowHeightReads: number[] = [];

async function settlePositioning() {
	await Promise.resolve();
	await Promise.resolve();
	flushSync();
}

beforeEach(() => {
	ResizeObserverStub.instances = [];
	arrowWidthReads = [];
	arrowHeightReads = [];

	Object.defineProperty(window, "ResizeObserver", {
		configurable: true,
		value: ResizeObserverStub,
	});

	vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function getOffsetWidth() {
		const width = Number(this.getAttribute("data-test-width") ?? 0);
		if (this.getAttribute("data-testid") === "arrow") {
			arrowWidthReads.push(width);
		}
		return width;
	});

	vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function getOffsetHeight() {
		const height = Number(this.getAttribute("data-test-height") ?? 0);
		if (this.getAttribute("data-testid") === "arrow") {
			arrowHeightReads.push(height);
		}
		return height;
	});

	vi.spyOn(Element.prototype, "getClientRects").mockImplementation(
		() =>
			({
				length: 1,
				item: () => null,
				0: new DOMRect(0, 0, 10, 10),
				[Symbol.iterator]: function* () {
					yield this[0];
				},
			}) as DOMRectList
	);

	floatingMocks.autoUpdate.mockImplementation((_reference, _floating, update) => {
		update();
		return vi.fn();
	});

	floatingMocks.computePosition.mockImplementation(async (_reference, _floating, options) => {
		const middleware = (options.middleware ?? []) as Array<{
			name?: string;
			options?: { arrowWidth?: number; arrowHeight?: number };
		}>;
		const transformOriginMiddleware =
			middleware.find((entry) => entry?.name === "transformOrigin") ?? middleware.at(-1);
		const arrowWidth = transformOriginMiddleware?.options?.arrowWidth ?? 0;
		const arrowHeight = transformOriginMiddleware?.options?.arrowHeight ?? 0;

		return {
			x: 0,
			y: 0,
			strategy: "fixed",
			placement: "bottom",
			middlewareData: {
				arrow: { x: 4, y: 0, centerOffset: 0 },
				transformOrigin: {
					x: `${4 + arrowWidth / 2}px`,
					y: `${-arrowHeight}px`,
				},
			},
		};
	});
});

describe("FloatingLayer arrow measurement", () => {
	test("arrow mount starts measurement and observes the arrow element", async () => {
		render(FloatingLayerArrowFixture);

		await settlePositioning();

		expect(ResizeObserverStub.instances).toHaveLength(1);
		expect(ResizeObserverStub.instances[0]?.observe).toHaveBeenCalledWith(el("arrow"));
		expect(arrowWidthReads).toContain(12);
		expect(arrowHeightReads).toContain(8);
	});

	test("arrow resize remeasures the current arrow dimensions", async () => {
		const { component } = render(FloatingLayerArrowFixture);

		await settlePositioning();
		expect(arrowWidthReads).toContain(12);
		expect(arrowHeightReads).toContain(8);

		component.setArrowSize(20, 10);
		flushSync();
		ResizeObserverStub.instances[0]?.trigger();
		await settlePositioning();

		expect(arrowWidthReads).toContain(20);
		expect(arrowHeightReads).toContain(10);
	});

	test("ResizeObserver disconnects when the arrow unmounts", async () => {
		const { component } = render(FloatingLayerArrowFixture);

		await settlePositioning();
		const observer = ResizeObserverStub.instances[0];
		expect(observer).toBeDefined();

		component.hideArrow();
		flushSync();

		expect(observer?.disconnect).toHaveBeenCalledTimes(1);
		expect(ResizeObserverStub.instances).toHaveLength(1);
	});
});
