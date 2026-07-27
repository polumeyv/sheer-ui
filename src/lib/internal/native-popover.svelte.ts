import type { Getter } from './tools/index.js';
import { on } from 'svelte/events';
import { isFunction, isString } from '@polumeyv/utilities';

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
 * onOpenChangeComplete on the opacity transition's end, and document-level Escape /
 * outside-pointerdown dismissal routed to the state's handlers.
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

	$effect(() => {
		const el = ref();
		if (!el) return;

		return on(el, 'transitionend', (event) => {
			if (event.target === el && event.propertyName === 'opacity') state.root.opts.onOpenChangeComplete.current(open());
		});
	});

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
