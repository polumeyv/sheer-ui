import { createAttachmentKey, type Attachment } from 'svelte/attachments';

type MaybeElement = Element | null | undefined | false;

/** rAF-debounced ResizeObserver over `nodes`, returning its teardown. */
function observeNodes(nodes: Element[], onResize: ResizeObserverCallback, options?: ResizeObserverOptions) {
	let rAF = 0;

	const resizeObserver = new ResizeObserver((entries, observer) => {
		window.cancelAnimationFrame(rAF);
		rAF = window.requestAnimationFrame(() => onResize(entries, observer));
	});

	for (const node of nodes) {
		resizeObserver.observe(node, options);
	}

	return () => {
		window.cancelAnimationFrame(rAF);
		resizeObserver.disconnect();
	};
}

export function resizeAttachment<T extends Element = HTMLElement>(onResize: ResizeObserverCallback, options?: ResizeObserverOptions) {
	return {
		[createAttachmentKey()]: ((node: T) => observeNodes([node], onResize, options)) satisfies Attachment<T>,
	};
}

export function observeResizeMany(getNodes: () => Iterable<MaybeElement>, onResize: () => void, options?: ResizeObserverOptions) {
	$effect(() => {
		const nodes = [...getNodes()].filter(Boolean) as Element[];
		if (nodes.length === 0) return;

		return observeNodes(nodes, onResize, options);
	});
}
