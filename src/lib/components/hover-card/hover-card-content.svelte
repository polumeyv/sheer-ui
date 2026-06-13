<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { LinkPreviewContentProps } from '$lib/bits/link-preview/types.js';
	import { LinkPreviewContentState } from '$lib/bits/link-preview/link-preview.svelte.js';
	import PopperLayer from '$lib/bits/utilities/popper-layer/popper-layer.svelte';
	import { getFloatingContentCSSVars } from '$lib/internal/floating-svelte/floating-utils.svelte.js';
	import PopperLayerForceMount from '$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte';
	import Mounted from '$lib/bits/utilities/mounted.svelte';
	import { noop } from '$lib/internal/noop.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn, type WithoutChildrenOrChild } from '../../utils';
	import HoverCardPortal from './hover-card-portal.svelte';
	import type { ComponentProps } from 'svelte';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		portalProps,
		side = 'top',
		sideOffset = 4,
		align = 'center',
		avoidCollisions = true,
		arrowPadding = 0,
		sticky = 'partial',
		hideWhenDetached = false,
		collisionPadding = 0,
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		forceMount = false,
		style,
		...restProps
	}: LinkPreviewContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof HoverCardPortal>>;
	} = $props();

	const contentState = LinkPreviewContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
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
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'hover-card-content',
				class: cn(
					'bg-popover text-popover-foreground transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 mt-3 w-64 rounded-md border p-4 shadow-md outline-none',
					className,
				),
			},
			restProps,
			floatingProps,
			contentState.props,
		),
	);
</script>

<HoverCardPortal {...portalProps}>
	{#if forceMount}
		<PopperLayerForceMount
			{...mergedProps}
			{...contentState.popperProps}
			ref={contentState.opts.ref}
			enabled={contentState.root.opts.open.current}
			{id}
			trapFocus={false}
			loop={false}
			preventScroll={false}
			forceMount={true}
			shouldRender={contentState.shouldRender}
		>
			{#snippet popper({ props, wrapperProps })}
				{@const finalProps = mergeProps(
					props,
					{ style: getFloatingContentCSSVars('link-preview') },
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
				<Mounted bind:mounted={contentState.root.contentMounted} />
			{/snippet}
		</PopperLayerForceMount>
	{:else if !forceMount}
		<PopperLayer
			{...mergedProps}
			{...contentState.popperProps}
			ref={contentState.opts.ref}
			open={contentState.root.opts.open.current}
			{id}
			trapFocus={false}
			loop={false}
			preventScroll={false}
			forceMount={false}
			shouldRender={contentState.shouldRender}
		>
			{#snippet popper({ props, wrapperProps })}
				{@const finalProps = mergeProps(
					props,
					{ style: getFloatingContentCSSVars('link-preview') },
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
				<Mounted bind:mounted={contentState.root.contentMounted} />
			{/snippet}
		</PopperLayer>
	{/if}
</HoverCardPortal>
