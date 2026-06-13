<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/index.js';
	import type { TooltipContentProps } from '$lib/components/tooltip/primitive/index.js';
	import { TooltipContentState } from '$lib/components/tooltip/primitive/tooltip.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import PopperLayer from '$lib/components/_shared/utilities/popper-layer/popper-layer.svelte';
	import { getFloatingContentCSSVars } from '$lib/internal/floating-svelte/floating-utils.svelte.js';
	import PopperLayerForceMount from '$lib/components/_shared/utilities/popper-layer/popper-layer-force-mount.svelte';
	import FloatingLayerArrow from '$lib/components/_shared/utilities/floating-layer/components/floating-layer-arrow.svelte';
	import { cn } from '../../vendor/utils';
	import TooltipPortal from './tooltip-portal.svelte';
	import type { ComponentProps } from 'svelte';
	import type { WithoutChildrenOrChild } from '../../vendor/utils';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		arrowClasses,
		portalProps,
		side = 'top',
		sideOffset = 0,
		align = 'center',
		avoidCollisions = true,
		arrowPadding = 0,
		sticky = 'partial',
		strategy,
		hideWhenDetached = false,
		customAnchor,
		collisionPadding = 0,
		onInteractOutside = () => {},
		onEscapeKeydown = () => {},
		forceMount = false,
		style,
		...restProps
	}: TooltipContentProps & {
		arrowClasses?: string;
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof TooltipPortal>>;
	} = $props();

	const contentState = TooltipContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
	});

	const floatingProps = $derived({
		side,
		sideOffset,
		align,
		avoidCollisions,
		arrowPadding,
		sticky,
		hideWhenDetached,
		collisionPadding,
		strategy,
		customAnchor: customAnchor ?? contentState.root.triggerNode,
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'tooltip-content',
				class: cn(
					'bg-foreground text-background transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 w-fit origin-(--bits-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
					className,
				),
			},
			restProps,
			floatingProps,
			contentState.props,
		),
	);
</script>

{#snippet inner()}
	{@render children?.()}
	<FloatingLayerArrow>
		{#snippet child({ props })}
			<div
				class={cn(
					'bg-foreground z-50 size-2.5 rotate-45 rounded-[2px]',
					'data-[side=top]:translate-x-1/2 data-[side=top]:translate-y-[calc(-50%_+_2px)]',
					'data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:-translate-y-[calc(-50%_+_1px)]',
					'data-[side=right]:translate-x-[calc(50%_+_2px)] data-[side=right]:translate-y-1/2',
					'data-[side=left]:-translate-y-[calc(50%_-_3px)]',
					arrowClasses,
				)}
				{...props}>
			</div>
		{/snippet}
	</FloatingLayerArrow>
{/snippet}

<TooltipPortal {...portalProps}>
	{#if forceMount}
		<PopperLayerForceMount
			{...mergedProps}
			{...contentState.popperProps}
			enabled={contentState.root.opts.open.current}
			{id}
			trapFocus={false}
			loop={false}
			preventScroll={false}
			forceMount={true}
			ref={contentState.opts.ref}
			tooltip={true}
			shouldRender={contentState.shouldRender}
			contentPointerEvents={contentState.root.disableHoverableContent ? 'none' : 'auto'}>
			{#snippet popper({ props, wrapperProps })}
				{@const finalWrapperProps = mergeProps(wrapperProps, {
					style: {
						pointerEvents: contentState.root.disableHoverableContent ? 'none' : undefined,
					},
				})}
				{@const finalProps = mergeProps(props, { style: getFloatingContentCSSVars('tooltip') }, { style })}
				{#if child}
					{@render child({ props: finalProps, wrapperProps: finalWrapperProps, ...contentState.snippetProps })}
				{:else}
					<div {...finalWrapperProps}>
						<div {...finalProps}>
							{@render inner()}
						</div>
					</div>
				{/if}
			{/snippet}
		</PopperLayerForceMount>
	{:else if !forceMount}
		<PopperLayer
			{...mergedProps}
			{...contentState.popperProps}
			open={contentState.root.opts.open.current}
			{id}
			trapFocus={false}
			loop={false}
			preventScroll={false}
			forceMount={false}
			ref={contentState.opts.ref}
			tooltip={true}
			shouldRender={contentState.shouldRender}
			contentPointerEvents={contentState.root.disableHoverableContent ? 'none' : 'auto'}>
			{#snippet popper({ props, wrapperProps })}
				{@const finalWrapperProps = mergeProps(wrapperProps, {
					style: {
						pointerEvents: contentState.root.disableHoverableContent ? 'none' : undefined,
					},
				})}
				{@const finalProps = mergeProps(props, { style: getFloatingContentCSSVars('tooltip') }, { style })}
				{#if child}
					{@render child({ props: finalProps, wrapperProps: finalWrapperProps, ...contentState.snippetProps })}
				{:else}
					<div {...finalWrapperProps}>
						<div {...finalProps}>
							{@render inner()}
						</div>
					</div>
				{/if}
			{/snippet}
		</PopperLayer>
	{/if}
</TooltipPortal>
