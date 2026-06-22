import { flushSync, mount, unmount } from "svelte";
import { describe, expect, test } from "vitest";
import MenuCheckboxGroupSyncFixture from "./menu-checkbox-group-sync.fixture.svelte";

type FixtureProps = Partial<{
	value: string[];
	dynamicValue: string;
	standaloneChecked: boolean;
}>;

function renderFixture(props: FixtureProps = {}) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(MenuCheckboxGroupSyncFixture, { props, target });
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

function click(testId: string) {
	getNode(testId).click();
	flushSync();
}

function cleanup(component: ReturnType<typeof mount>) {
	unmount(component);
	document.body.innerHTML = "";
}

describe("Menu checkbox group synchronization", () => {
	test("group value drives checked state", () => {
		const { component } = renderFixture({
			value: ["alpha"],
			dynamicValue: "alpha",
		});

		try {
			expect(readOutput("group-value")).toBe("[alpha]");
			expect(readOutput("dynamic-checked")).toBe("true");
			expect(readOutput("beta-checked")).toBe("false");
			expect(getNode("dynamic").getAttribute("aria-checked")).toBe("true");
			expect(getNode("beta").getAttribute("aria-checked")).toBe("false");
		} finally {
			cleanup(component);
		}
	});

	test("external group value changes update bound item checked state", () => {
		const { component } = renderFixture({
			value: ["alpha"],
			dynamicValue: "alpha",
		});

		try {
			component.setValue(["beta"]);
			flushSync();

			expect(readOutput("group-value")).toBe("[beta]");
			expect(readOutput("dynamic-checked")).toBe("false");
			expect(readOutput("beta-checked")).toBe("true");
		} finally {
			cleanup(component);
		}
	});

	test("toggling grouped items updates group value and fires menu select", () => {
		const { component } = renderFixture({
			value: ["alpha"],
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
			expect(readOutput("checked-change-count")).toBe("1");
			expect(readOutput("select-count")).toBe("1");
		} finally {
			cleanup(component);
		}
	});

	test("dynamic item value changes resync checked state from group value", () => {
		const { component } = renderFixture({
			value: ["beta"],
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

	test("standalone menu checkbox item keeps explicit checked behavior", () => {
		const { component } = renderFixture({
			standaloneChecked: true,
		});

		try {
			expect(readOutput("standalone-checked")).toBe("true");
			expect(getNode("standalone").getAttribute("aria-checked")).toBe("true");

			click("standalone");

			expect(readOutput("standalone-checked")).toBe("false");
			expect(getNode("standalone").getAttribute("aria-checked")).toBe("false");
		} finally {
			cleanup(component);
		}
	});
});
