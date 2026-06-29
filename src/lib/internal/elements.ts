export function isOrContainsTarget(node: HTMLElement, target: Element) {
	return node === target || node.contains(target);
}
