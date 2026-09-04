import { flushSync, mount, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// The sidebar reads the viewport off the desktop panel's own computed display, not a media
// query. jsdom cascades stylesheets but evaluates no media queries, so a plain rule under a
// root class stands in for `hidden md:block` below md; dropping the class is the widening.
function installMobileViewport() {
	const style = document.createElement("style");
	style.textContent = '.phone [data-slot="sidebar"]:not([data-mobile]) { display: none; }';
	document.head.append(style);
	document.documentElement.classList.add("phone");
}

class ResizeObserverStub {
	static instances: ResizeObserverStub[] = [];
	readonly targets: Element[] = [];
	observe(node: Element) {
		this.targets.push(node);
	}
	disconnect() {}
	constructor(readonly callback: ResizeObserverCallback) {
		ResizeObserverStub.instances.push(this);
	}
	trigger() {
		const entries = this.targets.map((target) => ({ target })) as unknown as ResizeObserverEntry[];
		this.callback(entries, this as unknown as ResizeObserver);
	}
}

// A real observer reports once on observe(); the stub does not, so the tests report for it. The
// panel's attachment coalesces reports into the next frame.
const layoutSettled = async () => {
	for (const observer of ResizeObserverStub.instances) observer.trigger();
	await new Promise(requestAnimationFrame);
	flushSync();
};

function getInner() {
	const node = document.body.querySelector<HTMLElement>('[data-slot="sidebar-inner"]');
	if (!node) throw new Error("Expected the sidebar content to render");
	return node;
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
	ResizeObserverStub.instances = [];
	Object.defineProperty(window, "ResizeObserver", {
		configurable: true,
		writable: true,
		value: ResizeObserverStub,
	});
});

afterEach(() => {
	document.body.innerHTML = "";
	document.head.innerHTML = "";
	document.documentElement.classList.remove("phone");
	vi.restoreAllMocks();
});

describe("Sidebar mobile behavior", () => {
	test("the one content tree renders in the panel and moves into the sheet once laid out", async () => {
		const { component } = await renderFixture();

		try {
			// Server markup and the first paint: content in the panel, the sheet an empty shell.
			expect(getInner().closest('[data-slot="sidebar-container"]')).not.toBeNull();
			expect(document.body.querySelectorAll('[data-slot="sidebar-menu-button"]')).toHaveLength(1);

			await layoutSettled();
			expect(getInner().closest('[data-mobile="true"]')).toBe(getMobileSidebar());
			expect(document.body.querySelectorAll('[data-slot="sidebar-menu-button"]')).toHaveLength(1);
		} finally {
			unmount(component);
		}
	});

	test("opening the sheet re-homes content a crossing the observer never saw", async () => {
		const { component } = await renderFixture();

		try {
			// No observer report at all: the crossing happened under a display:none ancestor.
			expect(getInner().closest('[data-slot="sidebar-container"]')).not.toBeNull();

			getTrigger().click();
			flushSync();

			expect(getMobileSidebar().open).toBe(true);
			expect(getInner().closest('[data-mobile="true"]')).toBe(getMobileSidebar());
		} finally {
			unmount(component);
		}
	});

	test("trigger toggles mobile sheet state without changing desktop open state", async () => {
		const { component } = await renderFixture();

		try {
			await layoutSettled();
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

	test("an open sheet closes and hands the content back when CSS displays the desktop panel", async () => {
		const { component } = await renderFixture();

		try {
			await layoutSettled();
			getTrigger().click();
			flushSync();
			expect(getMobileSidebar().open).toBe(true);

			// Past the breakpoint `hidden md:block` lays the panel out and its observer reports.
			// The sheet closes in that same report, not after the settle-deferred exit slide.
			document.documentElement.classList.remove("phone");
			await layoutSettled();

			expect(getMobileSidebar().open).toBe(false);
			expect(getInner().closest('[data-slot="sidebar-container"]')).not.toBeNull();
			expect(getDesktopOpenReadout().textContent).toBe("true");

			// Desktop now: the trigger writes the persisted bit.
			getTrigger().click();
			flushSync();
			expect(getDesktopOpenReadout().textContent).toBe("false");
			expect(getMobileSidebar().open).toBe(false);
		} finally {
			unmount(component);
		}
	});
});
