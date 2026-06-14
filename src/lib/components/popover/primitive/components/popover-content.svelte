<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { PopoverContentProps } from "$lib/components/popover/primitive/index";
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
		onOpenAutoFocus = (() => {}),
		onCloseAutoFocus = (() => {}),
		onEscapeKeydown = (() => {}),
		onInteractOutside = (() => {}),
		trapFocus = true,
		preventScroll = false,
		customAnchor = null,
		style,
		...restProps
	}: PopoverContentProps = $props();

	const contentState = PopoverContentState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		onInteractOutside: { get current() { return onInteractOutside; } },
		onEscapeKeydown: { get current() { return onEscapeKeydown; } },
		customAnchor: { get current() { return customAnchor; } },
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));

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

<PopperLayer
	{...mergedProps}
	{...contentState.popperProps}
	ref={contentState.opts.ref}
	open={contentState.root.opts.open.current}
	{id}
	trapFocus={effectiveTrapFocus}
	{preventScroll}
	loop
	{forceMount}
	{customAnchor}
	onOpenAutoFocus={handleOpenAutoFocus}
	{onCloseAutoFocus}
	shouldRender={contentState.shouldRender}
>
	{#snippet popper({ props, wrapperProps })}
		{@const finalProps = mergeProps(
			props,
			{ style: getFloatingContentCSSVars("popover") },
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
