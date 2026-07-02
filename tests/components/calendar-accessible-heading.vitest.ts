import { afterEach, describe, expect, test } from "vitest";
import { createAccessibleHeading } from "../../src/lib/internal/date-time/calendar-helpers.svelte.js";

afterEach(() => {
	document.body.innerHTML = "";
});

describe("calendar accessible heading", () => {
	test("creates a hidden polite h2 heading for month view announcements", () => {
		const calendarNode = document.createElement("div");
		document.body.append(calendarNode);

		const cleanup = createAccessibleHeading({
			calendarNode,
			label: "Calendar July 2026",
			accessibleHeadingId: "calendar-heading",
		});

		const heading = document.getElementById("calendar-heading");

		expect(heading).toBeInstanceOf(HTMLHeadingElement);
		expect(heading?.textContent).toBe("Calendar July 2026");
		expect(heading?.ariaLive).toBe("polite");
		expect(heading?.ariaAtomic).toBe("true");
		expect(calendarNode.firstElementChild?.contains(heading)).toBe(true);

		cleanup();

		expect(document.getElementById("calendar-heading")).toBeNull();
	});
});
