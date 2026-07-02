import { isObject } from '@polumeyv/utilities';

const ELEMENT_NODE = 1;
const DOCUMENT_NODE = 9;
const DOCUMENT_FRAGMENT_NODE = 11;

const hasNodeType = (node: unknown): node is { nodeType: number } => isObject(node) && typeof node.nodeType === 'number';
const isNode = (node: unknown): node is Node => hasNodeType(node);
const isElement = (node: unknown): node is Element => hasNodeType(node) && node.nodeType === ELEMENT_NODE;
const isDocument = (node: unknown): node is Document => hasNodeType(node) && node.nodeType === DOCUMENT_NODE;
const isShadowRoot = (node: unknown): node is ShadowRoot => hasNodeType(node) && node.nodeType === DOCUMENT_FRAGMENT_NODE && 'host' in node;
const isWindow = (node: unknown): node is Window => isObject(node) && node === node.window;

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

export function getDocument(node: Element | Window | Node | Document | null | undefined) {
	if (isDocument(node)) return node;
	if (isWindow(node)) return node.document;
	return node?.ownerDocument ?? document;
}

export function getWindow(node: Node | ShadowRoot | Document | null | undefined) {
	if (isShadowRoot(node)) return getWindow(node.host);
	if (isDocument(node)) return node.defaultView ?? window;
	if (isNode(node)) return node.ownerDocument?.defaultView ?? window;
	return window;
}
