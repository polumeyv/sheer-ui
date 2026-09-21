import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { mountInBody } from "../mount";
import CheckboxGroupSyncFixture from "./checkbox-group-sync.fixture.svelte";

type FixtureProps = Partial<{
	standaloneChecked: boolean;
	groupValue: string[];
	dynamicValue: string;
	groupDisabled: boolean;
}>;

function renderFixture(props: FixtureProps = {}) {
	return mountInBody(CheckboxGroupSyncFixture, props);
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

function click(testId: string) {
	getNode(testId).click();
	flushSync();
}

// NOTE: this exercises the bits `Checkbox` (a styled <button role="checkbox">). As of commit
// c1b6647 it carries NO native form payload — the headless hidden-input shim was dropped in favour
// of the native checkbox variant. So these tests assert controlled checked-state + group-value
// synchronization, and that the bits checkbox contributes nothing to FormData (use the native
// variant for real form submission).
describe("Checkbox group synchronization", () => {
	test("standalone checkbox toggles checked state and submits no form payload", () => {
		renderFixture();

		expect(readOutput("standalone-checked")).toBe("false");
		expect(new FormData(getForm()).get("standalone")).toBeNull();

		click("standalone");

		expect(readOutput("standalone-checked")).toBe("true");
		expect(new FormData(getForm()).get("standalone")).toBeNull();

		click("standalone");

		expect(readOutput("standalone-checked")).toBe("false");
		expect(new FormData(getForm()).get("standalone")).toBeNull();
	});

	test("group initial value checks matching items", () => {
		renderFixture({
			groupValue: ["alpha"],
			dynamicValue: "alpha",
		});

		expect(readOutput("group-value")).toBe("[alpha]");
		expect(readOutput("dynamic-checked")).toBe("true");
		expect(readOutput("beta-checked")).toBe("false");
		expect(new FormData(getForm()).getAll("choices")).toEqual([]);
	});

	test("external group value changes update bound item checked state", () => {
		const { component } = renderFixture({
			groupValue: ["alpha"],
			dynamicValue: "alpha",
		});

		component.setGroupValue(["beta"]);
		flushSync();

		expect(readOutput("group-value")).toBe("[beta]");
		expect(readOutput("dynamic-checked")).toBe("false");
		expect(readOutput("beta-checked")).toBe("true");
		// onValueChange reports child-initiated changes only; parent writes must not echo.
		expect(readOutput("group-change-count")).toBe("0");
	});

	test("item toggles update group value and parent bind:value observes the sync", () => {
		renderFixture({
			groupValue: ["alpha"],
			dynamicValue: "alpha",
		});

		click("beta");

		expect(readOutput("group-value")).toBe("[alpha,beta]");
		expect(readOutput("beta-checked")).toBe("true");
		expect(readOutput("group-change-count")).toBe("1");

		click("dynamic");

		expect(readOutput("group-value")).toBe("[beta]");
		expect(readOutput("dynamic-checked")).toBe("false");
		expect(readOutput("checked-change-count")).toBe("1");
	});

	test("dynamic item value changes resync checked state from group value", () => {
		const { component } = renderFixture({
			groupValue: ["beta"],
			dynamicValue: "alpha",
		});

		expect(readOutput("dynamic-checked")).toBe("false");

		component.setDynamicValue("beta");
		flushSync();

		expect(readOutput("dynamic-checked")).toBe("true");
	});

	test("group disabled state prevents item toggles and keeps form payload stable", () => {
		renderFixture({
			groupValue: ["alpha"],
			dynamicValue: "alpha",
			groupDisabled: true,
		});

		expect(getNode("dynamic")).toHaveProperty("disabled", true);

		click("dynamic");

		expect(readOutput("group-value")).toBe("[alpha]");
		expect(readOutput("dynamic-checked")).toBe("true");
		expect(new FormData(getForm()).getAll("choices")).toEqual([]);
	});
});
