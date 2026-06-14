<script lang="ts">
	import { mergeProps } from '$lib/vendor/index';
	import type { LinkPreviewContentProps } from '$lib/components/link-preview/index';
	import { LinkPreviewContentState } from '$lib/components/link-preview/link-preview.svelte';
	import PopperLayer from '$lib/components/_shared/utilities/popper-layer/popper-layer.svelte';
	import { getFloatingContentCSSVars } from '$lib/vendor/floating-svelte/floating-utils.svelte';
	import Mounted from '$lib/components/_shared/utilities/mounted.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { cn, type WithoutChildrenOrChild } from '../../vendor/utils';
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
		onInteractOutside = (() => {}),
		onEscapeKeydown = (() => {}),
		forceMount = false,
		style,
		...restProps
	}: LinkPreviewContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof HoverCardPortal>>;
	} = $props();

	const contentState = LinkPreviewContentState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		onInteractOutside: { get current() { return onInteractOutside; } },
		onEscapeKeydown: { get current() { return onEscapeKeydown; } },
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
	<PopperLayer
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		open={contentState.root.opts.open.current}
		{id}
		trapFocus={false}
		loop={false}
		preventScroll={false}
		{forceMount}
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
</HoverCardPortal>
