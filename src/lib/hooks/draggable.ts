import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

export function draggable(get: () => { x: number; y: number }, set: (p: { x: number; y: number }) => void): Attachment<HTMLElement> {
	return (node) => {
		let start = { x: 0, y: 0 };
		let dragging = false;
		const down = (e: PointerEvent) => {
			dragging = true;
			const { x, y } = get();
			start = { x: e.clientX - x, y: e.clientY - y };
			node.setPointerCapture(e.pointerId);
		};
		const move = (e: PointerEvent) => dragging && set({ x: e.clientX - start.x, y: e.clientY - start.y });
		const up = (e: PointerEvent) => {
			dragging = false;
			node.releasePointerCapture(e.pointerId);
		};
		const cleanup = [
			on(node, 'pointerdown', down),
			on(node, 'pointermove', move),
			on(node, 'pointerup', up),
			on(node, 'pointerleave', up),
		];

		return () => {
			cleanup.forEach((remove) => remove());
		};
	};
}
