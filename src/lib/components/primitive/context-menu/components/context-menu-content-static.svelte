<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { ContextMenuContentStaticProps } from "$lib/components/primitive/context-menu/index";
	import { CONTEXT_MENU_TRIGGER_ATTR } from "$lib/components/_shared/menu/attrs";
	import { MenuContentState } from "$lib/components/_shared/menu/content.svelte";
	import { useId } from "$lib/vendor/use-id";
	import PopperLayer from "$lib/components/_shared/utilities/popper-layer/popper-layer.svelte";
	import { getFloatingContentCSSVars } from "$lib/vendor/floating-svelte/floating-utils.svelte";

	let {
		id = useId(),
		child,
		children,
		ref = $bindable(null),
		loop = true,
		onInteractOutside = (() => {}),
		onCloseAutoFocus = (() => {}),
		preventScroll = true,
		// we need to explicitly pass this prop to the PopperLayer to override
		// the default menu behavior of handling outside interactions on the trigger
		onEscapeKeydown = (() => {}),
		forceMount = false,
		style,
		...restProps
	}: ContextMenuContentStaticProps = $props();

	const contentState = MenuContentState.create({
		id: { get current() { return id; } },
		loop: { get current() { return loop; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		onCloseAutoFocus: { get current() { return onCloseAutoFocus; } },
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));

	function handleInteractOutside(e: PointerEvent) {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}

	function handleEscapeKeydown(e: KeyboardEvent) {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}

	function isValidEvent(e: PointerEvent) {
		if ("button" in e && e.button === 2) {
			const target = e.target as HTMLElement;
			if (!target) return false;
			const isAnotherContextTrigger =
				target.closest(`[${CONTEXT_MENU_TRIGGER_ATTR}]`) !==
				contentState.parentMenu.triggerNode;
			return isAnotherContextTrigger;
		}
		return false;
	}
</script>

<PopperLayer
	{...mergedProps}
	{...contentState.popperProps}
	ref={contentState.opts.ref}
	isStatic
	side="right"
	sideOffset={2}
	align="start"
	open={contentState.parentMenu.opts.open.current}
	{preventScroll}
	onInteractOutside={handleInteractOutside}
	onEscapeKeydown={handleEscapeKeydown}
	{isValidEvent}
	trapFocus
	{loop}
	{forceMount}
	{id}
	shouldRender={contentState.shouldRender}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(
			props,
			{ style: getFloatingContentCSSVars("context-menu") },
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
