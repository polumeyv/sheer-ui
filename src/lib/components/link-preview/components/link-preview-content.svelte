<script lang="ts">
	import { boxWith, mountedAttachment } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { LinkPreviewContentProps } from '../types.js';
	import { LinkPreviewContentState } from '../link-preview.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { on } from 'svelte/events';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		side = 'top',
		align = 'center',
		onInteractOutside = () => {},
		onEscapeKeydown = () => {},
		style,
		// Floating-UI-only props kept for API compatibility; native positioning ignores them
		// (sideOffset, alignOffset, avoidCollisions, collisionBoundary, collisionPadding, arrowPadding,
		//  sticky, hideWhenDetached, dir, customAnchor, forceMount).
		...restProps
	}: LinkPreviewContentProps = $props();

	const contentState = LinkPreviewContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
	});

	const anchorName = `--link-preview-anchor-${uid}`;

	// Tag the active trigger as the CSS anchor (cleared when the trigger node changes).
	$effect(() => {
		const trigger = contentState.root.triggerNode;
		if (!trigger) return;
		trigger.style.setProperty('anchor-name', anchorName);
		return () => trigger.style.removeProperty('anchor-name');
	});

	// Drive the native top layer from the existing open state (hover-intent/delay logic is untouched).
	$effect(() => {
		const el = ref;
		const open = contentState.root.opts.open.current;
		if (!el?.isConnected) return;
		const shown = el.matches(':popover-open');
		if (open && !shown) el.showPopover();
		else if (!open && shown) el.hidePopover();
	});

	// `onOpenChangeComplete` once the enter/exit transition settles — the one bit CSS can't signal,
	// so a single transitionend (gated to opacity) replaces what the presence manager measured.
	$effect(() => {
		const el = ref;
		if (!el) return;
		return on(el, 'transitionend', (e) => {
			if (e.target !== el || e.propertyName !== 'opacity') return;
			contentState.root.opts.onOpenChangeComplete.current(contentState.root.opts.open.current);
		});
	});

	// Esc + outside pointerdown dismissal (Popover API "manual" gives no light-dismiss; this is the
	// genuine dismissal behavior, re-homed from the old dismissible layer).
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

	const mounted = mountedAttachment<HTMLElement>((m) => (contentState.root.contentMounted = m));

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'hover-card-content',
				'data-anchored': '',
				class:
					'bg-popover text-popover-foreground z-50 w-64 rounded-md border p-4 shadow-md outline-none transition-[opacity,scale,translate,display,overlay] transition-discrete opacity-0 scale-95 open:opacity-100 open:scale-100 starting:open:opacity-0 starting:open:scale-95',
			},
			restProps,
			contentState.props,
			{ style },
			mounted,
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
