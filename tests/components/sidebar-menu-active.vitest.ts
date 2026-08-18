import { flushSync } from "svelte";
import { describe, expect, test } from "vitest";
import { el, render } from "../harness.js";
import SidebarMenuActiveFixture from "./sidebar-menu-active.fixture.svelte";

describe("Sidebar menu active state", () => {
	test("updates data-active when isActive changes", () => {
		const { component } = render(SidebarMenuActiveFixture);

		expect(el("accordion").dataset.active).toBe("true");
		expect(el("card").dataset.active).toBe("false");

		component.setActive("card");
		flushSync();

		expect(el("accordion").dataset.active).toBe("false");
		expect(el("card").dataset.active).toBe("true");
	});
});
