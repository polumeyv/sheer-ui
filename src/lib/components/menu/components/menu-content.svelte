<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { MenuContentProps } from '../types.js';
	import { CONTEXT_MENU_TRIGGER_ATTR, MenuContentState } from '../menu.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import PopperLayer from '../../../internal/popper-layer/popper-layer.svelte';

	const uid = $props.id();

	let {
		id = createId(uid),
		child,
		children,
		ref = $bindable(null),
		loop = true,
		isStatic = false,
		onInteractOutside = () => {},
		onEscapeKeydown = () => {},
		onCloseAutoFocus: onCloseAutoFocusProp = () => {},
		forceMount = false,
		style,
		...restProps
	}: MenuContentProps & { isStatic?: boolean } = $props();

	const contentState = MenuContentState.create({
		id: boxWith(() => id),
		loop: boxWith(() => loop),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		onCloseAutoFocus: boxWith(() => onCloseAutoFocusProp),
	});

	const isContextMenu = $derived(contentState.parentMenu.root.opts.variant.current === 'context-menu');

	const mergedProps = $derived(mergeProps({ isValidEvent }, restProps, contentState.props));

	function handleInteractOutside(e: PointerEvent) {
		// a context-menu trigger is the whole right-clickable region, so the engine's
		// trigger deferral would preventDefault every outside click landing inside it
		if (!isContextMenu) {
			contentState.handleInteractOutside(e);
			if (e.defaultPrevented) return;
		}
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

	function isValidEvent(e: PointerEvent) {
		if (!isContextMenu) return false;
		if ('button' in e && e.button === 2) {
			const target = e.target as HTMLElement;
			if (!target) return false;
			const isAnotherContextTrigger = target.closest(`[${CONTEXT_MENU_TRIGGER_ATTR}]`) !== contentState.parentMenu.triggerNode;
			return isAnotherContextTrigger;
		}
		return false;
	}
</script>

<PopperLayer
	{...mergedProps}
	{...contentState.popperProps}
	ref={contentState.opts.ref}
	open={contentState.parentMenu.opts.open.current}
	onInteractOutside={handleInteractOutside}
	onEscapeKeydown={handleEscapeKeydown}
	{isStatic}
	{loop}
	{forceMount}
	{id}
	shouldRender={contentState.shouldRender}>
	{#snippet popper({ props, wrapperProps })}
		{@const finalProps = mergeProps(props, { style })}
		{#if child}
			{@render child({ props: finalProps, wrapperProps, ...contentState.snippetProps })}
		{:else if isStatic}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{:else}
			<div {...wrapperProps}>
				<div {...finalProps}>
					{@render children?.()}
				</div>
			</div>
		{/if}
	{/snippet}
</PopperLayer>
