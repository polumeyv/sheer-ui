<script lang="ts">
	import { mergeProps } from '../merge-props.js';
	import { scrollLockAttachment } from '../body-scroll-lock.svelte.js';
	import type { PopperLayerImplProps } from './types.js';
	import PopperContent from './popper-content.svelte';
	import { escapeKeydownAttachment } from '../escape-layer/use-escape-layer.svelte.js';
	import { interactOutsideAttachment } from '../dismissible-layer/use-dismissable-layer.svelte.js';
	import { createFocusScopeProps } from '../focus-scope/focus-scope.svelte.js';

	let {
		popper,
		onEscapeKeydown,
		escapeKeydownBehavior,
		preventOverflowTextSelection,
		id,
		side,
		sideOffset,
		align,
		alignOffset,
		arrowPadding,
		avoidCollisions,
		collisionPadding,
		hideWhenDetached,
		dir,
		preventScroll,
		style,
		onPlaced,
		onInteractOutside,
		onCloseAutoFocus,
		onOpenAutoFocus,
		onFocusOutside,
		interactOutsideBehavior = 'close',
		loop,
		trapFocus = true,
		isValidEvent,
		customAnchor = null,
		isStatic = false,
		enabled,
		ref,
		present,
		tooltip = false,
		contentPointerEvents = 'auto',
		...restProps
	}: Omit<PopperLayerImplProps, 'open' | 'children' | 'shouldRender'> & {
		enabled: boolean;
		contentPointerEvents?: 'auto' | 'none';
	} = $props();

	const resolvedPreventScroll = $derived(preventScroll ?? true);

	const escapeAttachment = escapeKeydownAttachment({
		escapeKeydownBehavior: () => escapeKeydownBehavior ?? 'close',
		onEscapeKeydown: () => onEscapeKeydown ?? (() => {}),
		enabled: () => enabled,
	});

	const dismissible = interactOutsideAttachment({
		id: () => id,
		interactOutsideBehavior: () => interactOutsideBehavior,
		onInteractOutside: () => onInteractOutside,
		onFocusOutside: () => onFocusOutside,
		enabled: () => enabled,
		isValidEvent: () => isValidEvent,
	});

	// Flags the open surface for the CSS text-selection guard in ui.css.
	const textSelectionGuard = $derived(enabled && (preventOverflowTextSelection ?? true) ? { 'data-text-selection-guard': '' } : {});

	// The content is always mounted, so the lock gates on `present` (open, or still exiting — the
	// window element lifecycle gave the old <ScrollLock> mount).
	const isPresent = $derived(present ?? enabled);
	const scrollLock = scrollLockAttachment({
		enabled: () => resolvedPreventScroll && isPresent,
	});

	const focusScope = createFocusScopeProps({
		enabled: () => enabled,
		trap: () => trapFocus,
		loop: () => loop ?? false,
		onCloseAutoFocus: () => onCloseAutoFocus ?? (() => {}),
		onOpenAutoFocus: () => onOpenAutoFocus ?? (() => {}),
	});
</script>

<PopperContent
	{isStatic}
	{id}
	{side}
	{sideOffset}
	{align}
	{alignOffset}
	{arrowPadding}
	{avoidCollisions}
	{collisionPadding}
	{hideWhenDetached}
	{dir}
	{style}
	{onPlaced}
	{customAnchor}
	{enabled}
	present={isPresent}
	{tooltip}>
	{#snippet content({ props: floatingProps })}
		{@render popper?.({
			props: mergeProps(
				restProps,
				floatingProps,
				dismissible.props,
				dismissible.attachment,
				focusScope.props,
				escapeAttachment,
				textSelectionGuard,
				scrollLock,
				{
					style: {
						pointerEvents: contentPointerEvents,
					},
				},
			),
		})}
	{/snippet}
</PopperContent>
