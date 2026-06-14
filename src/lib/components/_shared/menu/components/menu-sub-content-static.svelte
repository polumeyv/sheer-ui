<script lang="ts">
	import { tick } from "svelte";
import { mergeProps } from '$lib/merge-props';
	import type { MenuSubContentStaticProps } from "$lib/components/_shared/menu/index";
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
		trapFocus = false,
		style,
		...restProps
	}: MenuSubContentStaticProps = $props();

	const subContentState = MenuContentState.create({
		id: { get current() { return id; } },
		loop: { get current() { return loop; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		onCloseAutoFocus: { get current() { return handleCloseAutoFocus; } },
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
		mergeProps(restProps, subContentState.props, {
			onkeydown,
			[dataAttr]: "",
		})
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
		if (!(e.target instanceof HTMLElement)) return;
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
