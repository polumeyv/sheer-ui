<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { MenuSubContentProps } from "$lib/components/_shared/menu/index";
	import { dispatchMenuOpen } from "$lib/components/_shared/menu/attrs";
	import { MenuContentState } from "$lib/components/_shared/menu/content.svelte";
	import { SUB_CLOSE_KEYS } from "$lib/components/_shared/menu/utils";
	import { createId } from "$lib/vendor/create-id";
	import PopperLayer from "$lib/components/_shared/utilities/popper-layer/popper-layer.svelte";
	import { getFloatingContentCSSVars } from "$lib/vendor/floating-svelte/floating-utils.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		loop = true,
		onInteractOutside = (() => {}),
		forceMount = false,
		onEscapeKeydown = (() => {}),
		interactOutsideBehavior = "defer-otherwise-close",
		escapeKeydownBehavior = "defer-otherwise-close",
		onOpenAutoFocus: onOpenAutoFocusProp = (() => {}),
		onCloseAutoFocus: onCloseAutoFocusProp = (() => {}),
		onFocusOutside = (() => {}),
		side = "right",
		trapFocus = false,
		style,
		...restProps
	}: MenuSubContentProps = $props();

	const subContentState = MenuContentState.create({
		id: { get current() { return id; } },
		loop: { get current() { return loop; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		isSub: true,
		onCloseAutoFocus: { get current() { return handleCloseAutoFocus; } },
	});

	function onkeydown(e: KeyboardEvent) {
		const isKeyDownInside = (e.currentTarget as HTMLElement).contains(e.target as HTMLElement);
		const isCloseKey = SUB_CLOSE_KEYS[
			subContentState.parentMenu.root.opts.dir.current
		].includes(e.key);
		if (isKeyDownInside && isCloseKey) {
			subContentState.parentMenu.onClose();
			const triggerNode = subContentState.parentMenu.triggerNode;
			triggerNode?.focus();
			e.preventDefault();
		}
	}

	const dataAttr = $derived(subContentState.parentMenu.root.getBitsAttr("sub-content"));

	const mergedProps = $derived(
		mergeProps(restProps, subContentState.props, {
			side,
			onkeydown,
			[dataAttr]: "",
		})
	);

	function handleOpenAutoFocus(e: Event) {
		onOpenAutoFocusProp(e);
		if (e.defaultPrevented) return;
		e.preventDefault();
		if (
			subContentState.parentMenu.root.isUsingKeyboard &&
			subContentState.parentMenu.contentNode
		) {
			dispatchMenuOpen(subContentState.parentMenu.contentNode);
		}
	}

	function handleCloseAutoFocus(e: Event) {
		onCloseAutoFocusProp(e);
		if (e.defaultPrevented) return;
		e.preventDefault();
	}

	function handleInteractOutside(e: PointerEvent) {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		subContentState.parentMenu.onClose();
	}

	function handleEscapeKeydown(e: KeyboardEvent) {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		subContentState.parentMenu.onClose();
	}

	function handleOnFocusOutside(e: FocusEvent) {
		onFocusOutside(e);
		if (e.defaultPrevented) return;
		if (!(e.target instanceof HTMLElement)) return;
		if (e.target.id === subContentState.parentMenu.triggerNode?.id) return;
		const parentContent = subContentState.parentMenu.parentMenu?.contentNode;
		if (parentContent?.contains(e.target)) {
			subContentState.parentMenu.onClose();
			e.preventDefault();
			return;
		}
		// focus moved to a descendant sub-content rendered in a portal
		const subContentSelector = `[${subContentState.parentMenu.root.getBitsAttr("sub-content")}]`;
		if (e.target.closest(subContentSelector)) {
			e.preventDefault();
			return;
		}
		subContentState.parentMenu.onClose();
	}
</script>

<PopperLayer
	{...mergedProps}
	ref={subContentState.opts.ref}
	{interactOutsideBehavior}
	{escapeKeydownBehavior}
	onCloseAutoFocus={forceMount ? undefined : handleCloseAutoFocus}
	onOpenAutoFocus={handleOpenAutoFocus}
	open={subContentState.parentMenu.opts.open.current}
	onInteractOutside={handleInteractOutside}
	onEscapeKeydown={handleEscapeKeydown}
	onFocusOutside={handleOnFocusOutside}
	preventScroll={false}
	{loop}
	{trapFocus}
	{forceMount}
	shouldRender={subContentState.shouldRender}
>
	{#snippet popper({ props, wrapperProps })}
		{@const finalProps = mergeProps(
			props,
			mergedProps,
			{ style: getFloatingContentCSSVars("menu") },
			{ style }
		)}
		{#if child}
			{@render child({
				props: finalProps,
				wrapperProps,
				...subContentState.snippetProps,
			})}
		{:else}
			<div {...wrapperProps}>
				<div {...finalProps}>
					{@render children?.()}
				</div>
			</div>
		{/if}
	{/snippet}
</PopperLayer>
