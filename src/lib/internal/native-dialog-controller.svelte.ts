import type { EscapeBehaviorType } from './escape-layer/types.js';
import type { InteractOutsideBehaviorType } from './dismissible-layer/types.js';
import { getTabbableCandidates } from './tabbable.js';
import type { Getter } from './tools/index.js';
import { createAttachmentKey, type Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';
import { getAbortSignal } from 'svelte';

type NativeDialogControllerOptions = {
	open: Getter<boolean>;
	onClose: () => void;
	outsideEvent?: 'pointerdown' | 'click';
	onInteractOutside?: Getter<(event: PointerEvent) => void>;
	interactOutsideBehavior?: Getter<InteractOutsideBehaviorType>;
	onEscapeKeydown?: Getter<(event: KeyboardEvent) => void>;
	escapeKeydownBehavior?: Getter<EscapeBehaviorType>;
	trapFocus?: Getter<boolean>;
};

/**
 * Bridges declarative open state to the native dialog top layer and centralizes native dismissal,
 * veto, cleanup, and optional sequential-focus wrapping. Visual policy stays with each adapter.
 */
export function nativeDialogControllerAttachment(options: NativeDialogControllerOptions) {
	const controller = ((node: HTMLDialogElement) => {
		$effect(() => {
			const open = options.open();
			if (open && !node.open) node.showModal();
			else if (!open && node.open) node.close();
		});

		const signal = getAbortSignal();
		on(node, 'close', options.onClose, { signal });

		const handleInteractOutside = (event: PointerEvent) => {
			if (event.target !== node) return;
			const shim = new PointerEvent('pointerdown', { cancelable: true });
			options.onInteractOutside?.()(shim);
			if (shim.defaultPrevented || options.interactOutsideBehavior?.() === 'ignore') return;
			node.close();
		};

		if (options.outsideEvent === 'pointerdown') on(node, 'pointerdown', handleInteractOutside, { signal });
		else if (options.outsideEvent === 'click') on(node, 'click', handleInteractOutside, { signal });

		if (options.onEscapeKeydown || options.escapeKeydownBehavior) {
			on(
				node,
				'cancel',
				(event) => {
					const shim = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
					options.onEscapeKeydown?.()(shim);
					if (shim.defaultPrevented || options.escapeKeydownBehavior?.() === 'ignore') event.preventDefault();
				},
				{ signal },
			);
		}

		if (options.trapFocus) {
			on(
				node,
				'keydown',
				(event) => {
					if (event.key !== 'Tab' || !options.trapFocus?.()) return;
					const tabbables = getTabbableCandidates(node);
					if (tabbables.length === 0) return;
					const first = tabbables[0]!;
					const last = tabbables[tabbables.length - 1]!;
					const active = node.ownerDocument.activeElement;
					if (!event.shiftKey && active === last) {
						event.preventDefault();
						first.focus();
					} else if (event.shiftKey && active === first) {
						event.preventDefault();
						last.focus();
					}
				},
				{ signal },
			);
		}
	}) satisfies Attachment<HTMLDialogElement>;

	return { [createAttachmentKey()]: controller };
}
