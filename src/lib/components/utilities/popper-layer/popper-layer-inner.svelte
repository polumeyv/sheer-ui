<script lang="ts">
	import { mergeProps } from '$lib/merge-props.js';
	import ScrollLock from '../scroll-lock/scroll-lock.svelte';
	import type { PopperLayerImplProps } from './types.js';
	import PopperContent from './popper-content.svelte';
	import { escapeKeydownAttachment } from '$lib/components/utilities/escape-layer/use-escape-layer.svelte.js';
	import { interactOutsideAttachment } from '$lib/components/utilities/dismissible-layer/use-dismissable-layer.svelte.js';
	import { textSelectionAttachment } from '$lib/components/utilities/text-selection-layer/use-text-selection-layer.svelte.js';
	import { createFocusScopeProps } from '$lib/components/utilities/focus-scope/focus-scope.svelte.js';

	let {
		popper,
		onEscapeKeydown,
		escapeKeydownBehavior,
		preventOverflowTextSelection,
		id,
		onPointerDown,
		onPointerUp,
		side,
		sideOffset,
		align,
		alignOffset,
		arrowPadding,
		avoidCollisions,
		collisionBoundary,
		collisionPadding,
		sticky,
		hideWhenDetached,
		updatePositionStrategy,
		strategy,
		dir,
		preventScroll,
		wrapperId,
		style,
		onPlaced,
		onInteractOutside,
		onCloseAutoFocus,
		onOpenAutoFocus,
		onFocusOutside,
		interactOutsideBehavior = 'close',
		loop,
		trapFocus = true,
		isValidEvent = () => false,
		customAnchor = null,
		isStatic = false,
		enabled,
		ref,
		tooltip = false,
		contentPointerEvents = 'auto',
		...restProps
	}: Omit<PopperLayerImplProps, 'open' | 'children' | 'shouldRender'> & {
		enabled: boolean;
		contentPointerEvents?: 'auto' | 'none';
	} = $props();

	const resolvedPreventScroll = $derived(preventScroll ?? true);
	const effectiveStrategy = $derived(strategy ?? (resolvedPreventScroll ? 'fixed' : 'absolute'));

	const escapeAttachment = escapeKeydownAttachment({
		escapeKeydownBehavior: () => escapeKeydownBehavior ?? 'close',
		onEscapeKeydown: () => onEscapeKeydown ?? (() => {}),
		enabled: () => enabled,
	});

	const dismissible = interactOutsideAttachment({
		id: () => id,
		interactOutsideBehavior: () => interactOutsideBehavior,
		onInteractOutside: () => onInteractOutside ?? (() => {}),
		onFocusOutside: () => onFocusOutside ?? (() => {}),
		enabled: () => enabled,
		isValidEvent: () => isValidEvent,
	});

	const textSelection = textSelectionAttachment({
		id: () => id,
		onPointerDown: () => onPointerDown ?? (() => {}),
		onPointerUp: () => onPointerUp ?? (() => {}),
		enabled: () => enabled && (preventOverflowTextSelection ?? true),
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
	{collisionBoundary}
	{collisionPadding}
	{sticky}
	{hideWhenDetached}
	{updatePositionStrategy}
	strategy={effectiveStrategy}
	{dir}
	{wrapperId}
	{style}
	{onPlaced}
	{customAnchor}
	{enabled}
	{tooltip}>
	{#snippet content({ props: floatingProps, wrapperProps })}
		{#if restProps.forceMount && enabled}
			<ScrollLock preventScroll={resolvedPreventScroll} />
		{:else if !restProps.forceMount}
			<ScrollLock preventScroll={resolvedPreventScroll} />
		{/if}
		{@render popper?.({
			props: mergeProps(
				restProps,
				floatingProps,
				dismissible.props,
				dismissible.attachment,
				focusScope.props,
				escapeAttachment,
				textSelection,
				{
					style: {
						pointerEvents: contentPointerEvents,
					},
				},
			),
			wrapperProps,
		})}
	{/snippet}
</PopperContent>
