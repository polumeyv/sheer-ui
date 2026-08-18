export function focusFirst(candidates: HTMLElement[], getActiveElement: () => Element | null) {
	const previouslyFocusedElement = getActiveElement();

	for (const candidate of candidates) {
		// focus already sits where we want it, so don't walk past it into the next candidate
		if (candidate === previouslyFocusedElement) return true;

		candidate.focus({ preventScroll: true });

		if (getActiveElement() !== previouslyFocusedElement) return true;
	}

	return false;
}
