<script lang="ts">
	import { boxWith, mergeProps } from '$lib/internal/toolbelt.js';
	import type { DropdownMenuContentProps } from '../types.js';
	import { MenuContentState } from '$lib/components/menu/menu.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import PopperLayer from '$lib/components/utilities/popper-layer/popper-layer.svelte';
	import { getFloatingContentCSSVars } from '$lib/internal/floating-svelte/floating-utils.svelte.js';
	import PopperLayerForceMount from '$lib/components/utilities/popper-layer/popper-layer-force-mount.svelte';

	const uid = $props.id();

	let {
		id = createId(uid),
		child,
		children,
		ref = $bindable(null),
		loop = true,
		sideOffset = 4,
		onInteractOutside = () => {},
		onEscapeKeydown = () => {},
		onCloseAutoFocus = () => {},
		forceMount = false,
		trapFocus = false,
		style,
		...restProps
	}: DropdownMenuContentProps = $props();

	const contentState = MenuContentState.create({
		id: boxWith(() => id),
		loop: boxWith(() => loop),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'dropdown-menu-content',
				class:
					'bg-popover text-popover-foreground transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 max-h-(--bits-dropdown-menu-content-available-height) min-w-[8rem] origin-(--bits-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md outline-none',
				sideOffset,
			},
			restProps,
			contentState.props,
		),
	);

	function handleInteractOutside(e: PointerEvent) {
		contentState.handleInteractOutside(e);
		if (e.defaultPrevented) return;
		onInteractOutside(e);
		if (e.defaultPrevented) return;

		// don't close if the interaction is with a submenu content or items
		if (e.target && e.target instanceof Element) {
			const subContentSelector = `[${contentState.parentMenu.root.getBitsAttr('sub-content')}]`;
			if (e.target.closest(subContentSelector)) return;
		}
		contentState.parentMenu.onClose();
	}
	function handleEscapeKeydown(e: KeyboardEvent) {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		enabled={contentState.parentMenu.opts.open.current}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		{trapFocus}
		{loop}
		forceMount={true}
		{id}
		shouldRender={contentState.shouldRender}>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, { style: getFloatingContentCSSVars('dropdown-menu') }, { style })}
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
	</PopperLayerForceMount>
{:else if !forceMount}
	<PopperLayer
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		open={contentState.parentMenu.opts.open.current}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		{trapFocus}
		{loop}
		forceMount={false}
		{id}
		shouldRender={contentState.shouldRender}>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, { style: getFloatingContentCSSVars('dropdown-menu') }, { style })}
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
{/if}
