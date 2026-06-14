<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { PopoverContentStaticProps } from "$lib/components/popover/primitive/index";
	import { PopoverContentState } from "$lib/components/popover/primitive/popover.svelte";
	import PopperLayer from "$lib/components/_shared/utilities/popper-layer/popper-layer.svelte";
	import { createId } from "$lib/vendor/create-id";
	import { getFloatingContentCSSVars } from "$lib/vendor/floating-svelte/floating-utils.svelte";

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		id = createId(uid),
		forceMount = false,
		onCloseAutoFocus = (() => {}),
		onEscapeKeydown = (() => {}),
		onInteractOutside = (() => {}),
		trapFocus = true,
		preventScroll = false,
		style,
		...restProps
	}: PopoverContentStaticProps = $props();

	const contentState = PopoverContentState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		onInteractOutside: { get current() { return onInteractOutside; } },
		onEscapeKeydown: { get current() { return onEscapeKeydown; } },
		customAnchor: { get current() { return null; } },
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<PopperLayer
	{...mergedProps}
	{...contentState.popperProps}
	ref={contentState.opts.ref}
	isStatic
	open={contentState.root.opts.open.current}
	{id}
	{trapFocus}
	{preventScroll}
	loop
	{forceMount}
	{onCloseAutoFocus}
	shouldRender={contentState.shouldRender}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(
			props,
			{ style: getFloatingContentCSSVars("popover") },
			{ style }
		)}
		{#if child}
			{@render child({ props: finalProps, ...contentState.snippetProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
