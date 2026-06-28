import type { Getter } from '$lib/internal/tools/index.js';
import { createAttachmentKey, type Attachment } from 'svelte/attachments';

type MaybeElement = Element | null | undefined | false;

export function resizeAttachment<T extends Element = HTMLElement>(onResize: ResizeObserverCallback, options?: ResizeObserverOptions) {
	return {
		[createAttachmentKey()]: ((node: T) => {
			let rAF = 0;

			const resizeObserver = new ResizeObserver((entries, observer) => {
				window.cancelAnimationFrame(rAF);
				rAF = window.requestAnimationFrame(() => onResize(entries, observer));
			});

			resizeObserver.observe(node, options);

			return () => {
				window.cancelAnimationFrame(rAF);
				resizeObserver.disconnect();
			};
		}) satisfies Attachment<T>,
	};
}

export function observeResize(getNode: Getter<MaybeElement>, onResize: () => void, options?: ResizeObserverOptions) {
	$effect(() => {
		const node = getNode();
		if (!node) return;

		let rAF = 0;

		const resizeObserver = new ResizeObserver(() => {
			window.cancelAnimationFrame(rAF);
			rAF = window.requestAnimationFrame(onResize);
		});

		resizeObserver.observe(node, options);

		return () => {
			window.cancelAnimationFrame(rAF);
			resizeObserver.disconnect();
		};
	});
}

export function observeResizeMany(getNodes: () => Iterable<MaybeElement>, onResize: () => void, options?: ResizeObserverOptions) {
	$effect(() => {
		const nodes = [...getNodes()].filter(Boolean) as Element[];
		if (nodes.length === 0) return;

		let rAF = 0;

		const resizeObserver = new ResizeObserver(() => {
			window.cancelAnimationFrame(rAF);
			rAF = window.requestAnimationFrame(onResize);
		});

		for (const node of nodes) {
			resizeObserver.observe(node, options);
		}

		return () => {
			window.cancelAnimationFrame(rAF);
			resizeObserver.disconnect();
		};
	});
}
