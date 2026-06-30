<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { PopoverContentProps } from '../types.js';
	import { PopoverContentState } from '../popover.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { on } from 'svelte/events';

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		id = createId(uid),
		side = 'bottom',
		align = 'center',
		onInteractOutside = () => {},
		onEscapeKeydown = () => {},
		customAnchor = null,
		style,
		// No native equivalent — accepted for API compatibility but intentionally ignored.
		// Native popovers don't trap focus or lock scroll (ARIA-correct for a non-modal
		// popover), and the content is always mounted (the popover toggles `display` itself),
		// so trapFocus / preventScroll / forceMount / the FU auto-focus hooks are no-ops.
		// The remaining FU-only positioning props (sideOffset, avoidCollisions, …) ride in
		// restProps; native CSS `anchor()` positioning ignores them.
		trapFocus = true,
		preventScroll = false,
		forceMount = false,
		onOpenAutoFocus = () => {},
		onCloseAutoFocus = () => {},
		...restProps
	}: PopoverContentProps = $props();

	const contentState = PopoverContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
		customAnchor: boxWith(() => customAnchor),
	});

	const anchorName = `--popover-anchor-${uid}`;

	// Resolve the anchor element: `customAnchor` (selector or element) when provided, otherwise
	// the active trigger. The chosen node carries `anchor-name` and the content's
	// `position-anchor` points back at it. A virtual/Measurable anchor has no DOM node to tag,
	// so it falls back to the trigger.
	$effect(() => {
		let node: HTMLElement | null;
		if (typeof customAnchor === 'string') {
			node = document.querySelector<HTMLElement>(customAnchor);
		} else if (customAnchor instanceof HTMLElement) {
			node = customAnchor;
		} else {
			node = contentState.root.triggerNode;
		}
		if (!node) return;
		const target = node;
		target.style.setProperty('anchor-name', anchorName);
		return () => target.style.removeProperty('anchor-name');
	});

	// Drive the native top layer from the existing open state (click-toggle + hover/SafePolygon
	// logic in the state machine is untouched; this only mirrors `open` into showPopover/hide).
	$effect(() => {
		const el = ref;
		const open = contentState.root.opts.open.current;
		// The native top layer is progressive enhancement over the state machine; skip it where the
		// Popover API is absent (e.g. jsdom under test) so the open/close logic still drives `open`.
		if (!el?.isConnected || typeof el.showPopover !== 'function') return;
		const shown = el.matches(':popover-open');
		if (open && !shown) el.showPopover();
		else if (!open && shown) el.hidePopover();
	});

	// `onOpenChangeComplete` once the enter/exit transition settles — the one bit CSS can't
	// signal, so a single transitionend (gated to opacity) replaces what the presence manager measured.
	$effect(() => {
		const el = ref;
		if (!el) return;
		return on(el, 'transitionend', (e) => {
			if (e.target !== el || e.propertyName !== 'opacity') return;
			contentState.root.opts.onOpenChangeComplete.current(contentState.root.opts.open.current);
		});
	});

	// Esc + outside pointerdown dismissal. `popover="manual"` gives no light-dismiss, and the
	// state machine (not native auto-dismiss) owns click-toggle + hover, so dismissal is re-homed here.
	$effect(() => {
		if (!contentState.root.opts.open.current) return;
		const offKey = on(document, 'keydown', (e) => {
			if (e.key !== 'Escape') return;
			contentState.onEscapeKeydown(e);
		});
		const offPointer = on(
			document,
			'pointerdown',
			(e) => {
				const target = e.target as Node | null;
				if (ref?.contains(target ?? null)) return;
				if (contentState.root.triggerNode?.contains(target ?? null)) return;
				contentState.onInteractOutside(e);
			},
			{ capture: true },
		);
		return () => {
			offKey();
			offPointer();
		};
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'popover-content',
				'data-anchored': '',
				class:
					'bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden transition-[opacity,scale,translate,display,overlay] transition-discrete opacity-0 scale-95 open:opacity-100 open:scale-100 starting:open:opacity-0 starting:open:scale-95',
			},
			restProps,
			contentState.props,
			{ style },
		),
	);
</script>

{#if child}
	{@render child({ props: mergeProps(mergedProps, { popover: 'manual' }), wrapperProps: {}, ...contentState.snippetProps })}
{:else}
	<div {...mergedProps} bind:this={ref} popover="manual" data-side={side} data-align={align} style:position-anchor={anchorName}>
		{@render children?.()}
	</div>
{/if}
