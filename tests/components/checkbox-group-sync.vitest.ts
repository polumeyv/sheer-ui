import { flushSync, mount, unmount } from "svelte";
import { describe, expect, test } from "vitest";
import CheckboxGroupSyncFixture from "./checkbox-group-sync.fixture.svelte";

type FixtureProps = Partial<{
	standaloneChecked: boolean;
	groupValue: string[];
	dynamicValue: string;
	groupDisabled: boolean;
}>;

function renderFixture(props: FixtureProps = {}) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(CheckboxGroupSyncFixture, { props, target });
	flushSync();

	return { component, target };
}

function readOutput(testId: string) {
	const node = document.body.querySelector(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} readout to render`);
	return node.textContent;
}

function getNode(testId: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} to render`);
	return node;
}

function getForm() {
	const form = document.body.querySelector<HTMLFormElement>("form");
	if (!form) throw new Error("Expected form to render");
	return form;
}

function getHiddenInputs(name: string) {
	return Array.from(
		document.body.querySelectorAll<HTMLInputElement>(`input[aria-hidden="true"][name="${name}"]`)
	);
}

function click(testId: string) {
	getNode(testId).click();
	flushSync();
}

function cleanup(component: ReturnType<typeof mount>) {
	unmount(component);
	document.body.innerHTML = "";
}

describe("Checkbox group synchronization", () => {
	test("standalone checkbox toggles checked state and form payload", () => {
		const { component } = renderFixture();

		try {
			expect(readOutput("standalone-checked")).toBe("false");
			expect(new FormData(getForm()).get("standalone")).toBeNull();

			click("standalone");

			expect(readOutput("standalone-checked")).toBe("true");
			expect(getHiddenInputs("standalone").map((input) => input.value)).toEqual(["yes"]);
			expect(new FormData(getForm()).get("standalone")).toBe("yes");

			click("standalone");

			expect(readOutput("standalone-checked")).toBe("false");
			expect(new FormData(getForm()).get("standalone")).toBeNull();
		} finally {
			cleanup(component);
		}
	});

	test("group initial value checks matching items and renders group form payload", () => {
		const { component } = renderFixture({
			groupValue: ["alpha"],
			dynamicValue: "alpha",
		});

		try {
			expect(readOutput("group-value")).toBe("[alpha]");
			expect(readOutput("dynamic-checked")).toBe("true");
			expect(readOutput("beta-checked")).toBe("false");
			expect(getHiddenInputs("choices").map((input) => input.value)).toEqual(["alpha", "beta"]);
			expect(new FormData(getForm()).getAll("choices")).toEqual(["alpha"]);
		} finally {
			cleanup(component);
		}
	});

	test("external group value changes update bound item checked state", () => {
		const { component } = renderFixture({
			groupValue: ["alpha"],
			dynamicValue: "alpha",
		});

		try {
			component.setGroupValue(["beta"]);
			flushSync();

			expect(readOutput("group-value")).toBe("[beta]");
			expect(readOutput("dynamic-checked")).toBe("false");
			expect(readOutput("beta-checked")).toBe("true");
			expect(new FormData(getForm()).getAll("choices")).toEqual(["beta"]);
		} finally {
			cleanup(component);
		}
	});

	test("item toggles update group value and parent bind:value observes the sync", () => {
		const { component } = renderFixture({
			groupValue: ["alpha"],
			dynamicValue: "alpha",
		});

		try {
			click("beta");

			expect(readOutput("group-value")).toBe("[alpha,beta]");
			expect(readOutput("beta-checked")).toBe("true");
			expect(readOutput("group-change-count")).toBe("1");

			click("dynamic");

			expect(readOutput("group-value")).toBe("[beta]");
			expect(readOutput("dynamic-checked")).toBe("false");
			expect(readOutput("checked-change-count")).toBe("4");
		} finally {
			cleanup(component);
		}
	});

	test("dynamic item value changes resync checked state from group value", () => {
		const { component } = renderFixture({
			groupValue: ["beta"],
			dynamicValue: "alpha",
		});

		try {
			expect(readOutput("dynamic-checked")).toBe("false");

			component.setDynamicValue("beta");
			flushSync();

			expect(readOutput("dynamic-checked")).toBe("true");
		} finally {
			cleanup(component);
		}
	});

	test("group disabled state prevents item toggles and keeps form payload stable", () => {
		const { component } = renderFixture({
			groupValue: ["alpha"],
			dynamicValue: "alpha",
			groupDisabled: true,
		});

		try {
			expect(getNode("dynamic")).toHaveProperty("disabled", true);

			click("dynamic");

			expect(readOutput("group-value")).toBe("[alpha]");
			expect(readOutput("dynamic-checked")).toBe("true");
			expect(new FormData(getForm()).getAll("choices")).toEqual([]);
		} finally {
			cleanup(component);
		}
	});
});
