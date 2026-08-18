import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { click, el, render, text } from "../harness.js";
import CheckboxGroupSyncFixture from "./checkbox-group-sync.fixture.svelte";

function getForm() {
	const form = document.body.querySelector<HTMLFormElement>("form");
	if (!form) throw new Error("Expected form to render");
	return form;
}

// NOTE: this exercises the bits `Checkbox` (a styled <button role="checkbox">). As of commit
// c1b6647 it carries NO native form payload — the headless hidden-input shim was dropped in favour
// of the native checkbox variant. So these tests assert controlled checked-state + group-value
// synchronization, and that the bits checkbox contributes nothing to FormData (use the native
// variant for real form submission).
describe("Checkbox group synchronization", () => {
	test("standalone checkbox toggles checked state and submits no form payload", () => {
		render(CheckboxGroupSyncFixture);

		expect(text("standalone-checked")).toBe("false");
		expect(new FormData(getForm()).get("standalone")).toBeNull();

		click("standalone");

		expect(text("standalone-checked")).toBe("true");
		expect(new FormData(getForm()).get("standalone")).toBeNull();

		click("standalone");

		expect(text("standalone-checked")).toBe("false");
		expect(new FormData(getForm()).get("standalone")).toBeNull();
	});

	test("group initial value checks matching items", () => {
		render(CheckboxGroupSyncFixture, {
			groupValue: ["alpha"],
			dynamicValue: "alpha",
		});

		expect(text("group-value")).toBe("[alpha]");
		expect(text("dynamic-checked")).toBe("true");
		expect(text("beta-checked")).toBe("false");
		expect(new FormData(getForm()).getAll("choices")).toEqual([]);
	});

	test("external group value changes update bound item checked state", () => {
		const { component } = render(CheckboxGroupSyncFixture, {
			groupValue: ["alpha"],
			dynamicValue: "alpha",
		});

		component.setGroupValue(["beta"]);
		flushSync();

		expect(text("group-value")).toBe("[beta]");
		expect(text("dynamic-checked")).toBe("false");
		expect(text("beta-checked")).toBe("true");
		// onValueChange reports child-initiated changes only; parent writes must not echo.
		expect(text("group-change-count")).toBe("0");
	});

	test("item toggles update group value and parent bind:value observes the sync", () => {
		render(CheckboxGroupSyncFixture, {
			groupValue: ["alpha"],
			dynamicValue: "alpha",
		});

		click("beta");

		expect(text("group-value")).toBe("[alpha,beta]");
		expect(text("beta-checked")).toBe("true");
		expect(text("group-change-count")).toBe("1");

		click("dynamic");

		expect(text("group-value")).toBe("[beta]");
		expect(text("dynamic-checked")).toBe("false");
		expect(text("checked-change-count")).toBe("4");
	});

	test("dynamic item value changes resync checked state from group value", () => {
		const { component } = render(CheckboxGroupSyncFixture, {
			groupValue: ["beta"],
			dynamicValue: "alpha",
		});

		expect(text("dynamic-checked")).toBe("false");

		component.setDynamicValue("beta");
		flushSync();

		expect(text("dynamic-checked")).toBe("true");
	});

	test("group disabled state prevents item toggles and keeps form payload stable", () => {
		render(CheckboxGroupSyncFixture, {
			groupValue: ["alpha"],
			dynamicValue: "alpha",
			groupDisabled: true,
		});

		expect(el("dynamic")).toHaveProperty("disabled", true);

		click("dynamic");

		expect(text("group-value")).toBe("[alpha]");
		expect(text("dynamic-checked")).toBe("true");
		expect(new FormData(getForm()).getAll("choices")).toEqual([]);
	});
});
