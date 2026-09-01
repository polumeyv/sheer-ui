import type { Getter } from './tools/index.js';
import { on } from 'svelte/events';
import { createSettleRunner, useOpenChangeComplete } from './animations-settled.svelte.js';

/** Per-surface CSS anchor names; client-only (the lifecycle effect never runs in SSR). */
let anchorSequence = 0;

type NativePopoverAnchor = HTMLElement | string | null | undefined | object;

/**
 * The slice of a content state the lifecycle drives — popover, tooltip, and
 * link-preview content states all expose this shape, so the hook takes the
 * state itself instead of a getter per field.
 *
 * `manual` mode requires the two dismissal handlers; `auto` mode requires `dismiss`
 * (the UA decides *when* to close, the state only has to follow).
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
	onEscapeKeydown?: (event: KeyboardEvent) => void;
	onInteractOutside?: (event: PointerEvent) => void;
	dismiss?: () => void;
}

const resolveNativePopoverAnchor = (anchor: NativePopoverAnchor, fallback: HTMLElement | null | undefined) =>
	typeof anchor === 'string'
		? document.querySelector<HTMLElement>(anchor)
		: anchor instanceof HTMLElement
			? anchor
			: (fallback ?? null);

/**
 * Drives a native popover surface from a content state: open/close via
 * showPopover()/hidePopover() (anchored to the trigger, or the `anchor` override) and
 * onOpenChangeComplete once the surface's own animations settle.
 *
 * `mode: 'auto'` (Popover) hands dismissal to the UA — light dismiss and Escape run
 * through the browser's top-layer stack, so stacked surfaces close one per Escape —
 * and syncs UA-initiated closes back into state via the `toggle` event. `manual`
 * (Tooltip, LinkPreview — they need `popover="hint"`, which Safari lacks as of
 * 2026-07) keeps document-level Escape / outside-pointerdown listeners; those bypass
 * bitsEscapeLayers, so a manual surface over a JS-stack menu still closes both on one
 * Escape.
 *
 * Returns the anchored-surface prop bag (`popover`, `data-anchored`) — the JS half of
 * the contract whose CSS half lives in ui.css under `[data-anchored]` — so surfaces
 * merge it instead of restating it.
 */
export function useNativePopoverLifecycle(
	state: NativePopoverContentState,
	options: { anchor?: Getter<NativePopoverAnchor>; mode?: 'auto' | 'manual' } = {},
) {
	const mode = options.mode ?? 'manual';
	const ref = () => state.opts.ref.current;
	const open = () => state.root.opts.open.current;

	// The surface's own animations gate the deferred hide; a long-running descendant
	// animation (a chart entry inside a popover) must not hold the top layer.
	const exitSettle = createSettleRunner({ subtree: false });
	// Anchoring is entirely the source element, so the anchor is frozen at the
	// last show; a reopen against a different trigger/customAnchor must re-show, not no-op.
	let shownSource: HTMLElement | null = null;

	// Explicit CSS anchor per surface: showPopover({source})'s implicit anchor is Chrome 137+
	// only — without it, anchor() in the [data-anchored] rules has nothing to resolve against
	// in Firefox and Safari, and the surface lands over its own trigger (which also swallowed
	// the trigger's close click). anchor-name is a list, so a source that already carries one
	// (a menu trigger sharing the element) keeps it.
	const anchorName = `--bits-popover-anchor-${++anchorSequence}`;
	const nameAnchor = (source: HTMLElement) => {
		const existing = source.style.anchorName || '';
		if (!existing || existing === 'none') source.style.anchorName = anchorName;
		else if (!existing.split(',').some((n) => n.trim() === anchorName)) source.style.anchorName = `${existing}, ${anchorName}`;
	};
	const unnameAnchor = (source: HTMLElement) => {
		const rest = (source.style.anchorName || '')
			.split(',')
			.map((n) => n.trim())
			.filter((n) => n && n !== anchorName && n !== 'none');
		if (rest.length) source.style.anchorName = rest.join(', ');
		else source.style.removeProperty('anchor-name');
	};
	$effect(() => () => {
		if (shownSource) unnameAnchor(shownSource);
	});

	$effect(() => {
		const el = ref();
		const isOpen = open();
		if (!el?.isConnected || typeof el.showPopover !== 'function') return;

		if (isOpen) {
			exitSettle.cancel(); // a reopen mid-exit keeps the surface shown
			const source = resolveNativePopoverAnchor(options.anchor?.(), state.root.triggerNode);
			if (el.matches(':popover-open')) {
				if (source === shownSource) return;
				el.hidePopover(); // re-anchor: hide+show against the new source in one pass
			}
			if (shownSource && shownSource !== source) unnameAnchor(shownSource);
			if (source) {
				nameAnchor(source);
				el.style.positionAnchor = anchorName;
			} else {
				el.style.removeProperty('position-anchor');
			}
			// The implicit source still matters where it works: in `auto` mode it makes the UA
			// exempt the invoker from light dismiss (Chrome 137+).
			source ? (el.showPopover as (options: { source: HTMLElement }) => void).call(el, { source }) : el.showPopover();
			shownSource = source;
			return;
		}

		if (!el.matches(':popover-open')) return; // the UA already hid it (light dismiss, Escape)
		// The exiting surface is inert-adjacent but still in the tab order; hand focus back to
		// the trigger now rather than letting Tab land inside a closing popover.
		if (el.contains(el.ownerDocument.activeElement)) state.root.triggerNode?.focus();
		// Hold the popover in the top layer while the [data-state=closed] exit runs, then hide.
		// `overlay` transitions are Chrome-only, so an immediate hidePopover() snaps the exit
		// in Firefox and Safari; the surfaces key their exit on data-state, not :popover-open.
		exitSettle.run(el, () => {
			if (!open() && el.matches(':popover-open')) el.hidePopover();
		});
	});

	useOpenChangeComplete(open, ref, (isOpen) => state.root.opts.onOpenChangeComplete.current(isOpen));

	if (mode === 'auto') {
		// The UA closes the popover itself (light dismiss, Escape, another auto popover opening);
		// `toggle` is where library state finds out and follows.
		$effect(() => {
			const el = ref();
			if (!el) return;
			return on(el, 'toggle', (event) => {
				if ((event as ToggleEvent).newState === 'closed' && open()) state.dismiss?.();
			});
		});
	} else {
		$effect(() => {
			if (!open()) return;

			const offKey = on(document, 'keydown', (event) => {
				if (event.key === 'Escape') state.onEscapeKeydown?.(event);
			});
			const offPointer = on(
				document,
				'pointerdown',
				(event) => {
					const target = event.target as Node | null;
					// inside the popover or its trigger — not an outside interaction
					if (ref()?.contains(target ?? null) || state.root.triggerNode?.contains(target ?? null)) return;
					state.onInteractOutside?.(event);
				},
				{ capture: true },
			);

			return () => {
				offKey();
				offPointer();
			};
		});
	}

	return { popover: mode, 'data-anchored': '' } as const;
}
