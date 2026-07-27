import type { Getter } from './tools/index.js';
import { on } from 'svelte/events';
import { isFunction, isString } from '@polumeyv/utilities';
import { animationsSettled } from './disclosure-close.js';

type NativePopoverAnchor = HTMLElement | string | null | undefined | object;

/**
 * The slice of a content state the lifecycle drives — popover, tooltip, and
 * link-preview content states all expose this shape, so the hook takes the
 * state itself instead of a getter per field.
 */
interface NativePopoverContentState {
	readonly root: {
		readonly opts: {
			readonly open: { readonly current: boolean };
			readonly onOpenChangeComplete: { readonly current: (open: boolean) => void };
		};
		readonly triggerNode: HTMLElement | null;
	};
	readonly opts: {
		readonly ref: { readonly current: HTMLElement | null };
	};
	onEscapeKeydown: (event: KeyboardEvent) => void;
	onInteractOutside: (event: PointerEvent) => void;
}

const resolveNativePopoverAnchor = (anchor: NativePopoverAnchor, fallback: HTMLElement | null | undefined) =>
	isString(anchor) ? document.querySelector<HTMLElement>(anchor) : anchor instanceof HTMLElement ? anchor : (fallback ?? null);

/**
 * Drives a native `popover="manual"` surface from a content state: open/close via
 * showPopover()/hidePopover() (anchored to the trigger, or the `anchor` override),
 * onOpenChangeComplete once the surface's own animations settle, and document-level
 * Escape / outside-pointerdown dismissal routed to the state's handlers.
 *
 * Returns the anchored-surface prop bag (`popover`, `data-anchored`) — the JS half of
 * the contract whose CSS half lives in ui.css under `[data-anchored]` — so surfaces
 * merge it instead of restating it.
 */
export function useNativePopoverLifecycle(state: NativePopoverContentState, options: { anchor?: Getter<NativePopoverAnchor> } = {}) {
	const ref = () => state.opts.ref.current;
	const open = () => state.root.opts.open.current;

	$effect(() => {
		const el = ref();
		const isOpen = open();
		if (!el?.isConnected || !isFunction(el.showPopover)) return;
		if (isOpen === el.matches(':popover-open')) return; // already in the desired state

		if (!isOpen) return el.hidePopover();

		const source = resolveNativePopoverAnchor(options.anchor?.(), state.root.triggerNode);
		// `source` gives CSS anchor() a default anchor without requiring position-anchor.
		source ? (el.showPopover as (options: { source: HTMLElement }) => void).call(el, { source }) : el.showPopover();
	});

	// Settle-based rather than transitionend so completion still fires when no transition
	// runs (duration-0 override, reduced motion, jsdom).
	let prevOpen = open();
	let completeToken = 0;
	$effect(() => {
		const el = ref();
		const isOpen = open();
		if (isOpen === prevOpen) return;
		prevOpen = isOpen;
		if (!el) return;
		const token = ++completeToken;
		void animationsSettled(el, { subtree: false }).then(() => {
			if (token === completeToken) state.root.opts.onOpenChangeComplete.current(isOpen);
		});
	});

	// TODO(bug): these document-level listeners don't register in bitsEscapeLayers /
	// bitsDismissableLayers, so e.g. a Tooltip over an open DropdownMenu closes both on one
	// Escape. For Popover the root fix is `popover="auto"` (89.8% 2026-07): UA light dismiss +
	// Escape via the top-layer stack deletes this whole effect. Tooltip/LinkPreview need
	// `popover="hint"` instead (no Safari as of 2026-07) — until then they stay `manual`.
	$effect(() => {
		if (!open()) return;

		const offKey = on(document, 'keydown', (event) => {
			if (event.key === 'Escape') state.onEscapeKeydown(event);
		});
		const offPointer = on(
			document,
			'pointerdown',
			(event) => {
				const target = event.target as Node | null;
				// inside the popover or its trigger — not an outside interaction
				if (ref()?.contains(target ?? null) || state.root.triggerNode?.contains(target ?? null)) return;
				state.onInteractOutside(event);
			},
			{ capture: true },
		);

		return () => {
			offKey();
			offPointer();
		};
	});

	return { popover: 'manual', 'data-anchored': '' } as const;
}
