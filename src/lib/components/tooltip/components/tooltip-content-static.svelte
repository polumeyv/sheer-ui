<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { TooltipContentStaticProps } from '../types.js';
	import { TooltipContentState } from '../tooltip.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { on } from 'svelte/events';
	import { cn } from '$lib/utils.js';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		arrowClasses,
		side = 'top',
		align = 'center',
		onInteractOutside = () => {},
		onEscapeKeydown = () => {},
		style,
		// Floating-UI-only props kept for API compatibility; native positioning ignores them.
		...restProps
	}: TooltipContentStaticProps & { arrowClasses?: string } = $props();

	const contentState = TooltipContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
	});

	const anchorName = `--tooltip-anchor-${uid}`;

	// Tag the *active* trigger as the CSS anchor (multi-trigger safe: cleared when it changes).
	$effect(() => {
		const trigger = contentState.root.triggerNode;
		if (!trigger) return;
		trigger.style.setProperty('anchor-name', anchorName);
		return () => trigger.style.removeProperty('anchor-name');
	});

	// Drive the native top layer from the existing open state (delay/hover logic is untouched).
	$effect(() => {
		const el = ref;
		const open = contentState.root.opts.open.current;
		if (!el?.isConnected) return;
		const shown = el.matches(':popover-open');
		if (open && !shown) el.showPopover();
		else if (!open && shown) el.hidePopover();
	});

	// `onOpenChangeComplete` once the enter/exit transition settles (CSS can't signal this).
	$effect(() => {
		const el = ref;
		if (!el) return;
		return on(el, 'transitionend', (e) => {
			if (e.target !== el || e.propertyName !== 'opacity') return;
			contentState.root.opts.onOpenChangeComplete.current(contentState.root.opts.open.current);
		});
	});

	// Esc + outside pointerdown dismissal (Popover API "manual" gives no light-dismiss).
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
				'data-slot': 'tooltip-content',
				class: cn(
					'native-tooltip-content z-50 w-fit rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background',
					'transition-[opacity,translate,display,overlay] transition-discrete opacity-0 translate-y-1 open:opacity-100 open:translate-y-0 starting:open:opacity-0 starting:open:translate-y-1',
				),
			},
			restProps,
			contentState.props,
			{ style },
		),
	);
</script>

{#if child}
	{@render child({ props: mergeProps(mergedProps, { popover: 'manual' }), ...contentState.snippetProps })}
{:else}
	<div {...mergedProps} bind:this={ref} popover="manual" data-side={side} data-align={align} style:position-anchor={anchorName}>
		{@render children?.()}
		<div class={cn('native-tooltip-arrow bg-foreground size-2.5 rotate-45 rounded-xs', arrowClasses)}></div>
	</div>
{/if}

<style>
	:global(.native-tooltip-content) {
		position: fixed;
		inset: auto;
		margin: 0;
		overflow: visible;
		border: none;

		bottom: anchor(top);
		justify-self: anchor-center;
		margin-bottom: 0.5rem;
		position-try-fallbacks: flip-block;
	}

	:global(.native-tooltip-content[data-side='bottom']) {
		bottom: auto;
		top: anchor(bottom);
		margin: 0.5rem 0 0;
	}
	:global(.native-tooltip-content[data-side='left']) {
		bottom: auto;
		right: anchor(left);
		left: auto;
		top: anchor(center);
		justify-self: initial;
		margin: 0 0.5rem 0 0;
	}
	:global(.native-tooltip-content[data-side='right']) {
		bottom: auto;
		left: anchor(right);
		top: anchor(center);
		justify-self: initial;
		margin: 0 0 0 0.5rem;
	}

	:global(.native-tooltip-content[data-align='start']) {
		justify-self: initial;
		left: anchor(left);
	}
	:global(.native-tooltip-content[data-align='end']) {
		justify-self: initial;
		left: auto;
		right: anchor(right);
	}

	:global(.native-tooltip-arrow) {
		position: absolute;
		z-index: 50;
	}
	:global(.native-tooltip-content[data-side='top'] .native-tooltip-arrow) {
		bottom: -0.3rem;
		left: 50%;
		translate: -50% 0;
	}
	:global(.native-tooltip-content[data-side='bottom'] .native-tooltip-arrow) {
		top: -0.3rem;
		left: 50%;
		translate: -50% 0;
	}
	:global(.native-tooltip-content[data-side='left'] .native-tooltip-arrow) {
		right: -0.3rem;
		top: 50%;
		translate: 0 -50%;
	}
	:global(.native-tooltip-content[data-side='right'] .native-tooltip-arrow) {
		left: -0.3rem;
		top: 50%;
		translate: 0 -50%;
	}
</style>
