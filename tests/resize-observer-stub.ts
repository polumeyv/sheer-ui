// jsdom has no ResizeObserver and no layout. This stub records what each observer watches and
// reports on demand, so a suite plays the browser's part: `report()` after a mount stands in for
// the initial observation, and after a CSS change for the crossing it would notice. tabbable keys
// its display check on `[native code]` in the constructor source, so this leaves it on the jsdom
// path. Suites with their own instance-tracking stub still override it.
export class ResizeObserverStub {
	static instances: ResizeObserverStub[] = [];
	readonly targets: Element[] = [];
	constructor(readonly callback: ResizeObserverCallback) {
		ResizeObserverStub.instances.push(this);
	}
	observe(node: Element) {
		this.targets.push(node);
	}
	unobserve() {}
	disconnect() {}

	static report() {
		for (const observer of ResizeObserverStub.instances) {
			const entries = observer.targets.map((target) => ({ target })) as unknown as ResizeObserverEntry[];
			observer.callback(entries, observer as unknown as ResizeObserver);
		}
	}

	static install() {
		ResizeObserverStub.instances = [];
		Object.defineProperty(window, "ResizeObserver", {
			configurable: true,
			writable: true,
			value: ResizeObserverStub,
		});
	}
}
