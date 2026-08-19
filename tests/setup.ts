import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "./harness.js";

// Module scope, not a hook: component module scripts construct a MediaQuery while being imported.
Object.defineProperty(window, "matchMedia", {
	configurable: true,
	value: (query: string) => ({
		matches: !query.includes("max-width"),
		media: query,
		onchange: null,
		addEventListener: () => {},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {},
		dispatchEvent: () => false,
	}),
});

class ResizeObserverStub {
	observe() {}
	unobserve() {}
	disconnect() {}
}

Object.defineProperty(window, "ResizeObserver", { configurable: true, value: ResizeObserverStub });
Object.defineProperty(globalThis, "ResizeObserver", { configurable: true, value: ResizeObserverStub });

// jsdom runs no layout, so it ships no scrollIntoView at all.
Object.defineProperty(Element.prototype, "scrollIntoView", { configurable: true, value: () => {} });

// Per test, not module scope: suites assert showModal/close call counts.
beforeEach(() => {
	Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
		configurable: true,
		value: vi.fn(function (this: HTMLDialogElement) {
			this.open = true;
		}),
	});

	Object.defineProperty(HTMLDialogElement.prototype, "close", {
		configurable: true,
		value: vi.fn(function (this: HTMLDialogElement) {
			if (!this.open) return;
			this.open = false;
			this.dispatchEvent(new Event("close"));
		}),
	});
});

afterEach(() => {
	cleanup();
});
