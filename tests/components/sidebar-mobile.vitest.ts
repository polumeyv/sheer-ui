import { flushSync, mount, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ResizeObserverStub } from "../resize-observer-stub";

// The sidebar reads the viewport off the desktop panel's own computed display, not a media
// query. jsdom cascades stylesheets but evaluates no media queries, so a plain rule under a
// root class stands in for `hidden md:block` below md; dropping the class is the widening.
function installMobileViewport() {
	const style = document.createElement("style");
	style.textContent = '.phone [data-slot="sidebar"]:not([data-mobile]) { display: none; }';
	document.head.append(style);
	document.documentElement.classList.add("phone");
}

// The panel's attachment coalesces observer reports into the next frame.
const layoutSettled = async () => {
	ResizeObserverStub.report();
	await new Promise(requestAnimationFrame);
	flushSync();
};

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

async function renderFixture(props: { twoRoots?: boolean } = {}) {
	installMobileViewport();
	const { default: SidebarDesktopFixture } = await import("./sidebar-desktop.fixture.svelte");

	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(SidebarDesktopFixture, { target, props });
	flushSync();

	return { component };
}

const one = <T extends Element = HTMLElement>(selector: string) => {
	const node = document.body.querySelector<T>(selector);
	if (!node) throw new Error(`Expected ${selector} to render`);
	return node;
};
const getMobileSidebar = () => one<HTMLDialogElement>('[data-mobile="true"]');
const getTrigger = () => one<HTMLButtonElement>('[data-testid="trigger"]');
const getDesktopOpenReadout = () => one<HTMLOutputElement>('[data-testid="open"]');
const getInner = () => one('[data-slot="sidebar-inner"]');

beforeEach(() => {
	installDialogMethods();
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

	test("opening the sheet re-homes content a crossing the observer never saw, before showModal picks the focus", async () => {
		const { component } = await renderFixture();

		try {
			// No observer report at all: a display:none panel gets no initial observation, and a
			// crossing under a display:none ancestor reports nothing either.
			expect(getInner().closest('[data-slot="sidebar-container"]')).not.toBeNull();

			// showModal() takes the initial focus from what the dialog holds at that moment.
			const heldAtShowModal: boolean[] = [];
			const showModal = HTMLDialogElement.prototype.showModal;
			vi.spyOn(HTMLDialogElement.prototype, "showModal").mockImplementation(function (this: HTMLDialogElement) {
				heldAtShowModal.push(this.contains(getInner()));
				showModal.call(this);
			});

			getTrigger().click();
			flushSync();

			expect(getMobileSidebar().open).toBe(true);
			expect(heldAtShowModal).toEqual([true]);
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

	test("two Roots in one Provider each move their own content into their own sheet, and back", async () => {
		const { component } = await renderFixture({ twoRoots: true });

		try {
			await layoutSettled();
			const [sheetLeft, sheetRight] = document.body.querySelectorAll<HTMLDialogElement>('dialog[data-mobile="true"]');
			expect(sheetRight).toBeDefined();
			expect(one('[data-testid="button-left"]').closest("dialog")).toBe(sheetLeft);
			expect(one('[data-testid="button-right"]').closest("dialog")).toBe(sheetRight);

			getTrigger().click();
			flushSync();
			expect(sheetLeft!.open && sheetRight!.open).toBe(true);

			document.documentElement.classList.remove("phone");
			await layoutSettled();
			expect(one('[data-testid="button-left"]').closest('[data-testid="root-left"]')).not.toBeNull();
			expect(one('[data-testid="button-right"]').closest('[data-testid="root-right"]')).not.toBeNull();
			expect(sheetLeft!.open || sheetRight!.open).toBe(false);
		} finally {
			unmount(component);
		}
	});
});
