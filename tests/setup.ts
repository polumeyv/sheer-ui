// jsdom has no ResizeObserver; the sidebar's desktop panel observes itself on mount, so every
// suite that mounts a sidebar needs one. A no-op stub: nothing in jsdom ever resizes. tabbable
// keys its display check on `[native code]` in the constructor source, so this leaves it on the
// jsdom path. Suites that assert on observations install their own instance-tracking stub.
class ResizeObserverStub {
	observe() {}
	unobserve() {}
	disconnect() {}
}

Object.defineProperty(window, "ResizeObserver", {
	configurable: true,
	writable: true,
	value: ResizeObserverStub,
});
