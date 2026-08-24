/*
 * Adapted from focus-trap/tabbable v6.5.0.
 * Source: https://github.com/focus-trap/tabbable/blob/v6.5.0/src/index.js
 * License: MIT, Copyright (c) 2015 David Clark.
 *
 * Local scope: only the behavior used by this package is kept. We support open
 * shadow roots and the display check modes used by the helpers below.
 */

import { selfAndAncestors } from './tools/utils/dom.js';

type DisplayCheck = 'full' | 'none';

interface TabbableOptions {
	displayCheck?: DisplayCheck;
	getShadowRoot?: true;
}

type TabbableElement = HTMLElement & {
	assignedSlot?: HTMLSlotElement | null;
	checked?: boolean;
	disabled?: boolean;
	form?: HTMLFormElement | null;
	name?: string;
	type?: string;
};

type CandidateScope = {
	scopeParent: TabbableElement;
	candidates: Candidate[];
};

type Candidate = TabbableElement | CandidateScope;

const candidateSelectors = [
	'input:not([inert]):not([inert] *)',
	'select:not([inert]):not([inert] *)',
	'textarea:not([inert]):not([inert] *)',
	'a[href]:not([inert]):not([inert] *)',
	'area[href]:not([inert]):not([inert] *)',
	'button:not([inert]):not([inert] *)',
	'[tabindex]:not(slot):not([inert]):not([inert] *)',
	'audio[controls]:not([inert]):not([inert] *)',
	'video[controls]:not([inert]):not([inert] *)',
	'[contenteditable]:not([contenteditable="false"]):not([inert]):not([inert] *)',
	'details>summary:first-of-type:not([inert]):not([inert] *)',
	'details:not([inert]):not([inert] *)',
];

const candidateSelector = candidateSelectors.join(',');
const focusableCandidateSelector = candidateSelectors.concat('iframe:not([inert]):not([inert] *)').join(',');

const noElement = typeof Element === 'undefined';
const matches = noElement ? () => false : Element.prototype.matches;

function asElement(node: Node | null | undefined): Element | null {
	return node?.nodeType === Node.ELEMENT_NODE ? (node as Element) : null;
}

function getRootNode(element: Element): Node {
	return element.getRootNode?.() ?? element.ownerDocument;
}

function getRootHost(root: Node | null | undefined): Element | undefined {
	return root && 'host' in root ? (root.host as Element) : undefined;
}

function isInert(node: Node | null | undefined, lookUp = true): boolean {
	const element = asElement(node);
	const inertAttribute = element?.getAttribute('inert');
	const inert = inertAttribute === '' || inertAttribute === 'true';

	return Boolean(
		inert ||
			(lookUp &&
				node &&
				(typeof (node as Element).closest === 'function'
					? (node as Element).closest('[inert]')
					: isInert(node.parentNode))),
	);
}

function isContentEditable(node: Element | null | undefined): boolean {
	const value = node?.getAttribute('contenteditable');
	return value === '' || value === 'true';
}

function getCandidates(container: Element, includeContainer: boolean, filter: (node: TabbableElement) => boolean) {
	if (isInert(container)) return [];

	const candidates = Array.from(container.querySelectorAll(candidateSelector)) as TabbableElement[];
	if (includeContainer && matches.call(container, candidateSelector)) {
		candidates.unshift(container as TabbableElement);
	}

	return candidates.filter(filter);
}

/**
 * Candidates under `elements` in document order (depth-first, pre-order). Slot content and open
 * shadow roots recurse as their own scope: spliced in when `options.flatten`, otherwise yielded as
 * a single `{ scopeParent, candidates }` entry so `sortByOrder` can rank the scope as a unit.
 */
function* iterateCandidates(
	elements: Iterable<Element>,
	includeContainer: boolean,
	options: {
		filter: (node: TabbableElement) => boolean;
		flatten: boolean;
		shadowRootFilter?: (node: TabbableElement) => boolean;
	},
): Generator<Candidate> {
	const roots = Array.from(elements) as TabbableElement[];
	// The roots are excluded from their own result unless `includeContainer`. Nested scopes always
	// pass true, so only the outermost call ever consults this.
	const excluded = includeContainer ? null : new Set<Element>(roots);

	function* scope(scopeParent: TabbableElement, content: Iterable<Element>): Generator<Candidate> {
		const nested = iterateCandidates(content, true, options);
		if (options.flatten) yield* nested;
		else yield { scopeParent, candidates: Array.from(nested) };
	}

	function* walk(elements: TabbableElement[]): Generator<Candidate> {
		for (const element of elements) {
			if (isInert(element, false)) continue;

			if (element.tagName === 'SLOT') {
				const slot = element as HTMLSlotElement;
				const assigned = slot.assignedElements();
				yield* scope(element, assigned.length ? assigned : Array.from(slot.children));
				continue;
			}

			if (matches.call(element, candidateSelector) && options.filter(element) && !excluded?.has(element)) {
				yield element;
			}

			const shadowRoot = element.shadowRoot;
			const validShadowRoot =
				shadowRoot && !isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));

			if (validShadowRoot) yield* scope(element, shadowRoot.children);
			else yield* walk(Array.from(element.children) as TabbableElement[]);
		}
	}

	yield* walk(roots);
}

function hasTabIndex(node: Element): boolean {
	return !Number.isNaN(Number.parseInt(node.getAttribute('tabindex') ?? '', 10));
}

export function getTabIndex(node: TabbableElement): number {
	if (!node) throw new Error('No node provided');

	if (
		node.tabIndex < 0 &&
		(/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) &&
		!hasTabIndex(node)
	) {
		return 0;
	}

	return node.tabIndex;
}

function getSortOrderTabIndex(node: TabbableElement, isScope: boolean): number {
	const tabIndex = getTabIndex(node);
	return tabIndex < 0 && isScope && !hasTabIndex(node) ? 0 : tabIndex;
}

function isCandidateScope(candidate: Candidate): candidate is CandidateScope {
	return 'scopeParent' in candidate;
}

function isInput(node: TabbableElement): node is HTMLInputElement & TabbableElement {
	return node.tagName === 'INPUT';
}

function isHiddenInput(node: TabbableElement): boolean {
	return isInput(node) && node.type === 'hidden';
}

function isDetailsWithSummary(node: TabbableElement): boolean {
	return node.tagName === 'DETAILS' && Array.from(node.children).some((child) => child.tagName === 'SUMMARY');
}

function getCheckedRadio(nodes: NodeListOf<HTMLInputElement>, form: HTMLFormElement | null | undefined) {
	for (const node of nodes) {
		if (node.checked && node.form === form) return node;
	}
}

function isTabbableRadio(node: TabbableElement): boolean {
	if (!node.name) return true;

	const radioScope = (node.form ?? getRootNode(node)) as ParentNode;
	const queryRadios = (name: string) => radioScope.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${name}"]`);

	let radioSet: NodeListOf<HTMLInputElement>;
	if (typeof window !== 'undefined' && window.CSS?.escape) {
		radioSet = queryRadios(window.CSS.escape(node.name));
	} else {
		try {
			radioSet = queryRadios(node.name);
		} catch {
			return false;
		}
	}

	const checked = getCheckedRadio(radioSet, node.form);
	return !checked || checked === node;
}

function isRadio(node: TabbableElement): boolean {
	return isInput(node) && node.type === 'radio';
}

function isNonTabbableRadio(node: TabbableElement): boolean {
	return isRadio(node) && !isTabbableRadio(node);
}

function isNodeAttached(node: TabbableElement): boolean {
	let root = getRootNode(node);
	let host = getRootHost(root);
	let attached = false;

	if (root && root !== node) {
		attached = Boolean(host?.ownerDocument?.contains(host) || node.ownerDocument?.contains(node));

		while (!attached && host) {
			root = getRootNode(host);
			host = getRootHost(root);
			attached = Boolean(host?.ownerDocument?.contains(host));
		}
	}

	return attached;
}

function isHidden(node: TabbableElement, options: TabbableOptions): boolean {
	const { visibility } = getComputedStyle(node);
	if (visibility === 'hidden' || visibility === 'collapse') return true;

	const isDirectSummary = matches.call(node, 'details>summary:first-of-type');
	const nodeUnderDetails = isDirectSummary ? node.parentElement : node;
	if (nodeUnderDetails && matches.call(nodeUnderDetails, 'details:not([open]) *')) return true;

	if (!options.displayCheck || options.displayCheck === 'full') {
		if (isNodeAttached(node)) return !node.getClientRects().length;
		return true;
	}

	return false;
}

function isDisabledFromFieldset(node: TabbableElement): boolean {
	if (!/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) return false;

	for (const parent of selfAndAncestors(node.parentElement)) {
		if (parent.tagName === 'FIELDSET' && (parent as HTMLFieldSetElement).disabled) {
			for (const child of parent.children) {
				if (child.tagName === 'LEGEND') {
					return matches.call(parent, 'fieldset[disabled] *') ? true : !child.contains(node);
				}
			}
			return true;
		}
	}

	return false;
}

function isNodeMatchingSelectorFocusable(options: TabbableOptions, node: TabbableElement): boolean {
	return !(
		node.disabled ||
		isHiddenInput(node) ||
		isHidden(node, options) ||
		isDetailsWithSummary(node) ||
		isDisabledFromFieldset(node)
	);
}

function isNodeMatchingSelectorTabbable(options: TabbableOptions, node: TabbableElement): boolean {
	return !isNonTabbableRadio(node) && getTabIndex(node) >= 0 && isNodeMatchingSelectorFocusable(options, node);
}

function isShadowRootTabbable(shadowHostNode: TabbableElement): boolean {
	const tabIndex = Number.parseInt(shadowHostNode.getAttribute('tabindex') ?? '', 10);
	return Number.isNaN(tabIndex) || tabIndex >= 0;
}

function sortByOrder(candidates: Candidate[]): TabbableElement[] {
	const regularTabbables: TabbableElement[] = [];
	const orderedTabbables: Array<{ documentOrder: number; tabIndex: number; content: TabbableElement[] }> = [];

	candidates.forEach((candidate, documentOrder) => {
		const isScope = isCandidateScope(candidate);
		const element = isScope ? candidate.scopeParent : candidate;
		const content = isScope ? sortByOrder(candidate.candidates) : [element];
		const tabIndex = getSortOrderTabIndex(element, isScope);

		if (tabIndex === 0) {
			regularTabbables.push(...content);
		} else {
			orderedTabbables.push({ documentOrder, tabIndex, content });
		}
	});

	return orderedTabbables
		.sort((a, b) => (a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex))
		.flatMap((candidate) => candidate.content)
		.concat(regularTabbables);
}

export function tabbable(container: HTMLElement, options: TabbableOptions = {}) {
	if (options.getShadowRoot) {
		const candidates = iterateCandidates([container], false, {
			filter: (node) => isNodeMatchingSelectorTabbable(options, node),
			flatten: false,
			shadowRootFilter: isShadowRootTabbable,
		});
		return sortByOrder(Array.from(candidates));
	}

	return sortByOrder(getCandidates(container, false, (node) => isNodeMatchingSelectorTabbable(options, node)));
}

export function focusable(container: HTMLElement, options: TabbableOptions = {}) {
	if (options.getShadowRoot) {
		const candidates = iterateCandidates([container], false, {
			filter: (node) => isNodeMatchingSelectorFocusable(options, node),
			flatten: true,
		});
		return Array.from(candidates) as TabbableElement[];
	}

	return getCandidates(container, false, (node) => isNodeMatchingSelectorFocusable(options, node));
}

export function isTabbableNode(node: Element, options: TabbableOptions = {}) {
	if (!node) throw new Error('No node provided');
	if (!matches.call(node, candidateSelector)) return false;
	return isNodeMatchingSelectorTabbable(options, node as TabbableElement);
}

export function isFocusableNode(node: Element, options: TabbableOptions = {}) {
	if (!node) throw new Error('No node provided');
	if (!matches.call(node, focusableCandidateSelector)) return false;
	return isNodeMatchingSelectorFocusable(options, node as TabbableElement);
}

function getTabbableOptions() {
	return {
		getShadowRoot: true,
		displayCheck:
			// JSDOM does not support the `tabbable` library. To solve this we can
			// check if `ResizeObserver` is a real function (not polyfilled), which
			// determines if the current environment is JSDOM-like.
			typeof ResizeObserver === 'function' && ResizeObserver.toString().includes('[native code]') ? 'full' : 'none',
	} as const;
}

export function getTabbableCandidates(container: HTMLElement) {
	return tabbable(container, getTabbableOptions()) as HTMLElement[];
}

export function getFocusableCandidates(container: HTMLElement) {
	return focusable(container, getTabbableOptions()) as HTMLElement[];
}

export function isTabbable(node: Element) {
	return isTabbableNode(node, getTabbableOptions());
}

export function isFocusable(node: Element) {
	return isFocusableNode(node, getTabbableOptions());
}

/**
 * Gets all tabbable elements in the body and finds the next/previous tabbable element
 * from the `currentNode` based on the `direction` provided.
 * @param currentNode - the node we want to get the next/previous tabbable from
 */
export function getTabbableFrom(currentNode: HTMLElement, direction: 'next' | 'prev') {
	if (!isTabbable(currentNode)) {
		return getTabbableFromFocusable(currentNode, direction);
	}
	const doc = currentNode.ownerDocument;
	const allTabbable = getTabbableCandidates(doc.body);
	if (direction === 'prev') allTabbable.reverse();
	const activeIndex = allTabbable.indexOf(currentNode);
	if (activeIndex === -1) return doc.body;
	const nextTabbableElements = allTabbable.slice(activeIndex + 1);
	return nextTabbableElements[0];
}

export function getTabbableFromFocusable(currentNode: HTMLElement, direction: 'next' | 'prev') {
	const doc = currentNode.ownerDocument;
	if (!isFocusable(currentNode)) return doc.body;

	// find all focusable nodes, since some elements may be focusable but not tabbable
	// such as context menu triggers
	const allFocusable = getFocusableCandidates(doc.body);

	// find index of current node among focusable siblings
	if (direction === 'prev') allFocusable.reverse();
	const activeIndex = allFocusable.indexOf(currentNode);
	if (activeIndex === -1) return doc.body;

	const nextFocusableElements = allFocusable.slice(activeIndex + 1);

	// find the next focusable node that is also tabbable
	return nextFocusableElements.find((node) => isTabbable(node)) ?? doc.body;
}
