<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import ScrollLock from "$lib/components/_shared/utilities/scroll-lock/scroll-lock.svelte";
	import type { PopperLayerImplProps } from "$lib/components/_shared/utilities/popper-layer/index";
	import PopperContent from "$lib/components/_shared/utilities/popper-layer/popper-content.svelte";
	import EscapeLayer from "$lib/components/_shared/utilities/escape-layer/escape-layer.svelte";
	import DismissibleLayer from "$lib/components/_shared/utilities/dismissible-layer/dismissible-layer.svelte";
	import TextSelectionLayer from "$lib/components/_shared/utilities/text-selection-layer/text-selection-layer.svelte";
	import FocusScope from "$lib/components/_shared/utilities/focus-scope/focus-scope.svelte";

	let {
		popper,
		open,
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
		interactOutsideBehavior = "close",
		loop,
		trapFocus = true,
		isValidEvent = () => false,
		customAnchor = null,
		isStatic = false,
		ref,
		shouldRender,
		forceMount = false,
		tooltip = false,
		contentPointerEvents = "auto",
		...restProps
	}: PopperLayerImplProps = $props();

	// `forceMount` keeps the layer mounted regardless of presence so the consumer
	// controls mounting; otherwise we render only while the presence machinery says so.
	const enabled = $derived(open);
	const resolvedPreventScroll = $derived(preventScroll ?? true);
	const effectiveStrategy = $derived(strategy ?? (resolvedPreventScroll ? "fixed" : "absolute"));
</script>

{#if forceMount || shouldRender}
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
		{tooltip}
	>
		{#snippet content({ props: floatingProps, wrapperProps })}
			{#if forceMount && enabled}
				<ScrollLock preventScroll={resolvedPreventScroll} />
			{:else if !forceMount}
				<ScrollLock preventScroll={resolvedPreventScroll} />
			{/if}
			<FocusScope
				{onOpenAutoFocus}
				{onCloseAutoFocus}
				{loop}
				{enabled}
				{trapFocus}
				{forceMount}
				{ref}
			>
				{#snippet focusScope({ props: focusScopeProps })}
					<EscapeLayer {onEscapeKeydown} {escapeKeydownBehavior} {enabled} {ref}>
						<DismissibleLayer
							{id}
							{onInteractOutside}
							{onFocusOutside}
							{interactOutsideBehavior}
							{isValidEvent}
							{enabled}
							{ref}
						>
							{#snippet children({ props: dismissibleProps })}
								<TextSelectionLayer
									{id}
									{preventOverflowTextSelection}
									{onPointerDown}
									{onPointerUp}
									{enabled}
									{ref}
								>
									{@render popper?.({
										props: mergeProps(
											restProps,
											floatingProps,
											dismissibleProps,
											focusScopeProps,
											{
												style: {
													pointerEvents: contentPointerEvents,
												},
											}
										),
										wrapperProps,
									})}
								</TextSelectionLayer>
							{/snippet}
						</DismissibleLayer>
					</EscapeLayer>
				{/snippet}
			</FocusScope>
		{/snippet}
	</PopperContent>
{/if}
