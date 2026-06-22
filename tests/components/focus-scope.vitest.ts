import { flushSync, mount, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import FocusScopeFixture from "./focus-scope.fixture.svelte";

function renderFixture(
	props: Partial<{
		enabled: boolean;
		trapFocus: boolean;
		onOpenAutoFocus: (event: Event) => void;
		onCloseAutoFocus: (event: Event) => void;
	}> = {}
) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(FocusScopeFixture, { props, target });
	flushSync();

	return { component, target };
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

function runAnimationFrame() {
	vi.advanceTimersByTime(16);
	flushSync();
}

afterEach(() => {
	vi.useRealTimers();
	document.body.innerHTML = "";
});

describe("FocusScope lifecycle", () => {
	test("enabled scope mounts on the container and runs open autofocus", () => {
		vi.useFakeTimers();
		const onOpenAutoFocus = vi.fn();
		const { component } = renderFixture({ enabled: true, onOpenAutoFocus });

		try {
			expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
			runAnimationFrame();
			expect(document.activeElement).toBe(getScope());
		} finally {
			unmount(component);
		}
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

		try {
			getBeforeButton().focus();
			expect(onOpenAutoFocus).not.toHaveBeenCalled();

			component.setEnabled(true);
			flushSync();
			expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
			runAnimationFrame();
			expect(document.activeElement).toBe(getScope());

			component.setEnabled(false);
			flushSync();
			expect(onCloseAutoFocus).toHaveBeenCalledTimes(1);
			expect(document.activeElement).toBe(getBeforeButton());
		} finally {
			unmount(component);
		}
	});

	test("unmount cleanup runs close autofocus", () => {
		vi.useFakeTimers();
		const onCloseAutoFocus = vi.fn();
		const { component } = renderFixture({ enabled: true, onCloseAutoFocus });

		try {
			runAnimationFrame();
			component.hideScope();
			flushSync();

			expect(onCloseAutoFocus).toHaveBeenCalledTimes(1);
		} finally {
			unmount(component);
		}
	});
});
