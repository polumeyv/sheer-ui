<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { ContextMenuContentProps } from "$lib/components/context-menu/primitive/index";
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
		onOpenAutoFocus = (() => {}),
		preventScroll = true,
		side = "right",
		sideOffset = 2,
		align = "start",
		// we need to explicitly pass this prop to the PopperLayer to override
		// the default menu behavior of handling outside interactions on the trigger
		onEscapeKeydown = (() => {}),
		forceMount = false,
		trapFocus = false,
		style,
		...restProps
	}: ContextMenuContentProps = $props();

	const contentState = MenuContentState.create({
		id: { get current() { return id; } },
		loop: { get current() { return loop; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		onCloseAutoFocus: { get current() { return onCloseAutoFocus; } },
	});

	const mergedProps = $derived(
		mergeProps(restProps, contentState.props, {
			side,
			sideOffset,
			align,
			onOpenAutoFocus,
			isValidEvent,
			trapFocus,
			loop,
			id,
			ref: contentState.opts.ref,
			preventScroll,
			onInteractOutside: handleInteractOutside,
			onEscapeKeydown: handleEscapeKeydown,
			shouldRender: contentState.shouldRender,
		})
	);

	function handleInteractOutside(e: PointerEvent) {
		onInteractOutside(e);
		if (e.defaultPrevented) return;

		// don't close if the interaction is with a submenu content or items
		if (e.target && e.target instanceof Element) {
			const subContentSelector = `[${contentState.parentMenu.root.getBitsAttr("sub-content")}]`;
			if (e.target.closest(subContentSelector)) return;
		}
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
	open={contentState.parentMenu.opts.open.current}
	{forceMount}
>
	{#snippet popper({ props, wrapperProps })}
		{@const finalProps = mergeProps(
			props,
			{ style: getFloatingContentCSSVars("context-menu") },
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
