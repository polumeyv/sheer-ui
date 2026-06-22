import { flushSync, mount, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import CollapsibleBeforematchFixture from "./collapsible-beforematch.fixture.svelte";

function renderFixture(props: { hiddenUntilFound?: boolean; open?: boolean } = {}) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(CollapsibleBeforematchFixture, { props, target });
	flushSync();

	return { component, target };
}

function getContent() {
	const node = document.body.querySelector<HTMLElement>('[data-testid="content"]');
	if (!node) throw new Error("Expected collapsible content to render");
	return node;
}

function readOpen() {
	const node = document.body.querySelector('[data-testid="open"]');
	if (!node) throw new Error("Expected collapsible open readout to render");
	return node.textContent;
}

function dispatchBeforeMatch(node: HTMLElement) {
	node.dispatchEvent(new Event("beforematch"));
	flushSync();
}

function runAnimationFrame() {
	vi.advanceTimersByTime(16);
	flushSync();
}

afterEach(() => {
	vi.useRealTimers();
	document.body.innerHTML = "";
});

describe("Collapsible beforematch content lifecycle", () => {
	test("hiddenUntilFound content opens after beforematch on the next animation frame", () => {
		vi.useFakeTimers();
		const { component } = renderFixture({ hiddenUntilFound: true });

		try {
			expect(readOpen()).toBe("closed");

			dispatchBeforeMatch(getContent());
			expect(readOpen()).toBe("closed");

			runAnimationFrame();
			expect(readOpen()).toBe("open");
		} finally {
			unmount(component);
		}
	});

	test("hiddenUntilFound=false content does not open from beforematch", () => {
		vi.useFakeTimers();
		const { component } = renderFixture({ hiddenUntilFound: false });

		try {
			dispatchBeforeMatch(getContent());
			runAnimationFrame();

			expect(readOpen()).toBe("closed");
		} finally {
			unmount(component);
		}
	});

	test("content cleanup removes stale beforematch behavior", () => {
		vi.useFakeTimers();
		const { component } = renderFixture({ hiddenUntilFound: true });

		try {
			const staleContent = getContent();
			component.hideContent();
			flushSync();

			dispatchBeforeMatch(staleContent);
			runAnimationFrame();

			expect(readOpen()).toBe("closed");
		} finally {
			unmount(component);
		}
	});
});
