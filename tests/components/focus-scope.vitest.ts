import { flushSync } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { el, render } from "../harness.js";
import FocusScopeFixture from "./focus-scope.fixture.svelte";

function runAnimationFrame() {
	vi.advanceTimersByTime(16);
	flushSync();
}

afterEach(() => {
	vi.useRealTimers();
});

describe("FocusScope lifecycle", () => {
	test("enabled scope mounts on the container and runs open autofocus", () => {
		vi.useFakeTimers();
		const onOpenAutoFocus = vi.fn();
		render(FocusScopeFixture, { enabled: true, onOpenAutoFocus });

		expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
		runAnimationFrame();
		expect(document.activeElement).toBe(el("inside"));
	});

	test("disabled scope does not mount until enabled and tears down when disabled", () => {
		vi.useFakeTimers();
		const onOpenAutoFocus = vi.fn();
		const onCloseAutoFocus = vi.fn();
		const { component } = render(FocusScopeFixture, {
			enabled: false,
			onOpenAutoFocus,
			onCloseAutoFocus,
		});

		el("before").focus();
		expect(onOpenAutoFocus).not.toHaveBeenCalled();

		component.setEnabled(true);
		flushSync();
		expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
		runAnimationFrame();
		expect(document.activeElement).toBe(el("inside"));

		component.setEnabled(false);
		flushSync();
		expect(onCloseAutoFocus).toHaveBeenCalledTimes(1);
		expect(document.activeElement).toBe(el("before"));
	});

	test("unmount cleanup runs close autofocus", () => {
		vi.useFakeTimers();
		const onCloseAutoFocus = vi.fn();
		const { component } = render(FocusScopeFixture, { enabled: true, onCloseAutoFocus });

		runAnimationFrame();
		component.hideScope();
		flushSync();

		expect(onCloseAutoFocus).toHaveBeenCalledTimes(1);
	});

	test("trap listeners respond to trapFocus changes while mounted", () => {
		vi.useFakeTimers();
		const { component } = render(FocusScopeFixture, { enabled: true, trapFocus: false });

		runAnimationFrame();
		el("inside").focus();
		el("before").focus();
		expect(document.activeElement).toBe(el("before"));

		component.setTrapFocus(true);
		flushSync();

		el("inside").focus();
		el("before").focus();
		expect(el("scope").contains(document.activeElement)).toBe(true);
	});
});
