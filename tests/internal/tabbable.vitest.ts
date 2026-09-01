import { afterEach, describe, expect, test } from "vitest";
import {
	getFocusableCandidates,
	getTabbableCandidates,
	isFocusable,
	isTabbable,
	tabbable,
} from "../../src/lib/internal/tabbable.js";

function render(html: string) {
	const root = document.createElement("div");
	root.innerHTML = html;
	document.body.append(root);
	return root;
}

function ids(nodes: Element[]) {
	return nodes.map((node) => node.getAttribute("data-id"));
}

function getById(root: ParentNode, id: string) {
	const node = root.querySelector<HTMLElement>(`[data-id="${id}"]`);
	if (!node) throw new Error(`Expected node ${id} to exist`);
	return node;
}

afterEach(() => {
	document.body.innerHTML = "";
});

describe("internal tabbable", () => {
	test("sorts positive tabindex nodes before normal source-order tabbables", () => {
		const root = render(`
			<button data-id="normal">normal</button>
			<button data-id="two" tabindex="2">two</button>
			<a data-id="link" href="/">link</a>
			<button data-id="one" tabindex="1">one</button>
		`);

		expect(ids(getTabbableCandidates(root))).toEqual(["one", "two", "normal", "link"]);
	});

	test("distinguishes focusable from tabbable", () => {
		const root = render(`
			<button data-id="negative" tabindex="-1">negative</button>
			<button data-id="normal">normal</button>
		`);
		const negative = getById(root, "negative");

		expect(ids(getTabbableCandidates(root))).toEqual(["normal"]);
		expect(ids(getFocusableCandidates(root))).toEqual(["negative", "normal"]);
		expect(isFocusable(negative)).toBe(true);
		expect(isTabbable(negative)).toBe(false);
	});

	test("skips disabled, inert, and visibility-hidden candidates", () => {
		const root = render(`
			<button data-id="enabled">enabled</button>
			<button data-id="disabled" disabled>disabled</button>
			<div inert>
				<button data-id="inerted">inerted</button>
			</div>
			<button data-id="hidden" style="visibility: hidden">hidden</button>
		`);

		expect(ids(getTabbableCandidates(root))).toEqual(["enabled"]);
	});

	test("keeps controls inside the first legend of a disabled fieldset", () => {
		const root = render(`
			<fieldset disabled>
				<legend><input data-id="legend" /></legend>
				<input data-id="fieldset" />
			</fieldset>
		`);

		expect(ids(getTabbableCandidates(root))).toEqual(["legend"]);
	});

	test("only the checked radio in a named group is tabbable", () => {
		const root = render(`
			<input data-id="first" type="radio" name="group" />
			<input data-id="checked" type="radio" name="group" checked />
			<input data-id="unnamed" type="radio" />
		`);

		expect(ids(getTabbableCandidates(root))).toEqual(["checked", "unnamed"]);
	});

	test("keeps closed details descendants out while allowing summaries", () => {
		const root = render(`
			<details>
				<summary data-id="closed-summary">closed summary</summary>
				<button data-id="closed-content">closed content</button>
			</details>
			<details open>
				<summary data-id="open-summary">open summary</summary>
				<button data-id="open-content">open content</button>
			</details>
		`);

		expect(ids(getTabbableCandidates(root))).toEqual(["closed-summary", "open-summary", "open-content"]);
	});

	test("walks open shadow roots", () => {
		const root = render(`<div data-id="host"></div>`);
		const host = getById(root, "host");
		const shadow = host.attachShadow({ mode: "open" });
		shadow.innerHTML = `<button data-id="shadow">shadow</button>`;

		expect(ids(getTabbableCandidates(root))).toEqual(["shadow"]);
	});

	test("interleaves slotted light dom with shadow candidates in document order", () => {
		const root = render(`<button data-id="one">one</button><div data-id="host"><button data-id="slotted">slotted</button></div><button data-id="two">two</button>`);
		const host = getById(root, "host");
		const shadow = host.attachShadow({ mode: "open" });
		shadow.innerHTML = `<button data-id="inner-a">a</button><slot></slot><button data-id="inner-b">b</button>`;

		expect(ids(getTabbableCandidates(root))).toEqual(["one", "inner-a", "slotted", "inner-b", "two"]);
	});

	test("walks slotted light-dom candidates through open shadow roots", () => {
		const root = render(`<div data-id="host"><button data-id="slotted">slotted</button></div>`);
		const host = getById(root, "host");
		const shadow = host.attachShadow({ mode: "open" });
		shadow.innerHTML = `<slot></slot>`;

		expect(ids(getTabbableCandidates(root))).toEqual(["slotted"]);
	});

	test("displayCheck full asks the platform: checkVisibility decides", () => {
		const root = render(`<button data-id="shown">shown</button><button data-id="hidden">hidden</button>`);
		const stub = (id: string, visible: boolean) =>
			Object.defineProperty(getById(root, id), "checkVisibility", {
				configurable: true,
				value: (options: unknown) => {
					expect(options).toEqual({ visibilityProperty: true });
					return visible;
				},
			});
		stub("shown", true);
		stub("hidden", false);

		expect(ids(tabbable(root, { displayCheck: "full", getShadowRoot: true }))).toEqual(["shown"]);
	});
});
