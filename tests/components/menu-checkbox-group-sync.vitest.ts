import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { mountInBody } from "../mount";
import MenuCheckboxGroupSyncFixture from "./menu-checkbox-group-sync.fixture.svelte";

type FixtureProps = Partial<{
	value: string[];
	dynamicValue: string;
	standaloneChecked: boolean;
}>;

function renderFixture(props: FixtureProps = {}) {
	return mountInBody(MenuCheckboxGroupSyncFixture, props);
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

function click(testId: string) {
	getNode(testId).click();
	flushSync();
}

describe("Menu checkbox group synchronization", () => {
	test("group value drives checked state", () => {
		renderFixture({
			value: ["alpha"],
			dynamicValue: "alpha",
		});

		expect(readOutput("group-value")).toBe("[alpha]");
		expect(readOutput("dynamic-checked")).toBe("true");
		expect(readOutput("beta-checked")).toBe("false");
		expect(getNode("dynamic").getAttribute("aria-checked")).toBe("true");
		expect(getNode("beta").getAttribute("aria-checked")).toBe("false");
	});

	test("external group value changes update bound item checked state", () => {
		const { component } = renderFixture({
			value: ["alpha"],
			dynamicValue: "alpha",
		});

		component.setValue(["beta"]);
		flushSync();

		expect(readOutput("group-value")).toBe("[beta]");
		expect(readOutput("dynamic-checked")).toBe("false");
		expect(readOutput("beta-checked")).toBe("true");
	});

	test("toggling grouped items updates group value and fires menu select", () => {
		renderFixture({
			value: ["alpha"],
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
		expect(readOutput("select-count")).toBe("1");
	});

	test("dynamic item value changes resync checked state from group value", () => {
		const { component } = renderFixture({
			value: ["beta"],
			dynamicValue: "alpha",
		});

		expect(readOutput("dynamic-checked")).toBe("false");

		component.setDynamicValue("beta");
		flushSync();

		expect(readOutput("dynamic-checked")).toBe("true");
	});

	test("standalone menu checkbox item keeps explicit checked behavior", () => {
		renderFixture({
			standaloneChecked: true,
		});

		expect(readOutput("standalone-checked")).toBe("true");
		expect(getNode("standalone").getAttribute("aria-checked")).toBe("true");

		click("standalone");

		expect(readOutput("standalone-checked")).toBe("false");
		expect(getNode("standalone").getAttribute("aria-checked")).toBe("false");
	});
});
