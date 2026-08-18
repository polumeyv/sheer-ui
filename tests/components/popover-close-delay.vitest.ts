import { flushSync } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { el, render, text } from "../harness.js";
import PopoverCloseDelayFixture from "./popover-close-delay.fixture.svelte";

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
	const trigger = el("trigger");
	const content = el("content");

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
});

describe("Popover closeDelay", () => {
	test("initial closeDelay controls hover close timing", () => {
		vi.useFakeTimers();
		render(PopoverCloseDelayFixture, { closeDelay: 200 });

		pointerEnter(el("trigger"));
		expect(text("open")).toBe("open");

		beginHoverClose();
		advance(199);
		expect(text("open")).toBe("open");

		advance(1);
		expect(text("open")).toBe("closed");
	});

	test("dynamic closeDelay changes affect future hover close timers", () => {
		vi.useFakeTimers();
		const { component } = render(PopoverCloseDelayFixture, { closeDelay: 100 });

		component.setCloseDelay(300);
		flushSync();

		pointerEnter(el("trigger"));
		expect(text("open")).toBe("open");

		beginHoverClose();
		advance(299);
		expect(text("open")).toBe("open");

		advance(1);
		expect(text("open")).toBe("closed");
	});

	test("changing closeDelay while a close timer is pending does not reschedule that timer", () => {
		vi.useFakeTimers();
		const { component } = render(PopoverCloseDelayFixture, { closeDelay: 200 });

		pointerEnter(el("trigger"));
		expect(text("open")).toBe("open");

		beginHoverClose();
		component.setCloseDelay(50);
		flushSync();

		advance(199);
		expect(text("open")).toBe("open");

		advance(1);
		expect(text("open")).toBe("closed");
	});

	test("undefined closeDelay falls back to the trigger default for future hover close timers", () => {
		vi.useFakeTimers();
		const { component } = render(PopoverCloseDelayFixture, { closeDelay: 100 });

		component.setCloseDelay(undefined);
		flushSync();

		pointerEnter(el("trigger"));
		expect(text("open")).toBe("open");

		beginHoverClose();
		advance(299);
		expect(text("open")).toBe("open");

		advance(1);
		expect(text("open")).toBe("closed");
	});

	test("click popovers ignore hover close delay", () => {
		vi.useFakeTimers();
		render(PopoverCloseDelayFixture, { closeDelay: 500, openOnHover: false });

		el("trigger").click();
		flushSync();
		expect(text("open")).toBe("open");

		el("trigger").click();
		flushSync();
		expect(text("open")).toBe("closed");
	});
});
