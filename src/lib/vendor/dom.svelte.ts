import type { ReadableProp } from '$lib/vendor/utils';

const ELEMENT_NODE: typeof Node.ELEMENT_NODE = 1;
const DOCUMENT_NODE: typeof Node.DOCUMENT_NODE = 9;
const DOCUMENT_FRAGMENT_NODE: typeof Node.DOCUMENT_FRAGMENT_NODE = 11;

export function isHTMLElement(node: unknown): node is HTMLElement {
	return (
		node !== null && typeof node === 'object' && (node as Node).nodeType === ELEMENT_NODE && typeof (node as Node).nodeName === 'string'
	);
}

export function isDocument(node: unknown): node is Document {
	return node !== null && typeof node === 'object' && (node as Node).nodeType === DOCUMENT_NODE;
}

export function isWindow(node: unknown): node is Window {
	return node !== null && typeof node === 'object' && node.constructor?.name === 'VisualViewport';
}

export function getNodeName(node: Node | Window): string {
	if (isHTMLElement(node)) return node.localName ?? '';
	return '#document';
}

export function isNode(node: unknown): node is Node {
	return node !== null && typeof node === 'object' && (node as Node).nodeType !== undefined;
}

export function isShadowRoot(node: unknown): node is ShadowRoot {
	return isNode(node) && node.nodeType === DOCUMENT_FRAGMENT_NODE && 'host' in node;
}

type Target = HTMLElement | EventTarget | null | undefined;

export function contains(parent: Target, child: Target) {
	if (!parent || !child) return false;
	if (!isHTMLElement(parent) || !isHTMLElement(child)) return false;
	const rootNode = child.getRootNode?.();
	if (parent === child) return true;
	if (parent.contains(child)) return true;
	if (rootNode && isShadowRoot(rootNode)) {
		let next = child;
		while (next) {
			if (parent === next) return true;
			// @ts-expect-error - host is not typed
			next = next.parentNode || next.host;
		}
	}
	return false;
}

export function getDocument(node: Element | Window | Node | Document | null | undefined) {
	if (isDocument(node)) return node;
	if (isWindow(node)) return node.document;
	return node?.ownerDocument ?? document;
}

export function getDocumentElement(node: Element | Node | Window | Document | null | undefined): HTMLElement {
	return getDocument(node).documentElement;
}

export function getWindow(node: Node | ShadowRoot | Document | null | undefined) {
	if (isShadowRoot(node)) return getWindow(node.host);
	if (isDocument(node)) return node.defaultView ?? window;
	if (isHTMLElement(node)) return node.ownerDocument?.defaultView ?? window;
	return window;
}

export function getActiveElement(rootNode: Document | ShadowRoot): HTMLElement | null {
	let activeElement = rootNode.activeElement as HTMLElement | null;
	while (activeElement?.shadowRoot) {
		const el = activeElement.shadowRoot.activeElement as HTMLElement | null;
		if (el === activeElement) break;
		else activeElement = el;
	}
	return activeElement;
}

export function getParentNode(node: Node): Node {
	if (getNodeName(node) === 'html') return node;
	const result =
		// @ts-expect-error - assignedSlot is not typed
		node.assignedSlot || node.parentNode || (isShadowRoot(node) && node.host) || getDocumentElement(node);
	return isShadowRoot(result) ? result.host : result;
}

type ElementGetter = () => HTMLElement | null;

export class DOMContext {
	readonly element: ReadableProp<HTMLElement | null>;
	readonly root: Document | ShadowRoot = $derived.by(() => {
		if (!this.element.current) return document;
		const rootNode = this.element.current.getRootNode() ?? document;
		return rootNode as Document | ShadowRoot;
	});

	constructor(element: ReadableProp<HTMLElement | null> | ElementGetter) {
		if (typeof element === 'function') {
			this.element = { get current() { return (element)(); } };
		} else {
			this.element = element;
		}
	}

	getDocument = () => {
		return getDocument(this.root);
	};

	getWindow = () => {
		return this.getDocument().defaultView ?? window;
	};

	getActiveElement = () => {
		return getActiveElement(this.root);
	};

	isActiveElement = (node: HTMLElement | null) => {
		return node === this.getActiveElement();
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
