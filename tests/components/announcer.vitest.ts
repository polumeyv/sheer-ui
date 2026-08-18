import { describe, expect, test, vi, afterEach } from "vitest";
import { getAnnouncer } from "../../src/lib/internal/date-time/announcer.js";

afterEach(() => {
	Object.defineProperty(document, "ariaNotify", {
		configurable: true,
		value: undefined,
	});
});

describe("date-time announcer", () => {
	test("uses ariaNotify when the document supports it", () => {
		const ariaNotify = vi.fn();
		Object.defineProperty(document, "ariaNotify", {
			configurable: true,
			value: ariaNotify,
		});

		const announcer = getAnnouncer(document);
		announcer.announce(null, "assertive");
		announcer.announce(42, "polite");

		expect(ariaNotify).toHaveBeenNthCalledWith(1, "Empty", { priority: "high" });
		expect(ariaNotify).toHaveBeenNthCalledWith(2, "42", { priority: "normal" });
		expect(document.querySelector("[data-bits-announcer]")).toBeNull();
	});

	test("falls back to hidden live regions", () => {
		const announcer = getAnnouncer(document);

		const politeTimeout = announcer.announce(" March 2030 ", "polite");
		const firstAssertiveTimeout = announcer.announce("First", "assertive");
		const secondAssertiveTimeout = announcer.announce("Second", "assertive");

		const root = document.querySelector("[data-bits-announcer]");
		const politeLog = root?.querySelector('[aria-live="polite"]');
		const assertiveLog = root?.querySelector('[aria-live="assertive"]');

		expect(root).toBeInstanceOf(HTMLElement);
		expect(politeLog?.textContent).toBe("March 2030");
		expect(assertiveLog?.textContent).toBe("Second");

		if (politeTimeout) clearTimeout(politeTimeout);
		if (firstAssertiveTimeout) clearTimeout(firstAssertiveTimeout);
		if (secondAssertiveTimeout) clearTimeout(secondAssertiveTimeout);
	});
});
