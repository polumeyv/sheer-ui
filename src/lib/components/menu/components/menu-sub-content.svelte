<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { MenuSubContentProps } from '../types.js';
	import { MenuContentState } from '../menu.svelte.js';
	import { createSubmenuHandlers } from '../utils.js';
	import { createId } from '../../../internal/create-id.js';
	import PopperLayer from '../../../internal/popper-layer/popper-layer.svelte';
	import { getFloatingContentCSSVars } from '../../../internal/floating-svelte/floating-utils.svelte.js';

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
		interactOutsideBehavior = 'defer-otherwise-close',
		escapeKeydownBehavior = 'defer-otherwise-close',
		onOpenAutoFocus: onOpenAutoFocusProp = () => {},
		onCloseAutoFocus: onCloseAutoFocusProp = () => {},
		onFocusOutside = () => {},
		side = 'right',
		trapFocus = false,
		style,
		...restProps
	}: MenuSubContentProps = $props();

	const subContentState = MenuContentState.create({
		id: boxWith(() => id),
		loop: boxWith(() => loop),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		isSub: true,
		onCloseAutoFocus: boxWith(() => handleCloseAutoFocus),
	});

	const { onkeydown, handleInteractOutside, handleEscapeKeydown, handleOnFocusOutside } = createSubmenuHandlers(subContentState, {
		onInteractOutside: () => onInteractOutside,
		onEscapeKeydown: () => onEscapeKeydown,
		onFocusOutside: () => onFocusOutside,
	});

	const dataAttr = $derived(subContentState.parentMenu.root.getBitsAttr('sub-content'));

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'dropdown-menu-sub-content',
				class:
					'bg-popover text-popover-foreground transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 min-w-[8rem] origin-(--bits-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
			},
			restProps,
			subContentState.props,
			{
				side,
				onkeydown,
				[dataAttr]: '',
			},
		),
	);

	function handleOpenAutoFocus(e: Event) {
		onOpenAutoFocusProp(e);
		if (e.defaultPrevented) return;
		e.preventDefault();
		if (subContentState.parentMenu.root.isKeyboard && subContentState.parentMenu.contentNode) {
			subContentState.parentMenu.focusFirstItem?.();
		}
	}

	function handleCloseAutoFocus(e: Event) {
		onCloseAutoFocusProp(e);
		if (e.defaultPrevented) return;
		e.preventDefault();
	}

</script>

<PopperLayer
	{...mergedProps}
	{id}
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
	{forceMount}
	shouldRender={subContentState.shouldRender}>
	{#snippet popper({ props, wrapperProps })}
		{@const finalProps = mergeProps(props, mergedProps, { style: getFloatingContentCSSVars('menu') }, { style })}
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
