import { flushSync, mount, unmount } from "svelte";
import { afterEach, describe, expect, test } from "vitest";
import AccordionSelectionFixture from "./accordion-selection.fixture.svelte";

// The accordion is the third consumer of internal/selection.svelte.ts (SelectionValue) after
// toggle-group and toolbar; selection-group.vitest.ts covers those two through SelectionItemState,
// this suite pins the accordion's own wiring: mode fixed from `type`, single stays collapsible,
// force-close of a sibling, and an undefined value never reaching the engine.

type Fixture = ReturnType<typeof mount<{ type: "single" | "multiple"; value?: string | string[] }, { setValue: (v: string | string[] | undefined) => void }>>;
let component: Fixture | null = null;

function render(props: { type: "single" | "multiple"; value?: string | string[] }) {
	const target = document.createElement("div");
	document.body.append(target);
	component = mount(AccordionSelectionFixture, { props, target });
	flushSync();
	return component;
}

afterEach(() => {
	if (component) unmount(component);
	component = null;
	document.body.innerHTML = "";
});

function item(name: string) {
	const node = document.body.querySelector<HTMLDetailsElement>(`[data-testid="item-${name}"]`);
	if (!node) throw new Error(`Expected item-${name} to render`);
	return node;
}

function clickTrigger(name: string) {
	document.body.querySelector(`[data-testid="trigger-${name}"]`)!.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
	flushSync();
}

const value = () => document.body.querySelector('[data-testid="value"]')!.textContent;
const states = () => ["alpha", "beta", "gamma"].map((n) => item(n).dataset.state);

describe("accordion selection", () => {
	test("single: opening one force-closes the other, and the open item is collapsible", () => {
		render({ type: "single" });
		expect(value()).toBe("");

		clickTrigger("alpha");
		expect(value()).toBe("alpha");
		expect(states()).toEqual(["open", "closed", "closed"]);

		clickTrigger("beta");
		expect(value()).toBe("beta");
		expect(states()).toEqual(["closed", "open", "closed"]);

		clickTrigger("beta");
		expect(value()).toBe("");
		expect(states()).toEqual(["closed", "closed", "closed"]);
	});

	test("multiple: items open independently and the value keeps array shape", () => {
		render({ type: "multiple" });
		expect(value()).toBe("[]");

		clickTrigger("alpha");
		clickTrigger("gamma");
		expect(value()).toBe("[alpha,gamma]");
		expect(states()).toEqual(["open", "closed", "open"]);

		clickTrigger("alpha");
		expect(value()).toBe("[gamma]");
		expect(states()).toEqual(["closed", "closed", "open"]);
	});

	test("the initial value drives data-state and a controlled write is reflected", () => {
		const c = render({ type: "multiple", value: ["beta"] });
		expect(states()).toEqual(["closed", "open", "closed"]);

		c.setValue(["alpha", "gamma"]);
		flushSync();
		expect(states()).toEqual(["open", "closed", "open"]);
	});

	test("a value reset to undefined repairs back to the mode's empty selection", () => {
		const c = render({ type: "multiple", value: ["beta"] });
		c.setValue(undefined);
		flushSync();
		expect(value()).toBe("[]");
		expect(states()).toEqual(["closed", "closed", "closed"]);

		clickTrigger("alpha");
		expect(value()).toBe("[alpha]");
	});
});
