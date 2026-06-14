<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { LinkPreviewContentProps } from "$lib/components/link-preview/index";
	import { LinkPreviewContentState } from "$lib/components/link-preview/link-preview.svelte";
	import PopperLayer from "$lib/components/_shared/utilities/popper-layer/popper-layer.svelte";
	import { getFloatingContentCSSVars } from "$lib/vendor/floating-svelte/floating-utils.svelte";
	import Mounted from "$lib/components/_shared/utilities/mounted.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		side = "top",
		sideOffset = 0,
		align = "center",
		avoidCollisions = true,
		arrowPadding = 0,
		sticky = "partial",
		hideWhenDetached = false,
		collisionPadding = 0,
		onInteractOutside = (() => {}),
		onEscapeKeydown = (() => {}),
		forceMount = false,
		style,
		...restProps
	}: LinkPreviewContentProps = $props();

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

	const mergedProps = $derived(mergeProps(restProps, floatingProps, contentState.props));
</script>

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
			{ style: getFloatingContentCSSVars("link-preview") },
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
