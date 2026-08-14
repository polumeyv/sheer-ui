import { BROWSER } from '@polumeyv/env';

const ELEMENT_NODE = 1;
const DOCUMENT_NODE = 9;
const DOCUMENT_FRAGMENT_NODE = 11;

const isObject = (node: unknown): node is Record<string, unknown> =>
	typeof node === 'object' && node !== null && !Array.isArray(node);
const hasNodeType = (node: unknown): node is { nodeType: number } => isObject(node) && typeof node.nodeType === 'number';
const isNode = (node: unknown): node is Node => hasNodeType(node);
export const isElement = (node: unknown): node is Element => hasNodeType(node) && node.nodeType === ELEMENT_NODE;
const isDocument = (node: unknown): node is Document => hasNodeType(node) && node.nodeType === DOCUMENT_NODE;
const isShadowRoot = (node: unknown): node is ShadowRoot => hasNodeType(node) && node.nodeType === DOCUMENT_FRAGMENT_NODE && 'host' in node;

export const isHTMLElement = (node: unknown): node is HTMLElement =>
	isElement(node) && node.namespaceURI === 'http://www.w3.org/1999/xhtml';

export const isElementOrSVGElement = (node: unknown): node is Element | SVGElement => isElement(node);

export const isIOS =
	BROWSER &&
	!!window.navigator.userAgent &&
	(/iP(ad|hone|od)/.test(window.navigator.userAgent) ||
		// iPad Pro Gen3 reports as Macintosh, so fall back to touch-point sniffing.
		(window.navigator.maxTouchPoints > 2 && /iPad|Macintosh/.test(window.navigator.userAgent)));

type Target = Node | EventTarget | null | undefined;

export function contains(parent: Target, child: Target) {
	if (!parent || !child) return false;
	if (!isNode(parent) || !isNode(child)) return false;
	if (parent === child) return true;
	if (parent.contains(child)) return true;
	let current: Node | null = child;
	while (current) {
		if (current === parent) return true;
		const root = current.getRootNode?.();
		if (isShadowRoot(root) && current === root) {
			current = root.host;
		} else {
			current = current.parentNode;
		}
	}
	return false;
}

export function getWindow(node: Node | ShadowRoot | Document | null | undefined) {
	if (isShadowRoot(node)) return getWindow(node.host);
	if (isDocument(node)) return node.defaultView ?? window;
	if (isNode(node)) return node.ownerDocument?.defaultView ?? window;
	return window;
}
