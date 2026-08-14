import { boxWith } from '../runed/box.svelte.js';
import type { Box } from '../types.js';

function getActiveElement(rootNode: Document | ShadowRoot): HTMLElement | null {
	let activeElement = rootNode.activeElement as HTMLElement | null;
	while (activeElement?.shadowRoot) {
		const next = activeElement.shadowRoot.activeElement as HTMLElement | null;
		if (!next || next === activeElement) break;
		activeElement = next;
	}
	return activeElement;
}

export class DOMContext {
	readonly element: Box<HTMLElement | null>;
	readonly root: Document | ShadowRoot = $derived.by(() => {
		if (!this.element.current) return document;
		const rootNode = this.element.current.getRootNode() ?? document;
		return rootNode as Document | ShadowRoot;
	});

	constructor(element: Box<HTMLElement | null> | (() => HTMLElement | null)) {
		if (typeof element === 'function') {
			this.element = boxWith(element);
		} else {
			this.element = element;
		}
	}

	getDocument = () => {
		return this.element.current?.ownerDocument ?? document;
	};

	getWindow = () => {
		return this.getDocument().defaultView ?? window;
	};

	getActiveElement = () => {
		return getActiveElement(this.root);
	};

	getElementById<T extends Element = HTMLElement>(id: string) {
		return this.root.getElementById(id) as T | null;
	}

	querySelector = (selector: string) => {
		if (!this.root) return null;
		return this.root.querySelector(selector);
	};

	querySelectorAll = (selector: string) => {
		if (!this.root) return [] as unknown as NodeListOf<Element>;
		return this.root.querySelectorAll(selector);
	};

	setTimeout = (callback: () => void, delay: number) => {
		return this.getWindow().setTimeout(callback, delay);
	};

	clearTimeout = (timeoutId: number) => {
		return this.getWindow().clearTimeout(timeoutId);
	};
}
