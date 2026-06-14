<script lang="ts">
	import { mergeProps } from '$lib/vendor/index';
	import type { TooltipContentProps } from '$lib/components/tooltip/primitive/index';
	import { TooltipContentState } from '$lib/components/tooltip/primitive/tooltip.svelte';
	import { createId } from '$lib/vendor/create-id';
	import PopperLayer from '$lib/components/_shared/utilities/popper-layer/popper-layer.svelte';
	import { getFloatingContentCSSVars } from '$lib/vendor/floating-svelte/floating-utils.svelte';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
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
	}: TooltipContentProps = $props();

	const contentState = TooltipContentState.create({
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
		strategy,
		customAnchor: customAnchor ?? contentState.root.triggerNode,
	});

	const mergedProps = $derived(mergeProps(restProps, floatingProps, contentState.props));
</script>

<PopperLayer
	{...mergedProps}
	{...contentState.popperProps}
	open={contentState.root.opts.open.current}
	{id}
	trapFocus={false}
	loop={false}
	preventScroll={false}
	{forceMount}
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
					{@render children?.()}
				</div>
			</div>
		{/if}
	{/snippet}
</PopperLayer>
