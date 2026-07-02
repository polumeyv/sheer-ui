import type { Getter } from '$lib/internal/tools/index.js';
import { on } from 'svelte/events';
import { isFunction, isString } from '@polumeyv/utilities';

type NativePopoverAnchor = HTMLElement | string | null | undefined | object;

interface NativePopoverLifecycleOptions {
	anchor: Getter<NativePopoverAnchor>;
	open: Getter<boolean>;
	ref: Getter<HTMLElement | null>;
	triggerNode: Getter<HTMLElement | null | undefined>;
	onEscapeKeydown: Getter<(event: KeyboardEvent) => void>;
	onInteractOutside: Getter<(event: PointerEvent) => void>;
	onOpenChangeComplete: Getter<(open: boolean) => void>;
}

const resolveNativePopoverAnchor = (anchor: NativePopoverAnchor, fallback: HTMLElement | null | undefined) =>
	isString(anchor) ? document.querySelector<HTMLElement>(anchor) : anchor instanceof HTMLElement ? anchor : (fallback ?? null);

export function useNativePopoverLifecycle(opts: NativePopoverLifecycleOptions) {
	$effect(() => {
		const el = opts.ref();
		const open = opts.open();
		if (!el?.isConnected || !isFunction(el.showPopover)) return;
		if (open === el.matches(':popover-open')) return; // already in the desired state

		if (!open) return el.hidePopover();

		const source = resolveNativePopoverAnchor(opts.anchor(), opts.triggerNode());
		// `source` gives CSS anchor() a default anchor without requiring position-anchor.
		source ? (el.showPopover as (options: { source: HTMLElement }) => void).call(el, { source }) : el.showPopover();
	});

	$effect(() => {
		const el = opts.ref();
		if (!el) return;

		return on(el, 'transitionend', (event) => {
			if (event.target === el && event.propertyName === 'opacity') opts.onOpenChangeComplete()(opts.open());
		});
	});

	$effect(() => {
		if (!opts.open()) return;

		const offKey = on(document, 'keydown', (event) => {
			if (event.key === 'Escape') opts.onEscapeKeydown()(event);
		});
		const offPointer = on(
			document,
			'pointerdown',
			(event) => {
				const target = event.target as Node | null;
				// inside the popover or its trigger — not an outside interaction
				if (opts.ref()?.contains(target ?? null) || opts.triggerNode()?.contains(target ?? null)) return;
				opts.onInteractOutside()(event);
			},
			{ capture: true },
		);

		return () => {
			offKey();
			offPointer();
		};
	});
}
