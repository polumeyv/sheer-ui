<script lang="ts">
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { TooltipContentProps } from '../types.js';
	import { TooltipContentState } from '../tooltip.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { useNativePopoverLifecycle } from '$lib/internal/native-popover.svelte.js';

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
		// Floating-UI-only props kept for API compatibility; native positioning ignores them
		// (sideOffset, avoidCollisions, arrowPadding, sticky, hideWhenDetached, collisionPadding,
		//  strategy, customAnchor, portalProps, forceMount).
		...restProps
	}: TooltipContentProps & { arrowClasses?: ClassValue; portalProps?: unknown } = $props();

	const contentState = TooltipContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
	});

	useNativePopoverLifecycle({
		anchor: () => contentState.root.triggerNode,
		open: () => contentState.root.opts.open.current,
		ref: () => ref,
		triggerNode: () => contentState.root.triggerNode,
		onEscapeKeydown: () => contentState.onEscapeKeydown,
		onInteractOutside: () => contentState.onInteractOutside,
		onOpenChangeComplete: () => contentState.root.opts.onOpenChangeComplete.current,
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'tooltip-content',
				'data-anchored': '',
				class: join(
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
	{@render child({ props: mergeProps(mergedProps, { popover: 'manual' }), wrapperProps: {}, ...contentState.snippetProps })}
{:else}
	<div {...mergedProps} bind:this={ref} popover="manual" data-side={side} data-align={align}>
		{@render children?.()}
		<div class={join('native-tooltip-arrow bg-foreground size-2.5 rotate-45 rounded-xs', arrowClasses)}></div>
	</div>
{/if}

<style>
	/* static arrow — points correctly per side; flip updates data-side so no JS tracking needed */
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
