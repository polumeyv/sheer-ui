import { createAttachmentKey, type Attachment } from 'svelte/attachments';

export type ResizeAttachment<E extends HTMLElement = HTMLElement> = Record<symbol, Attachment<E>>;

export function createResizeAttachment<E extends HTMLElement = HTMLElement>(onResize: (node: E) => void): Attachment<E> {
	return (node) => {
		let frame = 0;

		const observer = new ResizeObserver(() => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => onResize(node));
		});

		observer.observe(node);

		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		};
	};
}

export function attachResize<E extends HTMLElement = HTMLElement>(onResize: (node: E) => void): ResizeAttachment<E> {
	return {
		[createAttachmentKey()]: createResizeAttachment(onResize),
	};
}

export function createObservedResizeAttachment<E extends HTMLElement = HTMLElement>(
	getNode: () => E | null,
	onResize: (node: E) => void,
): Attachment<HTMLElement> {
	return () => {
		$effect(() => {
			let frame = 0;
			const node = getNode();

			if (!node) return;

			const observer = new ResizeObserver(() => {
				cancelAnimationFrame(frame);
				frame = requestAnimationFrame(() => onResize(node));
			});

			observer.observe(node);

			return () => {
				cancelAnimationFrame(frame);
				observer.disconnect();
			};
		});
	};
}

export function attachObservedResize<E extends HTMLElement = HTMLElement>(
	getNode: () => E | null,
	onResize: (node: E) => void,
): ResizeAttachment {
	return {
		[createAttachmentKey()]: createObservedResizeAttachment(getNode, onResize),
	};
}
