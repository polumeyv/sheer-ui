function getIsIOS() {
	return (
		typeof document !== "undefined" &&
		window?.navigator?.userAgent &&
		(/iP(ad|hone|od)/.test(window.navigator.userAgent) ||
			// The new iPad Pro Gen3 does not identify itself as iPad, but as Macintosh.
			(window?.navigator?.maxTouchPoints > 2 &&
				/iPad|Macintosh/.test(window?.navigator.userAgent)))
	);
}

export const isIOS = getIsIOS();

/**
 * Given a node, determine if it is hidden by walking up the
 * DOM tree until we hit the `stopAt` node (exclusive, if provided)
 * otherwise we stop at the document root.
 */
export function isElementHidden(node: HTMLElement, stopAt?: HTMLElement) {
	if (getComputedStyle(node).visibility === "hidden") return true;
	while (node) {
		// we stop at `stopAt` (excluding it)
		if (stopAt !== undefined && node === stopAt) return false;
		if (getComputedStyle(node).display === "none") return true;
		node = node.parentElement as HTMLElement;
	}
	return false;
}
