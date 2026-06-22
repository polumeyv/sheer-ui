import { flushSync, mount, unmount } from "svelte";
import { afterEach, describe, expect, test } from "vitest";

function installDesktopViewport() {
	Object.defineProperty(window, "matchMedia", {
		configurable: true,
		value: (query: string) => ({
			matches: query.includes("max-width") ? false : true,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {},
			removeListener: () => {},
			dispatchEvent: () => false,
		}),
	});
}

async function renderFixture() {
	installDesktopViewport();
	const { default: SidebarMenuActiveFixture } = await import("./sidebar-menu-active.fixture.svelte");

	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(SidebarMenuActiveFixture, { target });
	flushSync();

	return { component };
}

function getItem(testId: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected ${testId} menu item to render`);
	return node;
}

afterEach(() => {
	document.body.innerHTML = "";
});

describe("Sidebar menu active state", () => {
	test("updates data-active when isActive changes", async () => {
		const { component } = await renderFixture();

		try {
			expect(getItem("accordion").dataset.active).toBe("true");
			expect(getItem("card").dataset.active).toBe("false");

			component.setActive("card");
			flushSync();

			expect(getItem("accordion").dataset.active).toBe("false");
			expect(getItem("card").dataset.active).toBe("true");
		} finally {
			unmount(component);
		}
	});
});
