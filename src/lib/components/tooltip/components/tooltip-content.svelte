<script lang="ts">
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { TooltipContentProps } from '../types.js';
	import { TooltipContentState } from '../tooltip.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import { useNativePopoverLifecycle } from '../../../internal/native-popover.svelte.js';

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
		// (sideOffset, avoidCollisions, arrowPadding, collisionPadding, hideWhenDetached,
		//  customAnchor, portalProps, forceMount).
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

	const lifecycleProps = useNativePopoverLifecycle(contentState);

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'tooltip-content',
				class: join(
					'group/tooltip z-50 w-fit rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background @container-[anchored]',
					'data-[side=left]:[position-try-fallbacks:flip-inline] data-[side=right]:[position-try-fallbacks:flip-inline]',
					// tooltip data-state is closed | delayed-open | instant-open, so "open" is not-closed
					'transition-[opacity,translate,display,overlay] transition-discrete opacity-0 translate-y-1 data-[state=closed]:pointer-events-none not-data-[state=closed]:opacity-100 not-data-[state=closed]:translate-y-0 starting:not-data-[state=closed]:opacity-0 starting:not-data-[state=closed]:translate-y-1',
				),
			},
			restProps,
			contentState.props,
			{ style },
			lifecycleProps,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...contentState.snippetProps })}
{:else}
	<div {...mergedProps} bind:this={ref} data-side={side} data-align={align}>
		{@render children?.()}
		<div
			class={join(
				'hidden absolute z-50 size-2.5 rotate-45 rounded-xs bg-foreground supports-[container-type:anchored]:block',
				'group-data-[side=top]/tooltip:bottom-[-0.3rem] group-data-[side=top]/tooltip:left-1/2 group-data-[side=top]/tooltip:-translate-x-1/2',
				'group-data-[side=bottom]/tooltip:top-[-0.3rem] group-data-[side=bottom]/tooltip:left-1/2 group-data-[side=bottom]/tooltip:-translate-x-1/2',
				'group-data-[side=left]/tooltip:right-[-0.3rem] group-data-[side=left]/tooltip:top-1/2 group-data-[side=left]/tooltip:-translate-y-1/2',
				'group-data-[side=right]/tooltip:left-[-0.3rem] group-data-[side=right]/tooltip:top-1/2 group-data-[side=right]/tooltip:-translate-y-1/2',
				'[@container_anchored(fallback:_flip-block)]:group-data-[side=top]/tooltip:bottom-auto [@container_anchored(fallback:_flip-block)]:group-data-[side=top]/tooltip:top-[-0.3rem]',
				'[@container_anchored(fallback:_flip-block)]:group-data-[side=bottom]/tooltip:top-auto [@container_anchored(fallback:_flip-block)]:group-data-[side=bottom]/tooltip:bottom-[-0.3rem]',
				'[@container_anchored(fallback:_flip-inline)]:group-data-[side=left]/tooltip:right-auto [@container_anchored(fallback:_flip-inline)]:group-data-[side=left]/tooltip:left-[-0.3rem]',
				'[@container_anchored(fallback:_flip-inline)]:group-data-[side=right]/tooltip:left-auto [@container_anchored(fallback:_flip-inline)]:group-data-[side=right]/tooltip:right-[-0.3rem]',
				arrowClasses,
			)}
		></div>
	</div>
{/if}
