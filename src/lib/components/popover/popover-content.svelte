<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { PopoverContentProps } from '$lib/components/popover/primitive/index.js';
	import { PopoverContentState } from '$lib/components/popover/primitive/popover.svelte.js';
	import PopperLayer from '$lib/components/_shared/utilities/popper-layer/popper-layer.svelte';
	import { createId } from '$lib/internal/create-id.js';
	import { getFloatingContentCSSVars } from '$lib/internal/floating-svelte/floating-utils.svelte.js';
	import PopperLayerForceMount from '$lib/components/_shared/utilities/popper-layer/popper-layer-force-mount.svelte';
	import PopoverPortal from './popover-portal.svelte';
	import { cn, type WithoutChildrenOrChild } from '../../vendor/utils';
	import type { ComponentProps } from 'svelte';

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		id = createId(uid),
		class: className,
		sideOffset = 4,
		align = 'center',
		portalProps,
		forceMount = false,
		onOpenAutoFocus = (() => {}),
		onCloseAutoFocus = (() => {}),
		onEscapeKeydown = (() => {}),
		onInteractOutside = (() => {}),
		trapFocus = true,
		preventScroll = false,
		customAnchor = null,
		style,
		...restProps
	}: PopoverContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof PopoverPortal>>;
	} = $props();

	const contentState = PopoverContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
		customAnchor: boxWith(() => customAnchor),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'popover-content',
				class: cn(
					'bg-popover text-popover-foreground transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 w-72 origin-(--bits-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden',
					className,
				),
			},
			restProps,
			{ sideOffset, align },
			contentState.props,
		),
	);

	// respect user's trapFocus setting, but disable when hover-opened without interaction
	const effectiveTrapFocus = $derived(trapFocus && contentState.shouldTrapFocus);

	// prevent auto-focus when opened via hover until user interacts
	function handleOpenAutoFocus(e: Event) {
		if (!contentState.shouldTrapFocus) {
			e.preventDefault();
		}
		onOpenAutoFocus(e);
	}
</script>

<PopoverPortal {...portalProps}>
	{#if forceMount}
		<PopperLayerForceMount
			{...mergedProps}
			{...contentState.popperProps}
			ref={contentState.opts.ref}
			enabled={contentState.root.opts.open.current}
			{id}
			trapFocus={effectiveTrapFocus}
			{preventScroll}
			loop
			forceMount={true}
			{customAnchor}
			onOpenAutoFocus={handleOpenAutoFocus}
			{onCloseAutoFocus}
			shouldRender={contentState.shouldRender}
		>
			{#snippet popper({ props, wrapperProps })}
				{@const finalProps = mergeProps(
					props,
					{ style: getFloatingContentCSSVars('popover') },
					{ style }
				)}
				{#if child}
					{@render child({ props: finalProps, wrapperProps, ...contentState.snippetProps })}
				{:else}
					<div {...wrapperProps}>
						<div {...finalProps}>
							{@render children?.()}
						</div>
					</div>
				{/if}
			{/snippet}
		</PopperLayerForceMount>
	{:else if !forceMount}
		<PopperLayer
			{...mergedProps}
			{...contentState.popperProps}
			ref={contentState.opts.ref}
			open={contentState.root.opts.open.current}
			{id}
			trapFocus={effectiveTrapFocus}
			{preventScroll}
			loop
			forceMount={false}
			{customAnchor}
			onOpenAutoFocus={handleOpenAutoFocus}
			{onCloseAutoFocus}
			shouldRender={contentState.shouldRender}
		>
			{#snippet popper({ props, wrapperProps })}
				{@const finalProps = mergeProps(
					props,
					{ style: getFloatingContentCSSVars('popover') },
					{ style }
				)}
				{#if child}
					{@render child({ props: finalProps, wrapperProps, ...contentState.snippetProps })}
				{:else}
					<div {...wrapperProps}>
						<div {...finalProps}>
							{@render children?.()}
						</div>
					</div>
				{/if}
			{/snippet}
		</PopperLayer>
	{/if}
</PopoverPortal>
