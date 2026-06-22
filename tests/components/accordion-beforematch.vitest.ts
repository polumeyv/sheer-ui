import { flushSync, mount, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import AccordionBeforematchFixture from "./accordion-beforematch.fixture.svelte";

function renderFixture(props: { hiddenUntilFound?: boolean; value?: string } = {}) {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(AccordionBeforematchFixture, { props, target });
	flushSync();

	return { component, target };
}

function getContent() {
	const node = document.body.querySelector<HTMLElement>('[data-testid="content"]');
	if (!node) throw new Error("Expected accordion content to render");
	return node;
}

function readValue() {
	const node = document.body.querySelector('[data-testid="value"]');
	if (!node) throw new Error("Expected accordion value readout to render");
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

describe("Accordion beforematch content lifecycle", () => {
	test("hiddenUntilFound content opens its item after beforematch on the next animation frame", () => {
		vi.useFakeTimers();
		const { component } = renderFixture({ hiddenUntilFound: true });

		try {
			expect(readValue()).toBe("");

			dispatchBeforeMatch(getContent());
			expect(readValue()).toBe("");

			runAnimationFrame();
			expect(readValue()).toBe("alpha");
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

			expect(readValue()).toBe("");
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

			expect(readValue()).toBe("");
		} finally {
			unmount(component);
		}
	});
});
