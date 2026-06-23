import type { Getter } from '$lib/internal/tools/index.js';
import { createAttachmentKey, type Attachment } from 'svelte/attachments';

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
				resizeObserver.unobserve(node);
				resizeObserver.disconnect();
			};
		}) satisfies Attachment<T>,
	};
}

export class SvelteResizeObserver {
	#node: Getter<HTMLElement | null>;
	#onResize: () => void;
	constructor(node: Getter<HTMLElement | null>, onResize: () => void) {
		this.#node = node;
		this.#onResize = onResize;
		this.handler = this.handler.bind(this);
		$effect(this.handler);
	}

	handler() {
		let rAF = 0;
		const _node = this.#node();
		if (!_node) return;
		const resizeObserver = new ResizeObserver(() => {
			cancelAnimationFrame(rAF);
			rAF = window.requestAnimationFrame(this.#onResize);
		});

		resizeObserver.observe(_node);
		return () => {
			window.cancelAnimationFrame(rAF);
			resizeObserver.unobserve(_node);
		};
	}
}
