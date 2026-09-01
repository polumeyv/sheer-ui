<script lang="ts">
	import type { PopperLayerImplProps } from './types.js';
	import PopperLayerInner from './popper-layer-inner.svelte';

	let {
		popper,
		open,
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
		isValidEvent = () => false,
		customAnchor = null,
		isStatic = false,
		ref,
		present,
		...restProps
	}: PopperLayerImplProps = $props();
</script>

<PopperLayerInner
	{popper}
	{onEscapeKeydown}
	{escapeKeydownBehavior}
	{preventOverflowTextSelection}
	{id}
	{side}
	{sideOffset}
	{align}
	{alignOffset}
	{arrowPadding}
	{avoidCollisions}
	{collisionPadding}
	{dir}
	{preventScroll}
	{style}
	{onPlaced}
	{customAnchor}
	{isStatic}
	enabled={open}
	{onInteractOutside}
	{onCloseAutoFocus}
	{onOpenAutoFocus}
	{interactOutsideBehavior}
	{loop}
	{trapFocus}
	{isValidEvent}
	{onFocusOutside}
	{present}
	{ref}
	{...restProps} />
