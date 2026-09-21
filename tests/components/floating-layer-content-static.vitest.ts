import { flushSync } from "svelte";
import { describe, expect, test, vi } from "vitest";
import { mountInBody, unmount } from "../mount";
import ContentStaticFixture from "./floating-layer-content-static.fixture.svelte";

describe("FloatingLayer static content", () => {
	test("onPlaced fires once the consumer's element hits the DOM", () => {
		const onPlaced = vi.fn();
		mountInBody(ContentStaticFixture, { onPlaced });

		expect(document.querySelector('[data-testid="static-content"]')).not.toBeNull();
		expect(onPlaced).toHaveBeenCalledTimes(1);
	});

	test("the attachment identity is stable, so a rerender does not replace it", () => {
		const onPlaced = vi.fn();
		const { component } = mountInBody(ContentStaticFixture, { onPlaced });

		expect(onPlaced).toHaveBeenCalledTimes(1);

		component.relabel();
		flushSync();

		expect(
			document.querySelector('[data-testid="static-content"]')?.getAttribute("data-label")
		).toBe("second");
		expect(onPlaced).toHaveBeenCalledTimes(1);
	});

	test("onPlaced is not re-fired on unmount", () => {
		const onPlaced = vi.fn();
		const { component } = mountInBody(ContentStaticFixture, { onPlaced });

		unmount(component);
		flushSync();

		expect(onPlaced).toHaveBeenCalledTimes(1);
	});
});
