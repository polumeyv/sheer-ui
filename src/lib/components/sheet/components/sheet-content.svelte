<script lang="ts" module>
	import { sheetVariants, type Side } from '$lib/components/sheet/variants.js';
	export { sheetVariants, type Side };
</script>

<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import { DialogContentState } from '$lib/components/dialog/dialog.svelte.js';
	import type { DialogContentProps, DialogPortalProps } from '$lib/components/dialog/types.js';
	import DismissibleLayer from '$lib/components/utilities/dismissible-layer/dismissible-layer.svelte';
	import EscapeLayer from '$lib/components/utilities/escape-layer/escape-layer.svelte';
	import FocusScope from '$lib/components/utilities/focus-scope/focus-scope.svelte';
	import TextSelectionLayer from '$lib/components/utilities/text-selection-layer/text-selection-layer.svelte';
	import { createId } from '$lib/internal/create-id.js';
	import ScrollLock from '$lib/components/utilities/scroll-lock/scroll-lock.svelte';
	import Portal from '$lib/components/utilities/portal/portal.svelte';
	import SheetOverlay from './sheet-overlay.svelte';
	import SheetClose from './sheet-close.svelte';
	import XIcon from '@lucide/svelte/icons/x';
	import type { WithoutChildrenOrChild } from '$lib/utils.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		side = 'right',
		forceMount = false,
		onCloseAutoFocus = () => {},
		onOpenAutoFocus = () => {},
		onEscapeKeydown = () => {},
		onInteractOutside = () => {},
		trapFocus = true,
		preventScroll = true,
		restoreScrollDelay = null,
		portalProps,
		...restProps
	}: DialogContentProps & {
		side?: Side;
		portalProps?: WithoutChildrenOrChild<DialogPortalProps>;
	} = $props();

	const contentState = DialogContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(mergeProps({ 'data-slot': 'sheet-content', class: sheetVariants({ side }) }, restProps, contentState.props));
</script>

<Portal {...portalProps}>
	<SheetOverlay />
	{#if contentState.shouldRender || forceMount}
		<FocusScope
			ref={contentState.opts.ref}
			loop
			{trapFocus}
			enabled={contentState.root.opts.open.current}
			{onOpenAutoFocus}
			{onCloseAutoFocus}>
			{#snippet focusScope({ props: focusScopeProps })}
				<EscapeLayer
					{...mergedProps}
					enabled={contentState.root.opts.open.current}
					ref={contentState.opts.ref}
					onEscapeKeydown={(e) => {
						onEscapeKeydown(e);
						if (e.defaultPrevented) return;
						contentState.root.handleClose();
					}}>
					<DismissibleLayer
						{...mergedProps}
						ref={contentState.opts.ref}
						enabled={contentState.root.opts.open.current}
						onInteractOutside={(e) => {
							onInteractOutside(e);
							if (e.defaultPrevented) return;
							contentState.root.handleClose();
						}}>
						<TextSelectionLayer {...mergedProps} ref={contentState.opts.ref} enabled={contentState.root.opts.open.current}>
							{#if child}
								{#if contentState.root.opts.open.current}
									<ScrollLock {preventScroll} {restoreScrollDelay} />
								{/if}
								{@render child({
									props: mergeProps(mergedProps, focusScopeProps),
									...contentState.snippetProps,
								})}
							{:else}
								<ScrollLock {preventScroll} />
								<div {...mergeProps(mergedProps, focusScopeProps)}>
									{@render children?.()}
									<SheetClose
										class="ring-offset-background focus-visible:ring-ring absolute inset-e-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none">
										<XIcon class="size-4" />
										<span class="sr-only">Close</span>
									</SheetClose>
								</div>
							{/if}
						</TextSelectionLayer>
					</DismissibleLayer>
				</EscapeLayer>
			{/snippet}
		</FocusScope>
	{/if}
</Portal>
