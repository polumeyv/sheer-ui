<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import type { ContextMenuContentProps } from '../types.js';
	import { CONTEXT_MENU_TRIGGER_ATTR, MenuContentState } from '../../../components/menu/menu.svelte.js';
	import { useId } from '../../../internal/use-id.js';
	import PopperLayer from '../../../components/utilities/popper-layer/popper-layer.svelte';
	import { getFloatingContentCSSVars } from '../../../internal/floating-svelte/floating-utils.svelte.js';

	let {
		id = useId(),
		child,
		children,
		ref = $bindable(null),
		loop = true,
		onInteractOutside = () => {},
		onCloseAutoFocus = () => {},
		onOpenAutoFocus = () => {},
		preventScroll = true,
		side = 'right',
		sideOffset = 2,
		align = 'start',
		// we need to explicitly pass this prop to the PopperLayer to override
		// the default menu behavior of handling outside interactions on the trigger
		onEscapeKeydown = () => {},
		forceMount = false,
		trapFocus = false,
		style,
		...restProps
	}: ContextMenuContentProps = $props();

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
				'data-slot': 'context-menu-content',
				class:
					'bg-popover text-popover-foreground transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 max-h-(--bits-context-menu-content-available-height) min-w-[8rem] origin-(--bits-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
			},
			restProps,
			contentState.props,
			{
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
			},
		),
	);

	function handleInteractOutside(e: PointerEvent) {
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
		if ('button' in e && e.button === 2) {
			const target = e.target as HTMLElement;
			if (!target) return false;
			const isAnotherContextTrigger = target.closest(`[${CONTEXT_MENU_TRIGGER_ATTR}]`) !== contentState.parentMenu.triggerNode;
			return isAnotherContextTrigger;
		}
		return false;
	}
</script>

<PopperLayer {...mergedProps} {...contentState.popperProps} open={contentState.parentMenu.opts.open.current} {forceMount}>
	{#snippet popper({ props, wrapperProps })}
		{@const finalProps = mergeProps(props, { style: getFloatingContentCSSVars('context-menu') }, { style })}
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
