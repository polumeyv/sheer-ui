type FocusScope = {
	pause(): void;
	resume(): void;
};

export class FocusScopeManager {
	static instance: FocusScopeManager;
	static #instances = new WeakMap<Document, FocusScopeManager>();
	#scopeStack: FocusScope[] = [];
	#focusHistory = new WeakMap<FocusScope, HTMLElement>();
	#preFocusHistory = new WeakMap<FocusScope, HTMLElement>();
	#document: Document;

	constructor(doc: Document) {
		this.#document = doc;
	}

	static getInstance(doc: Document = document) {
		let instance = this.#instances.get(doc);
		if (!instance) {
			instance = new FocusScopeManager(doc);
			this.#instances.set(doc, instance);
			this.instance ??= instance;
		}
		return instance;
	}

	register(scope: FocusScope) {
		const current = this.getActive();
		if (current && current !== scope) {
			current.pause();
		}

		// capture the currently focused element before this scope becomes active
		const activeElement = this.#document.activeElement as HTMLElement;
		if (activeElement && activeElement !== this.#document.body) {
			this.#preFocusHistory.set(scope, activeElement);
		}

		this.#scopeStack = this.#scopeStack.filter((s) => s !== scope);
		this.#scopeStack.unshift(scope);
	}

	unregister(scope: FocusScope) {
		this.#scopeStack = this.#scopeStack.filter((s) => s !== scope);
		const next = this.getActive();
		if (next) {
			next.resume();
		}
	}

	getActive(): FocusScope | undefined {
		return this.#scopeStack[0];
	}

	setFocusMemory(scope: FocusScope, element: HTMLElement) {
		this.#focusHistory.set(scope, element);
	}

	getFocusMemory(scope: FocusScope): HTMLElement | undefined {
		return this.#focusHistory.get(scope);
	}

	isActiveScope(scope: FocusScope): boolean {
		return this.getActive() === scope;
	}

	setPreFocusMemory(scope: FocusScope, element: HTMLElement) {
		this.#preFocusHistory.set(scope, element);
	}

	getPreFocusMemory(scope: FocusScope): HTMLElement | undefined {
		return this.#preFocusHistory.get(scope);
	}

	clearPreFocusMemory(scope: FocusScope) {
		this.#preFocusHistory.delete(scope);
	}
}
