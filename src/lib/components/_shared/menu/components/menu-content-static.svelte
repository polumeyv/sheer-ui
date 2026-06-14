<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { MenuContentStaticProps } from "$lib/components/_shared/menu/index";
	import { MenuContentState } from "$lib/components/_shared/menu/content.svelte";
	import { createId } from "$lib/vendor/create-id";
	import PopperLayer from "$lib/components/_shared/utilities/popper-layer/popper-layer.svelte";
	import { getFloatingContentCSSVars } from "$lib/vendor/floating-svelte/floating-utils.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		child,
		children,
		ref = $bindable(null),
		loop = true,
		onInteractOutside = (() => {}),
		onEscapeKeydown = (() => {}),
		onCloseAutoFocus: onCloseAutoFocusProp = (() => {}),
		forceMount = false,
		style,
		...restProps
	}: MenuContentStaticProps = $props();

	const contentState = MenuContentState.create({
		id: { get current() { return id; } },
		loop: { get current() { return loop; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		onCloseAutoFocus: { get current() { return onCloseAutoFocusProp; } },
	});

	const mergedProps = $derived(
		mergeProps(restProps, contentState.props, {
			style: { outline: "none" },
		})
	);

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
</script>

<PopperLayer
	{...mergedProps}
	{...contentState.popperProps}
	ref={contentState.opts.ref}
	open={contentState.parentMenu.opts.open.current}
	onInteractOutside={handleInteractOutside}
	onEscapeKeydown={handleEscapeKeydown}
	trapFocus
	{loop}
	{forceMount}
	isStatic
	{id}
	shouldRender={contentState.shouldRender}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(
			props,
			{ style: { outline: "none", ...getFloatingContentCSSVars("menu") } },
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
