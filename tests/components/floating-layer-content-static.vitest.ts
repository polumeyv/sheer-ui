import { flushSync, mount, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import ContentStaticFixture from "./floating-layer-content-static.fixture.svelte";

function render<T extends Record<string, unknown>>(
	component: Parameters<typeof mount>[0],
	props: T
) {
	const target = document.createElement("div");
	document.body.append(target);

	const instance = mount(component, { props, target });
	flushSync();

	return instance;
}

afterEach(() => {
	document.body.innerHTML = "";
});

describe("FloatingLayer static content", () => {
	test("onPlaced fires once the consumer's element hits the DOM", () => {
		const onPlaced = vi.fn();
		const instance = render(ContentStaticFixture, { onPlaced });

		try {
			expect(document.querySelector('[data-testid="static-content"]')).not.toBeNull();
			expect(onPlaced).toHaveBeenCalledTimes(1);
		} finally {
			unmount(instance);
		}
	});

	test("the attachment identity is stable, so a rerender does not replace it", () => {
		const onPlaced = vi.fn();
		const instance = render(ContentStaticFixture, { onPlaced }) as {
			relabel: () => void;
		};

		try {
			expect(onPlaced).toHaveBeenCalledTimes(1);

			instance.relabel();
			flushSync();

			expect(
				document.querySelector('[data-testid="static-content"]')?.getAttribute("data-label")
			).toBe("second");
			expect(onPlaced).toHaveBeenCalledTimes(1);
		} finally {
			unmount(instance);
		}
	});

	test("onPlaced is not re-fired on unmount", () => {
		const onPlaced = vi.fn();
		const instance = render(ContentStaticFixture, { onPlaced });

		unmount(instance);
		flushSync();

		expect(onPlaced).toHaveBeenCalledTimes(1);
	});
});

