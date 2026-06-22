import { flushSync, mount, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import PopoverCloseDelayFixture from "./popover-close-delay.fixture.svelte";

type FixtureProps = Partial<{
	open: boolean;
	closeDelay: number;
	openDelay: number;
	openOnHover: boolean;
}>;

function renderFixture(props: FixtureProps = {}) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(PopoverCloseDelayFixture, { props, target });
	flushSync();

	return { component, target };
}

function cleanup(component: ReturnType<typeof mount>) {
	unmount(component);
	document.body.innerHTML = "";
}

function readOpen() {
	const node = document.body.querySelector('[data-testid="open"]');
	if (!node) throw new Error("Expected open readout to render");
	return node.textContent;
}

function getTrigger() {
	const node = document.body.querySelector<HTMLElement>('[data-testid="trigger"]');
	if (!node) throw new Error("Expected trigger to render");
	return node;
}

function getContent() {
	const node = document.body.querySelector<HTMLElement>('[data-testid="content"]');
	if (!node) throw new Error("Expected content to render");
	return node;
}

function createPointerEvent(
	type: string,
	init: MouseEventInit & { pointerType?: string } = {}
) {
	const event = new MouseEvent(type, {
		bubbles: true,
		cancelable: true,
		clientX: init.clientX ?? 0,
		clientY: init.clientY ?? 0,
		relatedTarget: init.relatedTarget,
	});

	Object.defineProperty(event, "pointerType", {
		configurable: true,
		value: init.pointerType ?? "mouse",
	});

	return event;
}

function pointerEnter(node: HTMLElement) {
	node.dispatchEvent(createPointerEvent("pointerenter"));
	flushSync();
}

function beginHoverClose() {
	const trigger = getTrigger();
	const content = getContent();

	trigger.dispatchEvent(
		createPointerEvent("pointerleave", {
			clientX: 100,
			clientY: 100,
			relatedTarget: document.body,
		})
	);
	flushSync();

	document.dispatchEvent(
		createPointerEvent("pointermove", {
			clientX: 1000,
			clientY: 1000,
			relatedTarget: content,
		})
	);
	flushSync();
}

function advance(ms: number) {
	vi.advanceTimersByTime(ms);
	flushSync();
}

afterEach(() => {
	vi.useRealTimers();
	document.body.innerHTML = "";
});

describe("Popover closeDelay", () => {
	test("initial closeDelay controls hover close timing", () => {
		vi.useFakeTimers();
		const { component } = renderFixture({ closeDelay: 200 });

		try {
			pointerEnter(getTrigger());
			expect(readOpen()).toBe("open");

			beginHoverClose();
			advance(199);
			expect(readOpen()).toBe("open");

			advance(1);
			expect(readOpen()).toBe("closed");
		} finally {
			cleanup(component);
		}
	});

	test("dynamic closeDelay changes affect future hover close timers", () => {
		vi.useFakeTimers();
		const { component } = renderFixture({ closeDelay: 100 });

		try {
			component.setCloseDelay(300);
			flushSync();

			pointerEnter(getTrigger());
			expect(readOpen()).toBe("open");

			beginHoverClose();
			advance(299);
			expect(readOpen()).toBe("open");

			advance(1);
			expect(readOpen()).toBe("closed");
		} finally {
			cleanup(component);
		}
	});

	test("changing closeDelay while a close timer is pending does not reschedule that timer", () => {
		vi.useFakeTimers();
		const { component } = renderFixture({ closeDelay: 200 });

		try {
			pointerEnter(getTrigger());
			expect(readOpen()).toBe("open");

			beginHoverClose();
			component.setCloseDelay(50);
			flushSync();

			advance(199);
			expect(readOpen()).toBe("open");

			advance(1);
			expect(readOpen()).toBe("closed");
		} finally {
			cleanup(component);
		}
	});

	test("undefined closeDelay falls back to the trigger default for future hover close timers", () => {
		vi.useFakeTimers();
		const { component } = renderFixture({ closeDelay: 100 });

		try {
			component.setCloseDelay(undefined);
			flushSync();

			pointerEnter(getTrigger());
			expect(readOpen()).toBe("open");

			beginHoverClose();
			advance(299);
			expect(readOpen()).toBe("open");

			advance(1);
			expect(readOpen()).toBe("closed");
		} finally {
			cleanup(component);
		}
	});

	test("click popovers ignore hover close delay", () => {
		vi.useFakeTimers();
		const { component } = renderFixture({ closeDelay: 500, openOnHover: false });

		try {
			getTrigger().click();
			flushSync();
			expect(readOpen()).toBe("open");

			getTrigger().click();
			flushSync();
			expect(readOpen()).toBe("closed");
		} finally {
			cleanup(component);
		}
	});
});
