// Two Roots in one Provider (a left and a right sidebar): each panel must move its own content
// into its own sheet, and the trigger must still read the viewport with either panel mounted.
import { flushSync, mount, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

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

const layoutSettled = async () => {
	for (const observer of ResizeObserverStub.instances) observer.trigger();
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

async function renderFixture() {
	const style = document.createElement("style");
	style.textContent = '.phone [data-slot="sidebar"]:not([data-mobile]) { display: none; }';
	document.head.append(style);
	document.documentElement.classList.add("phone");
	const { default: Fixture } = await import("./sidebar-two-roots.fixture.svelte");
	const target = document.createElement("div");
	document.body.append(target);
	const component = mount(Fixture, { target });
	flushSync();
	return { component };
}

const one = <T extends Element>(selector: string) => {
	const node = document.body.querySelector<T>(selector);
	if (!node) throw new Error(`Expected ${selector} to render`);
	return node;
};

beforeEach(() => {
	installDialogMethods();
	ResizeObserverStub.instances = [];
	Object.defineProperty(window, "ResizeObserver", { configurable: true, writable: true, value: ResizeObserverStub });
});

afterEach(() => {
	document.body.innerHTML = "";
	document.head.innerHTML = "";
	document.documentElement.classList.remove("phone");
});

describe("Sidebar with two Roots in one Provider", () => {
	test("each panel moves its own content into its own sheet, and back", async () => {
		const { component } = await renderFixture();

		try {
			await layoutSettled();
			const sheets = document.body.querySelectorAll<HTMLDialogElement>('dialog[data-mobile="true"]');
			expect(sheets).toHaveLength(2);
			const [sheetLeft, sheetRight] = sheets;
			expect(one('[data-testid="button-left"]').closest("dialog")).toBe(sheetLeft);
			expect(one('[data-testid="button-right"]').closest("dialog")).toBe(sheetRight);

			document.documentElement.classList.remove("phone");
			await layoutSettled();
			expect(one('[data-testid="button-left"]').closest('[data-testid="root-left"]')).not.toBeNull();
			expect(one('[data-testid="button-right"]').closest('[data-testid="root-right"]')).not.toBeNull();
		} finally {
			unmount(component);
		}
	});

	test("the trigger opens both sheets on a phone and collapses both panels on desktop", async () => {
		const { component } = await renderFixture();

		try {
			await layoutSettled();
			one<HTMLButtonElement>('[data-testid="trigger"]').click();
			flushSync();
			for (const sheet of document.body.querySelectorAll<HTMLDialogElement>('dialog[data-mobile="true"]')) {
				expect(sheet.open).toBe(true);
			}

			document.documentElement.classList.remove("phone");
			await layoutSettled();
			one<HTMLButtonElement>('[data-testid="trigger"]').click();
			flushSync();
			for (const panel of document.body.querySelectorAll<HTMLElement>('[data-slot="sidebar"]:not([data-mobile])')) {
				expect(panel.dataset.state).toBe("collapsed");
			}
		} finally {
			unmount(component);
		}
	});
});
