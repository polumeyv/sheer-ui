import { getTabbableCandidates } from './tabbable.js';

export type FocusableTarget = HTMLElement;

function focus(element?: FocusableTarget | null, { select = false } = {}) {
	if (!element) return false;

	const doc = element.ownerDocument;
	if (doc.activeElement === element) return false;

	const previouslyFocusedElement = doc.activeElement;

	element.focus({ preventScroll: true });

	const didFocus = doc.activeElement === element;

	if (didFocus && element !== previouslyFocusedElement && select && element instanceof HTMLInputElement) {
		element.select();
	}

	return didFocus;
}

export function focusFirst(candidates: HTMLElement[], { select = false } = {}, getActiveElement: () => Element | null) {
	const previouslyFocusedElement = getActiveElement();

	for (const candidate of candidates) {
		focus(candidate, { select });

		if (getActiveElement() !== previouslyFocusedElement) {
			return true;
		}
	}

	return false;
}

export function getTabbableEdges(container: HTMLElement) {
	const candidates = getTabbableCandidates(container);

	return [candidates[0], candidates.at(-1)] as const;
}
