<script lang="ts">
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import { tick } from "svelte";
	import type { MenuSubContentStaticProps } from "../types.js";
	import { MenuContentState } from "../menu.svelte.js";
	import { SUB_CLOSE_KEYS } from "../utils.js";
	import { createId } from "$lib/internal/create-id.js";
	import PopperLayer from "$lib/components/utilities/popper-layer/popper-layer.svelte";
	import { isHTMLElement } from "$lib/internal/is.js";
	import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";
	import PopperLayerForceMount from "$lib/components/utilities/popper-layer/popper-layer-force-mount.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		loop = true,
		onInteractOutside = () => {},
		forceMount = false,
		onEscapeKeydown = () => {},
		interactOutsideBehavior = "defer-otherwise-close",
		escapeKeydownBehavior = "defer-otherwise-close",
		onOpenAutoFocus: onOpenAutoFocusProp = () => {},
		onCloseAutoFocus: onCloseAutoFocusProp = () => {},
		onFocusOutside = () => {},
		trapFocus = false,
		style,
		...restProps
	}: MenuSubContentStaticProps = $props();

	const subContentState = MenuContentState.create({
		id: boxWith(() => id),
		loop: boxWith(() => loop),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		onCloseAutoFocus: boxWith(() => handleCloseAutoFocus),
		isSub: true,
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
		mergeProps(
			{
				"data-slot": "dropdown-menu-sub-content",
				class: "bg-popover text-popover-foreground transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 min-w-[8rem] origin-(--bits-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
			},
			restProps,
			subContentState.props,
			{
				onkeydown,
				[dataAttr]: "",
			}
		)
	);

	function handleOpenAutoFocus(e: Event) {
		onOpenAutoFocusProp(e);
		if (e.defaultPrevented) return;
		tick().then(() => {
			e.preventDefault();
			if (subContentState.parentMenu.root.isUsingKeyboard) {
				const subContentEl = subContentState.parentMenu.contentNode;
				subContentEl?.focus();
			}
		});
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
		if (!isHTMLElement(e.target)) return;
		if (e.target.id === subContentState.parentMenu.triggerNode?.id) return;
		const parentContent = subContentState.parentMenu.parentMenu?.contentNode;
		if (parentContent?.contains(e.target)) {
			subContentState.parentMenu.onClose();
			e.preventDefault();
			return;
		}
		// focus moved to a descendant sub-content (rendered in a portal)
		const subContentSelector = `[${subContentState.parentMenu.root.getBitsAttr("sub-content")}]`;
		if (e.target.closest(subContentSelector)) {
			e.preventDefault();
			return;
		}
		subContentState.parentMenu.onClose();
	}
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		ref={subContentState.opts.ref}
		{interactOutsideBehavior}
		{escapeKeydownBehavior}
		onOpenAutoFocus={handleOpenAutoFocus}
		enabled={subContentState.parentMenu.opts.open.current}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		onFocusOutside={handleOnFocusOutside}
		preventScroll={false}
		{loop}
		{trapFocus}
		isStatic
		shouldRender={subContentState.shouldRender}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(
				props,
				mergedProps,
				{ style: getFloatingContentCSSVars("menu") },
				{ style }
			)}
			{#if child}
				{@render child({ props: finalProps, ...subContentState.snippetProps })}
			{:else}
				<div {...finalProps}>
					{@render children?.()}
				</div>
			{/if}
		{/snippet}
	</PopperLayerForceMount>
{:else if !forceMount}
	<PopperLayer
		{...mergedProps}
		ref={subContentState.opts.ref}
		{interactOutsideBehavior}
		{escapeKeydownBehavior}
		onCloseAutoFocus={handleCloseAutoFocus}
		onOpenAutoFocus={handleOpenAutoFocus}
		open={subContentState.parentMenu.opts.open.current}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		onFocusOutside={handleOnFocusOutside}
		preventScroll={false}
		{loop}
		{trapFocus}
		isStatic
		shouldRender={subContentState.shouldRender}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(
				props,
				mergedProps,
				{ style: getFloatingContentCSSVars("menu") },
				{ style }
			)}
			{#if child}
				{@render child({ props: finalProps, ...subContentState.snippetProps })}
			{:else}
				<div {...finalProps}>
					{@render children?.()}
				</div>
			{/if}
		{/snippet}
	</PopperLayer>
{/if}
