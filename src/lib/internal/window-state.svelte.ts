import { on } from "svelte/events";
import { createSubscriber } from "svelte/reactivity";

export type WindowSizeValue = {
	innerWidth: number;
	innerHeight: number;
};

export type WindowScrollValue = {
	scrollX: number;
	scrollY: number;
};

function readWindowSize(): WindowSizeValue | undefined {
	if (typeof window === "undefined") return undefined;
	return {
		innerWidth: window.innerWidth,
		innerHeight: window.innerHeight,
	};
}

function readWindowScroll(): WindowScrollValue {
	if (typeof window === "undefined") return { scrollX: 0, scrollY: 0 };
	return {
		scrollX: window.scrollX,
		scrollY: window.scrollY,
	};
}

export class WindowSize {
	#subscribe = createSubscriber((update) => {
		if (typeof window === "undefined") return;
		return on(window, "resize", update);
	});

	get current() {
		this.#subscribe();
		return readWindowSize();
	}
}

export class WindowScroll {
	#subscribe = createSubscriber((update) => {
		if (typeof window === "undefined") return;
		return on(window, "scroll", update);
	});

	get current() {
		this.#subscribe();
		return readWindowScroll();
	}
}

export const windowSize = new WindowSize();
export const windowScroll = new WindowScroll();
