import { flushSync } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { mountInBody } from "../mount";
import FocusScopeFixture from "./focus-scope.fixture.svelte";

function renderFixture(
	props: Partial<{
		enabled: boolean;
		trapFocus: boolean;
		onOpenAutoFocus: (event: Event) => void;
		onCloseAutoFocus: (event: Event) => void;
	}> = {}
) {
	return mountInBody(FocusScopeFixture, props);
}

function getBeforeButton() {
	const node = document.body.querySelector<HTMLButtonElement>('[data-testid="before"]');
	if (!node) throw new Error("Expected before button to render");
	return node;
}

function getScope() {
	const node = document.body.querySelector<HTMLElement>('[data-testid="scope"]');
	if (!node) throw new Error("Expected focus scope to render");
	return node;
}

function getInsideButton() {
	const node = document.body.querySelector<HTMLButtonElement>('[data-testid="inside"]');
	if (!node) throw new Error("Expected inside button to render");
	return node;
}

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
		renderFixture({ enabled: true, onOpenAutoFocus });

		expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
		runAnimationFrame();
		expect(document.activeElement).toBe(getInsideButton());
	});

	test("disabled scope does not mount until enabled and tears down when disabled", () => {
		vi.useFakeTimers();
		const onOpenAutoFocus = vi.fn();
		const onCloseAutoFocus = vi.fn();
		const { component } = renderFixture({
			enabled: false,
			onOpenAutoFocus,
			onCloseAutoFocus,
		});

		getBeforeButton().focus();
		expect(onOpenAutoFocus).not.toHaveBeenCalled();

		component.setEnabled(true);
		flushSync();
		expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
		runAnimationFrame();
		expect(document.activeElement).toBe(getInsideButton());

		component.setEnabled(false);
		flushSync();
		expect(onCloseAutoFocus).toHaveBeenCalledTimes(1);
		expect(document.activeElement).toBe(getBeforeButton());
	});

	test("unmount cleanup runs close autofocus", () => {
		vi.useFakeTimers();
		const onCloseAutoFocus = vi.fn();
		const { component } = renderFixture({ enabled: true, onCloseAutoFocus });

		runAnimationFrame();
		component.hideScope();
		flushSync();

		expect(onCloseAutoFocus).toHaveBeenCalledTimes(1);
	});

	test("trap listeners respond to trapFocus changes while mounted", () => {
		vi.useFakeTimers();
		const { component } = renderFixture({ enabled: true, trapFocus: false });

		runAnimationFrame();
		getInsideButton().focus();
		getBeforeButton().focus();
		expect(document.activeElement).toBe(getBeforeButton());

		component.setTrapFocus(true);
		flushSync();

		getInsideButton().focus();
		getBeforeButton().focus();
		expect(getScope().contains(document.activeElement)).toBe(true);
	});
});
