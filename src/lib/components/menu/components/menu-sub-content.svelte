<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import { tick } from 'svelte';
	import type { MenuSubContentProps } from '../types.js';
	import { MenuContentState } from '../menu.svelte.js';
	import { createSubmenuHandlers } from '../utils.js';
	import { createId } from '../../../internal/create-id.js';
	import PopperLayer from '../../../internal/popper-layer/popper-layer.svelte';
	import { getFloatingContentCSSVars } from '../../../internal/floating-layer/use-floating-layer.svelte.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		loop = true,
		isStatic = false,
		onInteractOutside = () => {},
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
	}: MenuSubContentProps & { isStatic?: boolean } = $props();

	const subContentState = MenuContentState.create({
		id: boxWith(() => id),
		loop: boxWith(() => loop),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		isSub: true,
		// svelte-ignore state_referenced_locally -- fixed per instance, like the Static/floating split it selects
		isStatic,
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
					`bg-popover text-popover-foreground ${isStatic ? 'popup-surface popup-surface-static' : 'popup-surface'} z-50 min-w-32 origin-(--bits-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg`,
			},
			restProps,
			subContentState.props,
			{
				onkeydown,
				[dataAttr]: '',
			},
		),
	);

	function handleOpenAutoFocus(e: Event) {
		onOpenAutoFocusProp(e);
		if (e.defaultPrevented) return;
		// static content is in the DOM before the open pass, so the focus target only
		// settles a tick later; floating content hands off to the roving group instead
		if (isStatic) {
			tick().then(() => {
				e.preventDefault();
				if (subContentState.parentMenu.root.isKeyboard) {
					subContentState.parentMenu.contentNode?.focus();
				}
			});
			return;
		}
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
	{side}
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
	{isStatic}
	{loop}
	{trapFocus}
	present={subContentState.parentMenu.present}
>
	{#snippet popper({ props })}
		<!-- mergedProps already reached `props` through the layer's restProps, minus the keys
		PopperLayer destructures for itself (id, dir, style) — only those are re-added, since
		re-merging the whole bag composes the handlers twice (one keypress, two typeahead steps) -->
		{@const finalProps = mergeProps(props, { id, dir: mergedProps.dir, style: mergedProps.style }, { style: getFloatingContentCSSVars('menu') }, { style }, { style: subContentState.contentStyle })}
		{#if child}
			{@render child({
				props: finalProps,
				...subContentState.snippetProps,
			})}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
