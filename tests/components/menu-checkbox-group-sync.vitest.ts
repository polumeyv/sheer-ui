import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { click, el, render, text } from "../harness.js";
import MenuCheckboxGroupSyncFixture from "./menu-checkbox-group-sync.fixture.svelte";

describe("Menu checkbox group synchronization", () => {
	test("group value drives checked state", () => {
		render(MenuCheckboxGroupSyncFixture, {
			value: ["alpha"],
			dynamicValue: "alpha",
		});

		expect(text("group-value")).toBe("[alpha]");
		expect(text("dynamic-checked")).toBe("true");
		expect(text("beta-checked")).toBe("false");
		expect(el("dynamic").getAttribute("aria-checked")).toBe("true");
		expect(el("beta").getAttribute("aria-checked")).toBe("false");
	});

	test("external group value changes update bound item checked state", () => {
		const { component } = render(MenuCheckboxGroupSyncFixture, {
			value: ["alpha"],
			dynamicValue: "alpha",
		});

		component.setValue(["beta"]);
		flushSync();

		expect(text("group-value")).toBe("[beta]");
		expect(text("dynamic-checked")).toBe("false");
		expect(text("beta-checked")).toBe("true");
	});

	test("toggling grouped items updates group value and fires menu select", () => {
		render(MenuCheckboxGroupSyncFixture, {
			value: ["alpha"],
			dynamicValue: "alpha",
		});

		click("beta");

		expect(text("group-value")).toBe("[alpha,beta]");
		expect(text("beta-checked")).toBe("true");
		expect(text("group-change-count")).toBe("1");

		click("dynamic");

		expect(text("group-value")).toBe("[beta]");
		expect(text("dynamic-checked")).toBe("false");
		expect(text("checked-change-count")).toBe("1");
		expect(text("select-count")).toBe("1");
	});

	test("dynamic item value changes resync checked state from group value", () => {
		const { component } = render(MenuCheckboxGroupSyncFixture, {
			value: ["beta"],
			dynamicValue: "alpha",
		});

		expect(text("dynamic-checked")).toBe("false");

		component.setDynamicValue("beta");
		flushSync();

		expect(text("dynamic-checked")).toBe("true");
	});

	test("standalone menu checkbox item keeps explicit checked behavior", () => {
		render(MenuCheckboxGroupSyncFixture, {
			standaloneChecked: true,
		});

		expect(text("standalone-checked")).toBe("true");
		expect(el("standalone").getAttribute("aria-checked")).toBe("true");

		click("standalone");

		expect(text("standalone-checked")).toBe("false");
		expect(el("standalone").getAttribute("aria-checked")).toBe("false");
	});
});
