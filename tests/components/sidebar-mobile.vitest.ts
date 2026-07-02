import { flushSync, mount, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

function installMobileViewport() {
	Object.defineProperty(window, "innerWidth", {
		configurable: true,
		value: 375,
	});

	Object.defineProperty(window, "matchMedia", {
		configurable: true,
		value: (query: string) => ({
			matches: query.includes("max-width"),
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

function installDialogMethods() {
	Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
		configurable: true,
		value() {
			this.open = true;
		},
	});

	Object.defineProperty(HTMLDialogElement.prototype, "close", {
		configurable: true,
		value() {
			this.open = false;
			this.dispatchEvent(new Event("close"));
		},
	});
}

async function renderFixture() {
	installMobileViewport();
	const { default: SidebarDesktopFixture } = await import("./sidebar-desktop.fixture.svelte");

	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(SidebarDesktopFixture, { target });
	flushSync();

	return { component };
}

function getMobileSidebar() {
	const node = document.body.querySelector<HTMLDialogElement>('[data-mobile="true"]');
	if (!node) throw new Error("Expected mobile sidebar to render");
	return node;
}

function getTrigger() {
	const node = document.body.querySelector<HTMLButtonElement>('[data-testid="trigger"]');
	if (!node) throw new Error("Expected sidebar trigger to render");
	return node;
}

function getDesktopOpenReadout() {
	const node = document.body.querySelector<HTMLOutputElement>('[data-testid="open"]');
	if (!node) throw new Error("Expected desktop open readout to render");
	return node;
}

beforeEach(() => {
	installDialogMethods();
});

afterEach(() => {
	document.body.innerHTML = "";
	vi.restoreAllMocks();
});

describe("Sidebar mobile behavior", () => {
	test("trigger toggles mobile sheet state without changing desktop open state", async () => {
		const { component } = await renderFixture();

		try {
			expect(getMobileSidebar().open).toBe(false);
			expect(getDesktopOpenReadout().textContent).toBe("true");

			getTrigger().click();
			flushSync();

			expect(getMobileSidebar().open).toBe(true);
			expect(getDesktopOpenReadout().textContent).toBe("true");
		} finally {
			unmount(component);
		}
	});
});
