import type { EscapeBehaviorType } from './escape-layer/types.js';
import type { InteractOutsideBehaviorType } from './dismissible-layer/types.js';
import { getTabbableCandidates } from './tabbable.js';
import { createSettleRunner } from './animations-settled.svelte.js';
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
		// Every dismissal routes through options.onClose() → root state → this effect, never
		// node.close() directly: close() hides the dialog the same frame (`overlay` is
		// Chromium-only and WebKit doesn't start display/top-layer transitions at all —
		// bug 275184), so the exit ride is a data-[state=closed] keyframe animation played
		// while the dialog is still open, and close() fires only once it settles.
		const closeSettle = createSettleRunner({ subtree: false });
		$effect(() => {
			if (options.open()) {
				closeSettle.cancel();
				if (!node.open) node.showModal();
			} else if (node.open) {
				// An open flip re-runs this effect and cancels the runner first; node.open covers a
				// UA-initiated close in the meantime.
				closeSettle.run(node, () => {
					if (node.open) node.close();
				});
			}
		});

		const signal = getAbortSignal();
		on(node, 'close', options.onClose, { signal });

		const handleInteractOutside = (event: PointerEvent) => {
			if (event.target !== node) return;
			const shim = new PointerEvent('pointerdown', { cancelable: true });
			options.onInteractOutside?.()(shim);
			if (shim.defaultPrevented || options.interactOutsideBehavior?.() === 'ignore') return;
			options.onClose();
		};

		if (options.outsideEvent === 'pointerdown') on(node, 'pointerdown', handleInteractOutside, { signal });
		else if (options.outsideEvent === 'click') on(node, 'click', handleInteractOutside, { signal });

		on(
			node,
			'cancel',
			(event) => {
				// Always prevent the native instant close; a permitted Escape closes through state
				// so the exit animation runs first.
				event.preventDefault();
				const shim = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
				options.onEscapeKeydown?.()(shim);
				if (shim.defaultPrevented || options.escapeKeydownBehavior?.() === 'ignore') return;
				options.onClose();
			},
			{ signal },
		);

		// Load-bearing, not redundant with showModal(): verified in Chromium 2026-07-27 —
		// without this, Tab past the last tabbable parks focus on <body> for one step.
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

		// Teardown can outrun the settle-deferred close (a consumer-owned `{#if open}`, or unmount
		// while open); run the native close so the top layer and focus restore are handled.
		return () => {
			if (node.open) node.close();
		};
	}) satisfies Attachment<HTMLDialogElement>;

	return { [createAttachmentKey()]: controller };
}
