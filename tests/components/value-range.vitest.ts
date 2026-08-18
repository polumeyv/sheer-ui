import { flushSync, mount, unmount } from "svelte";
import { describe, expect, test } from "vitest";
import * as Meter from "../../src/lib/components/meter/index.js";
import * as Progress from "../../src/lib/components/progress/index.js";

function render(component: typeof Meter.Root | typeof Progress.Root, props: Record<string, unknown>) {
	const target = document.createElement("div");
	document.body.append(target);

	const mounted = mount(component, { props, target });
	flushSync();

	const node = target.firstElementChild;
	if (!node) throw new Error("Expected the root element to render");

	return { mounted, node };
}

function readAttrs(node: Element) {
	return Object.fromEntries(Array.from(node.attributes, (attr) => [attr.name, attr.value]));
}

function cleanup(mounted: ReturnType<typeof mount>) {
	unmount(mounted);
	document.body.innerHTML = "";
}

describe("value range attributes", () => {
	test("meter reports its value against its range", () => {
		const { mounted, node } = render(Meter.Root, { value: 40, min: 20, max: 60 });

		try {
			expect(readAttrs(node)).toMatchObject({
				role: "meter",
				"aria-valuemin": "20",
				"aria-valuemax": "60",
				"aria-valuenow": "40",
				"data-value": "40",
				"data-min": "20",
				"data-max": "60",
			});
		} finally {
			cleanup(mounted);
		}
	});

	test("progress reports the same range plus its loading state", () => {
		const { mounted, node } = render(Progress.Root, { value: 60, min: 0, max: 100 });

		try {
			expect(readAttrs(node)).toMatchObject({
				role: "progressbar",
				"aria-valuemin": "0",
				"aria-valuemax": "100",
				"aria-valuenow": "60",
				"data-value": "60",
				"data-min": "0",
				"data-max": "100",
				"data-state": "loading",
			});
			expect(node.hasAttribute("data-indeterminate")).toBe(false);
		} finally {
			cleanup(mounted);
		}
	});

	test("progress at the maximum is loaded", () => {
		const { mounted, node } = render(Progress.Root, { value: 100 });

		try {
			expect(node.getAttribute("data-state")).toBe("loaded");
		} finally {
			cleanup(mounted);
		}
	});

	test("a null progress value drops the current reading and goes indeterminate", () => {
		const { mounted, node } = render(Progress.Root, { value: null });

		try {
			expect(node.getAttribute("data-state")).toBe("indeterminate");
			expect(node.getAttribute("data-indeterminate")).toBe("");
			expect(node.hasAttribute("aria-valuenow")).toBe(false);
			expect(node.hasAttribute("data-value")).toBe(false);
			expect(node.getAttribute("aria-valuemin")).toBe("0");
			expect(node.getAttribute("aria-valuemax")).toBe("100");
		} finally {
			cleanup(mounted);
		}
	});
});
