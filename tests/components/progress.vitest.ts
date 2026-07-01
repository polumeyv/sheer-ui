import { describe, expect, test } from "vitest";
import { getProgressPercent } from "../../src/lib/components/progress/progress.svelte.js";

describe("progress value normalization", () => {
	test("normalizes values against min and max", () => {
		expect(getProgressPercent(60, 0, 100)).toBe(60);
		expect(getProgressPercent(60, 20, 100)).toBe(50);
	});

	test("clamps out-of-range and invalid values", () => {
		expect(getProgressPercent(-10, 0, 100)).toBe(0);
		expect(getProgressPercent(150, 0, 100)).toBe(100);
		expect(getProgressPercent(10, 10, 10)).toBe(0);
		expect(getProgressPercent(Number.NaN, 0, 100)).toBe(0);
	});

	test("preserves indeterminate progress", () => {
		expect(getProgressPercent(null, 0, 100)).toBeNull();
	});
});
